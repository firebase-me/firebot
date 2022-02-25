import {Client, ActionRow, Embed, SelectMenuComponent } from "discord.js";
import rn from 'random-number'
import JsonRW from 'jsonrw';

const attempted = [];

const create = async (client:Client, config, message) => {
    const helpDoc = `./help.json`
    try{
    // filter
    if(message.author.bot || !message.content.startsWith(config.get('discord.command'))) return;

    // variable
    const msg = message.content.toLowerCase();
    const md = message.content.split(" ");

    // commands
    if(md[0].toLowerCase() == `${config.get('discord.command')}help` && md[1].toLowerCase() == `set`) {

        // staff
        if(!message.member.roles.cache.has(config.get('discord.roles.staff'))) {
            const embed = new Embed()
                .setColor([100,0,0])
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`You must be a member of staff to use this command.`)
            return await message.reply({ embeds: [embed] });
        }

        // correct usage?
        if(!md[2] || !md[3]) {
            const embed = new Embed()
                .setColor([100,0,0])
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`Incorrect command usage. E.g. ${config.get('discord.command')}help set <title> <body>`)
            return await message.reply({ embeds: [embed] });
        }

        // save to json
        const data = await JsonRW.Read(helpDoc);
        data.filter(t => t.name.toLowerCase() != md[2].toLowerCase()); // enables overwriting
        data.push({
            name: md[2],
            body: md.slice(3).join(" ")
        });
        JsonRW.Write(helpDoc, data);

        // reply
        const embed = new Embed()
            .setColor([0,0,100])
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setDescription(`Set!\n\n> Name: **${md[2]}**\n> Content: **${md.slice(3).join(" ")}** \n\nTo make edits to this entry, use ${config.get('discord.command')}help set ${md[2].toLowerCase()} <body>`)
        return await message.reply({ embeds: [embed] });
    }
    if(md[0].toLowerCase() == `${config.get('discord.command')}help`) {

        // correct usage?
        if(!md[1]) {
            const embed = new Embed()
                .setColor([100,0,0])
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`Incorrect command usage. E.g. ${config.get('discord.command')}help set <title> <body>`)
            return await message.reply({ embeds: [embed] });
        }

        // valid?
        const result = (await JsonRW.Read(helpDoc)).filter(t => t.name.toLowerCase() == md.slice(1).join(" ").toLowerCase())[0];
        if(result == null) {
            const embed = new Embed()
                .setColor([100,0,0])
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`No guide was found by that name.`)
            return await message.reply({ embeds: [embed] });
        }

        // display
        const embed = new Embed()
            .setColor([0,0,100])
            .setTitle(result.name)
            .setDescription(result.body)
        await message.reply({ embeds: [embed] });
    }
} catch(e) {
    console.log(e);}
}

export { create }