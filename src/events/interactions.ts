import {} from 'discord.js';
import { StoreService } from 'src/store/store.service';
import rolemanagment from './microfunctions/commands/rolemanagment';
import selfroles from './microfunctions/selfroles';
import captcha from './microfunctions/verifycaptcha';
import JsonRW from 'jsonrw';

const invoke = async (client: any, config: any, event, state: StoreService) => {
  // Process slash commands
  if (event.isCommand() && event.inCachedGuild()) {
    if (event.commandName === 'role-manager') {
      if (event.options._group === 'roles' || event.options._group === 'categories') {
        let result;
        try {
          await event.deferReply({ ephemeral: true });
          const staffRole = (await JsonRW.Read('./_roles.json'))[event.guild.id]?.staff;
          console.log('Staff role:', staffRole);
          console.log('isStaff:', event.member.roles.cache.has(staffRole));
          if (staffRole && !event.member.roles.cache.has(staffRole)) {
            throw new Error('You must be a member of staff to use this command.');
          }
          if (event.options._group === 'roles')
            switch (event.options._subcommand) {
              case 'create':
                result = await rolemanagment.createRole(
                  event.guild,
                  event.options._hoistedOptions[0].value,
                  event.options._hoistedOptions[1].value,
                  event.options._hoistedOptions[2]?.value,
                );
                break;
              case 'delete':
                result = await rolemanagment.deleteRole(event.guild, event.options._hoistedOptions[0].value);
                break;
              case 'link':
                result = await rolemanagment.linkRole(
                  event.guild,
                  event.options._hoistedOptions[0].value,
                  event.options._hoistedOptions[1].value,
                );
                break;
              case 'delink':
                result = await rolemanagment.delinkRole(event.guild, event.options._hoistedOptions[0].value);
                break;
              case 'purge':
                result = await rolemanagment.purgeRoles(event.guild, event.options._hoistedOptions[0].value);
                break;
              default:
                result = 'No command found.';
                break;
            }
          if (event.options._group === 'categories')
            switch (event.options._subcommand) {
              case 'create':
                result = await rolemanagment.createCategory(event.guild, event.options._hoistedOptions[0].value);
                break;
              case 'delete':
                result = await rolemanagment.deleteCategory(event.guild, event.options._hoistedOptions[0].value);
                break;

              default:
                result = 'No command found.';
                break;
            }

          await event.editReply({
            content: '```diff\n+ ' + (result || 'Success') + '```',
            ephemeral: true,
            fetchReply: true,
          });
        } catch (error) {
          console.log('INTERACTION FAILED: ' + error);
          await event.editReply({
            content: '```diff\n- ' + error + '```',
            ephemeral: true,
            fetchReply: true,
          });
        }
      }
    }

    if (event.commandName === 'ping') {
      event.reply({ content: 'pong', ephemeral: true });
    }
  } else {
    // process verify click
    if (event.customId == 'welcome.verify') {
      // log attempt
      state.getState().attempts.push({
        id: event.user.id,
        time: Date.now(),
      });
      console.log(state.getState().attempts);
      // whisper with captcha
      await captcha.handle(client, config, event, state);
    }

    // Handle Self Role
    if (event.customId.startsWith('selfrole')) {
      //  == 'selfrole.framework.react'
      // Check if user has member role first
      // whisper with captcha
      await selfroles.handle(client, config, event, state);
    }
  }
};

export { invoke };
