// Packages 
const { MessageEmbed, Client, Intents, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const rn = require('random-number');
const fs = require('fs');
const client = new Client({intents:[
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES
]});

// Config
const { token, adminRole, prefix, verificationRole, verificationChannel, captcha } = require('./data/config.json');
let attempted = [];

// Listeners
client.on("ready", async () => {

    // log
    console.log(`--> Bot online`);

    // form verification message
    embed = new MessageEmbed()
        .setTitle(`Captcha Verification`)
        .setDescription(`Click below to begin the captcha verification process.`)
        .setColor('DARK_BLUE')
    
    row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('verify')
                .setLabel('Verify')
                .setStyle('SUCCESS'),
        )
    
    // send
    // c = await client.guilds.cache.first().channels.fetch(verificationChannel);
    // c.send({ embeds: [embed], components: [row] });
    event.channel.send({ embeds: [embed], components: [row] });

    // filter out attempts older than 30mins
    setInterval(() => {
        attempted = attempted.filter(t => t.time > (Date.now() - (1000*60*30)));
    }, (15000));
});
client.on("interactionCreate", async interaction => {

    // button?
    if(interaction.customId != "verify") return;

    // defer
    await interaction.deferReply({ ephemeral: true });

    // log attempt
    attempted.push({
        id: interaction.user.id,
        time: Date.now()
    });

    // select captcha
    selected = captcha[rn({
        min: 0,
        max: captcha.length - 1,
        integer: true
    })];

    // form embed
    embed = new MessageEmbed()
        .setColor('DARK_BLUE')
        .setTitle(`Captcha Verification`)
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        .setImage(selected.link)

    options = []
    selected.options.forEach(t => {
        options.push({
            label: t,
            value: t
        });
    });

    row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('select')
                .setPlaceholder('Select the matching code!')
                .addOptions(options),
        );
    
    // reply
    xx = await interaction.editReply({ embeds: [embed], components: [row], ephemeral: true });

    // collector
    const collector = xx.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 4.32e+7, max: 1 });
    collector.on('collect', async i => {
        code = i.values[0];

        await interaction.editReply({ embeds: [embed], components: [], ephemeral: true }).catch(err => {});

        if(code != selected.correct) {
            embed = new MessageEmbed()
                .setColor('DARK_RED')
                .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.tag })
                .setDescription(`Incorrect. ${attempted.filter(t => t.id == interaction.user.id).length >= 3 ? `You will now be kicked.` : `Try again by clicking the button again.`}`)
            await i.reply({ embeds: [embed], ephemeral: true }).catch(err => {});

            if(attempted.filter(t => t.id == interaction.user.id).length >= 3) await interaction.member.kick().catch(err => console.log(`No permissions to kick!`));
        } else {
            embed = new MessageEmbed()
                .setColor('GREEN')
                .setAuthor({ iconURL: interaction.user.displayAvatarURL(), name: interaction.user.tag })
                .setDescription(`Correct! The verified role will be assigned to you in a few moments.`)
            await i.reply({ embeds: [embed], ephemeral: true }).catch(err => {});

            await interaction.member.roles.add(verificationRole).catch(err => console.log(`No permissions to assign roles!`));
        }
    });
});
client.on("messageCreate", async message => {

    // filter
    if(message.author.bot || !message.content.startsWith(prefix)) return;

    // variable
    msg = message.content.toLowerCase();
    md = message.content.split(" ");

    // commands
    if(md[0].toLowerCase() == `${prefix}help` && md[1].toLowerCase() == `set`) {

        // staff
        if(!message.member.roles.cache.has(adminRole)) {
            embed = new MessageEmbed()
                .setColor('DARK_RED')
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`You must be a member of staff to use this command.`)
            return await message.reply({ embeds: [embed] });
        }

        // correct usage?
        if(!md[2] || !md[3]) {
            embed = new MessageEmbed()
                .setColor('DARK_RED')
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`Incorrect command usage. E.g. ${prefix}help set <title> <body>`)
            return await message.reply({ embeds: [embed] });
        }

        // save to json
        data = JSON.parse(fs.readFileSync(`./data/help.json`));
        data.filter(t => t.name.toLowerCase() != md[2].toLowerCase()); // enables overwriting
        data.push({
            name: md[2],
            body: md.slice(3).join(" ")
        });
        fs.writeFileSync(`./data/help.json`, JSON.stringify(data, null, 4));

        // reply
        embed = new MessageEmbed()
            .setColor('DARK_BLUE')
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setDescription(`Set!\n\n> Name: **${md[2]}**\n> Content: **${md.slice(3).join(" ")}** \n\nTo make edits to this entry, use ${prefix}help set ${md[2].toLowerCase()} <body>`)
        return await message.reply({ embeds: [embed] });
    }
    if(md[0].toLowerCase() == `${prefix}help`) {

        // correct usage?
        if(!md[1]) {
            embed = new MessageEmbed()
                .setColor('DARK_RED')
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`Incorrect command usage. E.g. ${prefix}help set <title> <body>`)
            return await message.reply({ embeds: [embed] });
        }

        // valid?
        result = JSON.parse(fs.readFileSync(`./data/help.json`)).filter(t => t.name.toLowerCase() == md.slice(1).join(" ").toLowerCase())[0];
        if(result == null) {
            embed = new MessageEmbed()
                .setColor('DARK_RED')
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(`No guide was found by that name.`)
            return await message.reply({ embeds: [embed] });
        }

        // display
        embed = new MessageEmbed()
            .setColor('DARK_BLUE')
            .setTitle(result.name)
            .setDescription(result.body)
        await message.reply({ embeds: [embed] });
    }
});

// Login
client.login(token);