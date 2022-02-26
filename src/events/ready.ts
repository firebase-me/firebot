import { Client, ActionRow, ButtonComponent, Embed, ButtonStyle, ChannelType } from 'discord.js';
import { hexToRgb } from './../utils/color';

export default (client: Client, config, state) => {
  // log
  console.log(`--> Bot online`);

  // Find verification message else post new one
  if (!config.get('discord.messages.verify')) {
    const embed = new Embed()
      .setTitle(`Captcha Verification`)
      .setDescription(`Click below to begin the captcha verification process.`)
      .setColor(hexToRgb(config.get('palette.secondary')));

    const row = new ActionRow().addComponents(new ButtonComponent()
    .setCustomId('welcome.verify')
    .setLabel('Verify')
    .setEmoji({ id:'740757073330962474'})
    .setStyle(ButtonStyle.Secondary)
    );

    // send
    client.guilds.cache
      .first()
      .channels.fetch(config.get('discord.channels.welcome'))
      .then((channel) => {
        if (channel.type == ChannelType.GuildText) channel.send({ embeds: [embed], components: [row] });
      });
  }

  // filter out attempts older than 30mins
  setInterval(() => {
    state.getState().attempts = state.getState().attempts.filter((t) => t.time > Date.now() - 1000 * 60 * 30);
  }, 15000);
};
