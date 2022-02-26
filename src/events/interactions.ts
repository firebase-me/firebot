import { ActionRow, Embed, SelectMenuComponent } from 'discord.js';
import rn from 'random-number';

const attempted = [];

const create = (client, config, event) => {
  client.on('interactionCreate', async (interaction) => {
    // button?
    if (interaction.customId != 'verify') return;

    // defer
    await interaction.deferReply({ ephemeral: true });

    // log attempt
    attempted.push({
      id: interaction.user.id,
      time: Date.now(),
    });

    // select captcha
    const captcha = config.get('captcha');
    const selected =
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
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      })
      .setImage(selected.link);

    const options = [];
    selected.options.forEach((t) => {
      options.push({
        label: t,
        // description: '',
        value: t,
      });
    });

    const row = new ActionRow().addComponents(
      new SelectMenuComponent()
        .setCustomId('select')
        .setPlaceholder('Select the matching code!')
        .addOptions(...options),
    );

    // reply
    const xx = await interaction.editReply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });

    // collector
    const collector = xx.createMessageComponentCollector({
      componentType: 'SELECT_MENU',
      time: 4.32e7,
      max: 1,
    });
    collector.on('collect', async (i) => {
      const code = i.values[0];

      await interaction
        .editReply({ embeds: [embed], components: [], ephemeral: true })
        .catch((err) => {});

      if (code != selected.correct) {
        const embed = new Embed()
          .setColor([100, 0, 0])
          .setAuthor({
            iconURL: interaction.user.displayAvatarURL(),
            name: interaction.user.tag,
          })
          .setDescription(
            `Incorrect. ${
              attempted.filter((t) => t.id == interaction.user.id).length >= 3
                ? `You will now be kicked.`
                : `Try again by clicking the button again.`
            }`,
          );
        await i.reply({ embeds: [embed], ephemeral: true }).catch((err) => {});

        if (attempted.filter((t) => t.id == interaction.user.id).length >= 3)
          await interaction.member
            .kick()
            .catch((err) => console.log(`No permissions to kick!`));
      } else {
        const embed = new Embed()
          .setColor([0, 255, 0])
          .setAuthor({
            iconURL: interaction.user.displayAvatarURL(),
            name: interaction.user.tag,
          })
          .setDescription(
            `Correct! The verified role will be assigned to you in a few moments.`,
          );
        await i.reply({ embeds: [embed], ephemeral: true }).catch((err) => {});

        await interaction.member.roles
          .add(config.get('discord.roles.verified'))
          .catch((err) => console.log(`No permissions to assign roles!`));
      }
    });
  });
};

export { create };
