import { ActionRow, ComponentType, Embed, SelectMenuComponent, SelectMenuInteraction } from 'discord.js';
import rn from 'random-number';

const create = async (client, config, event, state) => {
  const reply = await event.deferReply({ ephemeral: true });
  const captcha = config.get('captcha');

  const captchaTest =
    captcha[
      rn({
        min: 0,
        max: captcha.length - 1,
        integer: true,
      })
    ];

  // form embed
  const embed = new Embed()
    .setColor([72, 89, 22])
    .setTitle(`Captcha Verification`)
    .setFooter({
      text: event.guild.name,
      iconURL: event.guild.iconURL(),
    })
    .setImage(captchaTest.link);

  const options = [];
  captchaTest.options.forEach((t) => {
    options.push({
      label: t,
      //   description: 'DESCRIPTION PLACE HOLDER',
      value: t,
    });
  });

  const row = new ActionRow().addComponents(
    new SelectMenuComponent()
      .setCustomId('welcome.captcha')
      .setPlaceholder('Select the matching code!')
      .addOptions(...options),
  );

  // reply
  let xx = await event.editReply({
    embeds: [embed],
    components: [row],
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

  collector.on('collect', async (i:SelectMenuInteraction) => {
        const code = i.values[0];
        await event.editReply({ embeds: [embed], components: [], ephemeral: true }).catch((err) => {});
    
        if (code != captchaTest.correct) {
          const embed = new Embed()
            .setColor([100, 0, 0])
            .setAuthor({
              iconURL: event.user.displayAvatarURL(),
              name: event.user.tag,
            })
            .setDescription(
              `Incorrect. ${state.getState().attempts.filter((t) => t.id == event.user.id).length >= 3 ? `You will now be kicked.` : `Try again by clicking the button again.`}`,
            );
          await i.reply({ embeds: [embed], ephemeral: true }).catch((err) => {});
    
          if (state.getState().attempts.filter((t) => t.id == event.user.id).length >= 3) await event.member.kick().catch((err) => console.log(`No permissions to kick!`,err));
        } else {
          const embed = new Embed()
            .setColor([0, 255, 0])
            .setAuthor({
              iconURL: event.user.displayAvatarURL(),
              name: event.user.tag,
            })
            .setDescription(`Correct! The verified role will be assigned to you in a few moments.`);
          await i.update({ embeds: [embed] }).catch((err) => {});
            console.log(config.get('discord.roles.verified'))
          await event.member.roles.add(config.get('discord.roles.member')).catch((err) => console.log(`No permissions to assign roles!`,err));
        }
      });

  console.log('SET STATE CAPTCHA', event.user.name);
};

const validate = async (client, config, event, state) => {
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

export default { create, validate };
