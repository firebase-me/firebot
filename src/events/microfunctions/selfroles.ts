import { APIMessageComponentEmoji } from 'discord-api-types/v9';
import {
  ActionRow,
  ButtonComponent,
  ButtonInteraction,
  ButtonStyle,
  ChannelType,
  ComponentType,
  Embed
} from 'discord.js';
import JsonRW from 'jsonrw';
import { StoreService } from 'src/store/store.service';
import { hexToRgb } from 'src/utils/color';
import _ from 'lodash';
const handle = async (client, config, event: ButtonInteraction, state: StoreService) => {
  // // FIND EXISTING MESSAGE FOR USER IF ONE EXISTS
  // let whisper = state.getState(['whispers', event.user.id]);
  // // ELSE CREATE NEW MESSAGE
  // if (!whisper) {
  // }

  // //

  const method = event.customId.split('.')[1];
  // METHODS:
  // selfrole.$back
  // selfrole.$prev
  // selfrole.$next
  // selfrole.$close
  // selfrole.$open
  // selfrole.category.rolename

  // IS FUNCTIONAL ID?
  if (method.startsWith('$')) {
    // // FUNCTIONAL ID
    // if (method == '$prev') {
    //   // PREV PAGE
    //   await paginate(client, config, event, state);
    // }
    // if (method == '$next') {
    //   // NEXT PAGE
    //   await paginate(client, config, event, state);
    // }
    if (method == '$open') {
      // OPEN
      await paginate(client, config, event, state);
    }
    if (method == '$close') {
      // CLOSE
      // await event.message.("TEST");//.deleteReply();
    }
    // if (method == '$select') {
    //   // SELECT
    //   await paginate(client, config, event, state);
    // }
    // if (method == '$back') {
    //   // GO BACK
    //   await paginate(client, config, event, state);
    // }
  }
  return;

  // open new dialog

  // new page
};

// Creates initial message for user to click on
const create = async (client, config, event, state) => {
  // Find verification message else post new one
  const rolesData = `./_roles.json`;
  const Roles = await JsonRW.Read(rolesData);

  const embed = new Embed()
    .setTitle(`**ROLE MANAGMENT**`)
    .setDescription('```Select a button to manage your roles and options.```')
    .setColor(hexToRgb(config.get('palette.primary')));

  const options = [];
  Roles[event.guild.id].selfRoles.forEach((c) => {
    options.push(new ButtonComponent().setCustomId(`selfroles.$open.${c.label.toLowerCase()}`).setLabel(c.label).setStyle(ButtonStyle.Secondary));
  });

  // FIXME: create new support for multiple pages with generic types
  // const newPage = await generatePage({customId: `selfroles.$open`}, 0, options);
  
  // sort array into smaller arrays of 5 elements each
  const rows = _.chunk(options, 5);
  const page = []
  rows.forEach((row) => page.push(new ActionRow().addComponents(...row)));


  // send
      if (event.channel.type == ChannelType.GuildText) event.channel.send({ embeds: [embed], components: page.splice (0, 5) });

  // client.guilds.cache.get(event.guild.id)
  //   .first()
  //   .channels.fetch(event.channel.id)
  //   .then((channel) => {
  //     if (channel.type == ChannelType.GuildText) channel.send({ embeds: [embed], components: page.splice (0, 5) });
  //   });

    return;
};

