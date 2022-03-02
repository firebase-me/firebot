import { Client, ActionRow, Embed, SelectMenuComponent } from 'discord.js';
import rn from 'random-number';
import JsonRW from 'jsonrw';
import { hexToRgb } from 'src/utils/color';
import selfroles from './microfunctions/selfroles';


const create = async (client: Client, config, message,state) => {
  const helpDoc = `./_help.json`;
  try {
    // filter
    if (message.author.bot || !message.content.startsWith(config.get('discord.command'))) return;

    // variable
    const msg = message.content.toLowerCase();
    const md = message.content.split(' ');
    // commands
    if (md[0] == '!Set.RoleManagment' && message.member.roles.cache.has(config.get('discord.roles.staff'))) {
      await message.delete();
      selfroles.create(client, config, message, state);
    }
    else
    if (md[0].toLowerCase() == `${config.get('discord.command')}help`)
      if (md[1].toLowerCase() == `set`) {
        // staff
        if (!message.member.roles.cache.has(config.get('discord.roles.staff'))) {
          const embed = new Embed()
            .setColor(hexToRgb(config.get('palette.secondary')))
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setDescription(`You must be a member of staff to use this command.`);
          return await message.channel.send({ embeds: [embed] });
        }

        // correct usage?
        if (!md[2] || !md[3]) {
          const embed = new Embed()
            .setColor(hexToRgb(config.get('palette.secondary')))
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setDescription(`Incorrect command usage. E.g. ${config.get('discord.command')}help set <title> <body>`);
          return await message.channel.send({ embeds: [embed] });
        }

        // save to json
        const help = await JsonRW.Read(helpDoc);
        help[message.guild.id].push({
          trigger: md[2].toLowerCase(),
          name: md[2],
          body: md.slice(3).join(' '),
        });
        JsonRW.Write(helpDoc, help);

        // reply
        const embed = new Embed()
          .setColor(hexToRgb(config.get('palette.primary')))
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription(
            `Set!\n\n> Name: **${md[2]}**\n> Content: **${md.slice(3).join(' ')}** \n\nTo make edits to this entry, use ${config.get(
              'discord.command',
            )}help set ${md[2].toLowerCase()} <body>`,
          );
        return await message.channel.send({ embeds: [embed] });
      } else if (md[1].toLowerCase() == `list`) {
        const help = await JsonRW.Read(helpDoc);
        const embed = new Embed()
          .setColor(hexToRgb(config.get('palette.primary')))
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription(
            `Current help list!\n\n NAME: DESCRIPTION \n${help[message.guild.id].reduce((agg, i) => (agg += `> **${i.trigger}:** *${i.name}* \n`), '')}\n\n use ***${config.get(
              'discord.command',
            )}help <name>***`,
          );
        return await message.channel.send({ embeds: [embed] });
      }

    if (md[0].toLowerCase() == `${config.get('discord.command')}help`) {
      // correct usage?
      if (!md[1]) {
        const embed = new Embed()
          .setColor(hexToRgb(config.get('palette.secondary')))
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription(`Incorrect command usage. E.g. ${config.get('discord.command')}help set <title> <body>`);
        return await message.channel.send({ embeds: [embed] });
      }

      // valid?
      const result = (await JsonRW.Read(helpDoc))[message.guild.id].filter((t) => t.trigger.toLowerCase() == md.slice(1).join(' ').toLowerCase())[0];
      if (result == null) {
        const embed = new Embed()
          .setColor(hexToRgb(config.get('palette.secondary')))
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription(`No guide was found by that name.`);
        return await message.channel.send({ embeds: [embed] });
      }

      // display
      const embed = new Embed().setColor(hexToRgb(config.get('palette.primary'))).setTitle(result.name).setDescription(result.body);
      await message.channel.send({ embeds: [embed] });
    }
  } catch (e) {
    console.log(e);
  }
};

export { create };
