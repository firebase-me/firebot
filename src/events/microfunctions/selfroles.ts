import { ActionRow, ButtonComponent, ButtonStyle, ChannelType, ComponentType, Embed, SelectMenuComponent, SelectMenuInteraction } from 'discord.js';
import JsonRW from 'jsonrw';
import { StoreService } from 'src/store/store.service';
import { hexToRgb } from 'src/utils/color';

const handle = async (client, config, event, state) => {
  // FIND EXISTING MESSAGE FOR USER IF ONE EXISTS
  // ELSE CREATE NEW MESSAGE

  //

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
    // FUNCTIONAL ID
    if (method == '$back') {
      // GO BACK
      await paginate(client, config, event, state);
    }
    if (method == '$prev') {
      // PREV PAGE
      await paginate(client, config, event, state);
    }
    if (method == '$next') {
      // NEXT PAGE
      await paginate(client, config, event, state);
    }
    if (method == '$close') {
      // CLOSE
      await event.delete();
    }
    if (method == '$open') {
      // OPEN
      await paginate(client, config, event, state);
    }
  } else {
  }

  // open new dialog

  // new page
};

// Creates initial message for user to click on
const create = async (client, config, event, state) => {
  // Find verification message else post new one
  const rolesData = `./_roles.json`;
  const categories = await JsonRW.Read(rolesData);

  const embed = new Embed()
    .setTitle(`**ROLE MANAGMENT**`)
    .setDescription('```Select a button to manage your roles and options.```')
    .setColor(hexToRgb(config.get('palette.primary')));

  const options = [];
  categories.forEach((c) => {
    options.push(new ButtonComponent().setCustomId(`selfroles.$open.${c.name}`).setLabel(c.name).setStyle(ButtonStyle.Secondary));
  });

  const row = new ActionRow().addComponents(...options);

  // send
  client.guilds.cache
    .first()
    .channels.fetch(event.channel.id)
    .then((channel) => {
      if (channel.type == ChannelType.GuildText) channel.send({ embeds: [embed], components: [row] });
    });
};

// Paginate interactions
const paginate = async (client, config, event, state: StoreService) => {
  const LABEL_NEXT = 'Next >>';
  const LABEL_PREV = '<< Prev';
  const NUM_ITEMS_PER_ROW = 5;
  const NUM_ROWS_PER_PAGE = 5;

  const reply = await event.deferReply({ ephemeral: true });
  const rolesData = `./_roles.json`;
  const Roles = await JsonRW.Read(rolesData);

  const customIdParts = event.customId.split('.');
  const method = customIdParts[1];
  const modifier = customIdParts[2];
  let pageNum = 0;

  if (customIdParts.length >= 4) {
    pageNum = Number(customIdParts[3]);  // force to a number
    if (Number.isNaN(pageNum)) {
      console.error(`customIdParts[3] is NaN: ${customIdParts[3]}`);
      pageNum = 0;
    }
  }

  // LOAD AVAILABLE ROLES
  const roles = config.get('captcha');
  console.log('EVENT!:', event.member.roles.cache.keys());
  // LOAD USER ROLES
  const userRoles = await event.member.roles.cache.keys();

  // form embed
  const embed = new Embed().setColor([72, 89, 22])
    .setTitle(`Captcha Verification`)
    .setFooter({
      text: event.guild.name,
      iconURL: event.guild.iconURL(),
    });
  //.setImage(captchaTest.link);

  const options = [];
  Roles.find((c) => c.name == modifier).roles.forEach((r) => {
    options.push(new ButtonComponent()
      .setCustomId(`selfroles.${modifier}.${r.name.toLowerCase()}`)
      .setLabel(r.name)
      // .setEmoji(isNaN(r.icon[0]) ? r.icon : `{id:${r.icon}}`)
      .setStyle(ButtonStyle.Secondary));
  });

  const rows = [];
  const firstItemOffset = pageNum * NUM_ITEMS_PER_ROW * NUM_ROWS_PER_PAGE;
  let lastOffset = 0;

  console.log(JSON.stringify(options[0]));
  for (let i = 0; (i < NUM_ROWS_PER_PAGE && lastOffset < options.length); i++) {
    let offset = firstItemOffset + i * NUM_ITEMS_PER_ROW;
    lastOffset = Math.min(offset + NUM_ITEMS_PER_ROW, options.length);
    // console.log(`pageNum(${pageNum}) firstItemOffset(${firstItemOffset}) offset(${offset}) lastOffset(${lastOffset}) options.length(${options.length})`);
    let temp = options.slice(offset, lastOffset);
    const newRow = new ActionRow().addComponents(...temp);
    rows.push(newRow);
  }

  // method($open)   modifier(Country)
  let buttons = [];
  if (pageNum > 0) {
    buttons.push(new ButtonComponent().setCustomId(`selfroles.$prev.${modifier}.${pageNum - 1}`).setLabel(LABEL_PREV).setStyle(ButtonStyle.Secondary));
  }

  if (lastOffset < options.length) {
    buttons.push(new ButtonComponent().setCustomId(`selfroles.$next.${modifier}.${pageNum + 1}`).setLabel(LABEL_NEXT).setStyle(ButtonStyle.Secondary))
  }

  if (buttons.length > 0) {
    rows.push(new ActionRow().addComponents(...buttons));
  }

  // reply
  let xx = await event.editReply({
    embeds: [embed],
    components: rows,
    ephemeral: true,
    fetchReply: true,
  });

  // collector
  const collector = xx.createMessageComponentCollector({
    // filter: (m) => m.author.id == event.author.id,
    componentType: ComponentType.SelectMenu,
    time: 4.32e7,
    max: 1,
    fetchReply: true,
  });
};
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