// Paginate interactions
const paginate = async (client, config, event, state: StoreService) => {
  await event.deferReply({ ephemeral: true });
  const idMeta = event.customId.split('.');
  let currentPage = 0;

  const method = idMeta[1];
  const operation = idMeta[2];
  console.log('Paginate:', idMeta);

  // LOAD AVAILABLE ROLES
  const Roles = await JsonRW.Read('./_roles.json');
  const catagory = Roles[event.guild.id].selfRoles.find((c) => c.label.toLowerCase() == operation.toLowerCase());

  // generate page elements
  const page = await generatePage(event, currentPage, catagory.roles, event.member.roles.cache);
  let message = "```diff\nPlease navigate the following menu to enable and disable roles.```.";

  // reply
  let xx = await event.editReply({
    content: message,
    // embeds: [page.embed],
    components: page.rows,
    ephemeral: true,
    fetchReply: true,
  });

  // collector
  const collector = xx.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 1000 * 60 * 10,
    fetchReply: true,
  });
  // ID MEANING: selfroles.$open.category.page
  // menu - action - modifier - page
  // selfroles - open - country - 0
  // selfroles - select - udcountry - 1
  collector.on('collect', async (i: ButtonInteraction) => {
    const idMeta = i.customId.split('.');
    const action = idMeta[1];
    const modifier = idMeta[2];
    const bias = idMeta[3];

    // refresh page
    if (action == '$close') {
    //   await i.update({
    //   content: "```Closing...```",
    //   // embeds: [newPage.embed],
    //   fetchReply: true,
    // });
      collector.stop('close');
      return;
    }
    if (action == '$select') {

      const memberRoles = event.member.roles.cache.map(r => r.id);
      const catagoryRoles = [... new Set(catagory.roles.map(r => r.id))];
      let roleCount = 0;

      for (const role of memberRoles) {
        if(catagoryRoles.includes(role)) {
          roleCount++;
        }
      }
      let msg="";
      let limited = false;

      if(catagory.max && roleCount >= catagory.max && bias == 'true') {
        msg = "- You have reached the maximum amount of roles for this category.";
        limited = true;
      }
      else
      msg = `+ You have ${bias == 'true' ? 'added' : 'removed'} the ${catagory.roles.find((c) => c.id == modifier).label} role.`;
      message = '```diff\n' + msg + '```';

      if (bias == 'true'&& !limited) await event.member.roles.add(modifier).catch((err) => console.log(`No permissions to assign roles!`, err));
      else await event.member.roles.remove(modifier).catch((err) => console.log(`No permissions to assign roles!`, err));
    }

    // refresh page
    if (action == '$next') currentPage++;
    if (action == '$prev') currentPage--;

    const newPage = await generatePage(i, currentPage, catagory.roles, event.member.roles.cache);
    await i.update({
      content: message,
      // embeds: [newPage.embed],
      components: newPage.rows,
      fetchReply: true,
    });
  });

  collector.on('end', (collected) => {
    console.log(`Collector ended with ${collected.size} items`);
    const msg = collected.first();
    const content = { content: '```diff\n- This interaction has closed.```',
      components: []
    };
    if(!msg) return;
    msg.editReply(content)
    .catch(() => 
    msg.update(content)
    .catch(() => console.log('Failed to update message')));
  });
};

const generatePage = async (event, page, options: btnOption[], selected = new Set()) => {
  // CREATE PAGE
  const NUM_ITEMS_PER_ROW = 5;
  const NUM_ROWS_PER_PAGE = 2;

  const customIdParts = event.customId.split('.');
  const modifier = customIdParts[2];
  console.log('CURRENT PAGE:', page);
  let pageNum = Number(page);

  // form embed
  // const embed = new Embed().setColor([72, 89, 22]).setTitle(`Captcha Verification`).setFooter({
  //   text: event.guild.name,
  //   iconURL: event.guild.iconURL(),
  // });
  //.setImage(captchaTest.link);

  const items = [];
  options.forEach((i) => {
    const userHas = selected.has(i.id);
    const btn = new ButtonComponent()
      .setCustomId(`selfroles.$select.${i.id}.${!userHas}`)
      .setLabel(i.label)
      .setStyle(userHas ? ButtonStyle.Primary : ButtonStyle.Secondary);
    if (i.icon) btn.setEmoji(isNaN(parseInt(i.icon)) ? { name: i.icon } : { id: i.icon });
    items.push(btn);
  });

  const rows = [];
  const firstItemOffset = pageNum * NUM_ITEMS_PER_ROW * NUM_ROWS_PER_PAGE;
  let lastOffset = 0;

  console.log(JSON.stringify(items[0]));
  for (let i = 0; i < NUM_ROWS_PER_PAGE && lastOffset < items.length; i++) {
    let offset = firstItemOffset + i * NUM_ITEMS_PER_ROW;
    lastOffset = Math.min(offset + NUM_ITEMS_PER_ROW, items.length);
    // console.log(`pageNum(${pageNum}) firstItemOffset(${firstItemOffset}) offset(${offset}) lastOffset(${lastOffset}) items.length(${items.length})`);
    let temp = items.slice(offset, lastOffset);
    const newRow = new ActionRow().addComponents(...temp);
    rows.push(newRow);
  }

  // method($open)   modifier(Country)
  let buttons = [];
  // if (pageNum > 0) {
  buttons.push(
    new ButtonComponent()
      .setCustomId(`selfroles.$prev.${modifier}`)
      .setLabel('<< Prev')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(pageNum <= 0),
  );

  buttons.push(new ButtonComponent().setCustomId(`selfroles.$close.${modifier}`).setLabel('Close').setStyle(ButtonStyle.Secondary).setDisabled(false));

  buttons.push(
    new ButtonComponent()
      .setCustomId(`selfroles.$next.${modifier}.${pageNum + 1}`)
      .setLabel('Next >>')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(lastOffset >= items.length),
  );

  if (buttons.length > 0) {
    rows.push(new ActionRow().addComponents(...buttons));
  }

  return { rows };
};

