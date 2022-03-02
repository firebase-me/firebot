import { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder } from '@discordjs/builders';


export default async (client) => {
  // const commands = client.guilds.cache.get(client.guild.id).commands;
  // <Guild>.commands([])
  // client.guilds.cache.get(client.guild.id).commands.set([]);
  // commands.delete();

  const firebotRoles = new SlashCommandSubcommandGroupBuilder() // new SlashCommandBuilder()
    .setName('roles')
    .setDescription('Admin command for configuring the bot.')
    // ROLES
    .addSubcommand((subcommand) =>
      subcommand
        .setName('create')
        .setDescription('Create and add role to self roles.')
        .addStringOption((string) => string.setName('role').setDescription('The name of the role to create.').setRequired(true))
        .addRoleOption((category) => category.setName('category').setDescription('What category is this role available in?').setRequired(true))
        .addStringOption((string) => string.setName('icon').setDescription('The icon of the role to create.').setRequired(false)),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('delete')
        .setDescription('Delete role from self roles.')
        .addRoleOption((role) => role.setName('role').setDescription('The role to delete from self roles.').setRequired(true)),
    )
    // LINK ROLES
    .addSubcommand((subcommand) =>
      subcommand
        .setName('link')
        .setDescription('Modify role managment settings.')
        .addRoleOption((role) => role.setName('role').setDescription('The role to add to self roles.').setRequired(true))
        .addRoleOption((category) => category.setName('category').setDescription('The category for this role').setRequired(true)),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('delink')
        .setDescription('Modify role managment settings.')
        .addRoleOption((role) => role.setName('role').setDescription('The role to remove to self roles.').setRequired(true)),
    )
    .addSubcommand((subcommand) =>
    subcommand
      .setName('purge')
      .setDescription('Purge all unused roles.')
      .addStringOption((string) => string.setName('response').setDescription('Please confirm "YES" you wish to purge unused roles. (cannot be undone)').setRequired(false)),
  );

  const firebotCategories = new SlashCommandSubcommandGroupBuilder() // new SlashCommandBuilder()
    .setName('categories')
    .setDescription('Admin command for configuring the bot.')
    // CATEGORIES
    .addSubcommand((subcommand) =>
      subcommand
        .setName('create')
        .setDescription('Modify role managment settings.')
        .addStringOption((string) => string.setName('category').setDescription('The name of the role to create.').setRequired(true))
        .addStringOption((string) => string.setName('icon').setDescription('The icon of the role to create.').setRequired(false)),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('delete')
        .setDescription('Delete a category role.')
        .addRoleOption((role) => role.setName('category').setDescription('The category to delete.').setRequired(true))
        .addBooleanOption((role) => role.setName('purge-nested-roles').setDescription('force delete all nested roles').setRequired(true)),
    );

  const roleManager = new SlashCommandBuilder()
    .setName('role-manager')
    .setDescription('Admin command for configuring the bot.')
    .addSubcommandGroup(firebotRoles)
    .addSubcommandGroup(firebotCategories);

    
    // guild.commands.create({
    //   name: 'ping',
    //   description: 'Replies with pong and calculates latency.',
    // });
  // const  botCommand = new SlashCommandBuilder()
  // .setName('firebot')
  // .setDescription('Admin command for configuring the bot.')
  // .addSubcommandGroup(firebotCommands)


  client.application.commands.create(roleManager.toJSON())
  // const guilds = client.guilds.cache.map((guild) => guild);
  // for (const guild of guilds) {
  // guild.commands.create();
  // }
  // commands.create(botCommand.toJSON());
};
