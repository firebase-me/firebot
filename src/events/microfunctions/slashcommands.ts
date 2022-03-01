import { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder } from '@discordjs/builders';

export default async (client) => {
  const devServer = '946563674858979358';
  const commands = client.guilds.cache.get(devServer).commands;
  // <Client>.application.commands.set([])
  // <Guild>.commands([])
  client.guilds.cache.get(devServer).commands.set([]);
  // commands.delete();
  commands.create({
    name: 'ping',
    description: 'Replies with pong and calculates latency.',
  });

  const firebotRoles = new SlashCommandSubcommandGroupBuilder() // new SlashCommandBuilder()
    .setName('roles')
    .setDescription('Admin command for configuring the bot.')
    // ROLES
    .addSubcommand((subcommand) =>
      subcommand
        .setName('create')
        .setDescription('Create and add role to self roles.')
        .addStringOption((string) => string.setName('role').setDescription('The name of the role to create.').setRequired(true))
        .addRoleOption((category) => category.setName('category').setDescription('What category is this role available in?').setRequired(true)),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('delete')
        .setDescription('Delete role from self roles.')
        .addStringOption((role) => role.setName('role').setDescription('The name of the role to delete.').setRequired(true)),
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
    );

  const firebotCategories = new SlashCommandSubcommandGroupBuilder() // new SlashCommandBuilder()
    .setName('categories')
    .setDescription('Admin command for configuring the bot.')
    // CATEGORIES
    .addSubcommand((subcommand) =>
      subcommand
        .setName('create')
        .setDescription('Modify role managment settings.')
        .addStringOption((string) => string.setName('category').setDescription('The name of the role to create.').setRequired(true)),
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

  // const  botCommand = new SlashCommandBuilder()
  // .setName('firebot')
  // .setDescription('Admin command for configuring the bot.')
  // .addSubcommandGroup(firebotCommands)

  commands.create(roleManager.toJSON());
  // commands.create(botCommand.toJSON());
};