class btnOption {
  id: string;
  label: string;
  icon: string;
}
//         await event.editReply({ embeds: [embed], components: [], ephemeral: true }).catch((err) => {});

//         if (code != selected.correct) {
//           const embed = new Embed()
//             .setColor([100, 0, 0])
//             .setAuthor({
//               iconURL: event.user.displayAvatarURL(),
//               name: event.user.tag,
//             })
//             .setDescription(
//               `Incorrect. ${state.getState().attempts.filter((t) => t.id == event.user.id).length >= 3 ? `You will now be kicked.` : `Try again by clicking the button again.`}`,
//             );
//           await i.reply({ embeds: [embed], ephemeral: true }).catch((err) => {});

//           if (state.getState().attempts.filter((t) => t.id == event.user.id).length >= 3) await event.member.kick().catch((err) => console.log(`No permissions to kick!`));
//         } else {
//           const embed = new Embed()
//             .setColor([0, 255, 0])
//             .setAuthor({
//               iconURL: event.user.displayAvatarURL(),
//               name: event.user.tag,
//             })
//             .setDescription(`Correct! The verified role will be assigned to you in a few moments.`);
//           await i.reply({ embeds: [embed], ephemeral: true }).catch((err) => {});

//           await event.member.roles.add(config.get('discord.roles.verified')).catch((err) => console.log(`No permissions to assign roles!`));
//         }
//       });
// };

// const collectorCallback = async (i) => {

// //   collector.on('collect', async (i) => {
//     //   collector.on('collect', async (i) => {
//     console.log('COLLECTOR ON: ', i.value);
//     const code = i.values[0];

//     await event.editReply({ embeds: [embed], components: [], ephemeral: true }).catch((err) => {});

//     if (code != selected.correct) {
//       const embed = new Embed()
//         .setColor([100, 0, 0])
//         .setAuthor({
//           iconURL: event.user.displayAvatarURL(),
//           name: event.user.tag,
//         })
//         .setDescription(
//           `Incorrect. ${state.getState().attempts.filter((t) => t.id == event.user.id).length >= 3 ? `You will now be kicked.` : `Try again by clicking the button again.`}`,
//         );
//       await i.reply({ embeds: [embed], ephemeral: true }).catch((err) => {});

//       if (state.getState().attempts.filter((t) => t.id == event.user.id).length >= 3) await event.member.kick().catch((err) => console.log(`No permissions to kick!`));
//     } else {
//       const embed = new Embed()
//         .setColor([0, 255, 0])
//         .setAuthor({
//           iconURL: event.user.displayAvatarURL(),
//           name: event.user.tag,
//         })
//         .setDescription(`Correct! The verified role will be assigned to you in a few moments.`);
//       await i.reply({ embeds: [embed], ephemeral: true }).catch((err) => {});

//       await event.member.roles.add(config.get('discord.roles.verified')).catch((err) => console.log(`No permissions to assign roles!`));
//     }
//   });
// }

export default { create, handle };
