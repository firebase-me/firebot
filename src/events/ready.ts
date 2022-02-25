import { Client, ActionRow, ButtonComponent, Embed, ButtonStyle, ChannelType } from "discord.js";

let attempted = [];

export default (client:Client, cache) => {
    
  // log
  console.log(`--> Bot online`);

  // form verification message
  const embed = new Embed()
      .setTitle(`Captcha Verification`)
      .setDescription(`Click below to begin the captcha verification process.`)
      .setColor([55,55,55])
  
  const row = new ActionRow()
      .addComponents(
          new ButtonComponent()
              .setCustomId('verify')
              .setLabel('Verify')
              .setStyle(ButtonStyle.Primary),
      )
  
  // send
  client.guilds.cache.first().channels.fetch(cache.get('discord.channels.verify'))
        .then(channel => {if(channel.type == ChannelType.GuildText) channel.send({ embeds: [embed], components: [row] })})
    //    

  // filter out attempts older than 30mins
  setInterval(() => {
      attempted = attempted.filter(t => t.time > (Date.now() - (1000*60*30)));
  }, (15000));
}