import {} from 'discord.js';
import { StoreService } from 'src/store/store.service';
import rolemanagment from './microfunctions/commands/rolemanagment';
import selfroles from './microfunctions/selfroles';
import captcha from './microfunctions/verifycaptcha';

const invoke = async (client: any, config: any, event, state: StoreService) => {
  // Process slash commands
  if (event.isCommand() && event.inCachedGuild()) {
    // console.log(`--> Command: ${event.commandName}`);
    // console.log(`--> Options: ${JSON.stringify(event.options)}`);
    // Command: role-manager
    // Options: {"_group":"roles",
    // "_subcommand":"create",
    // "_hoistedOptions":[{
    //     "name":"role",
    //     "type":3,
    //     "value":"test"
    // },{
    //     "name":"category",
    //     "type":8,
    //     "value":"947830412070240306",
    //     "role":{"guild":"946563674858979358","icon":null,"unicodeEmoji":null,"id":"947830412070240306","name":"== Platforms ==","color":0,"hoist":false,"rawPosition":40,"permissions":"556302140929","managed":false,"mentionable":false,"tags":null,"createdTimestamp":1646050780075}
    // }]}

    // // --> Options: {"_group":"roles",
    // "_subcommand":"create",
    // "_hoistedOptions":
    // [{
    //   "name":"role",
    //   "type":3,"value":
    //   "Test role"
    // },{
    //   "name":"category",
    //   "type":8,
    //   "value":"947830412070240306"
    // },{
    //   "name":"icon",
    //   "type":3,
    //   "value":"<:react:841134994944426014>"}
    // ]}

    if (event.commandName === 'role-manager') {
      if (event.options._group === 'roles') {
        console.log(`--> Options: ${JSON.stringify(event.options)}`);
        let result;
        try{
          await event.deferReply({ ephemeral: true });
        switch (event.options._subcommand) {
          case 'create':
            result = await rolemanagment.createRole(client, event.options._hoistedOptions[0].value, event.options._hoistedOptions[1].value, event.options._hoistedOptions[2].value);
            break;
          case 'delete':
            result = await rolemanagment.deleteRole(client, event.options._hoistedOptions[0].value);
            break;
          case 'link':
            result = await rolemanagment.linkRole(client, event.options._hoistedOptions[0].value, event.options._hoistedOptions[1].value);
            break;
          case 'delink':
            result = await rolemanagment.delinkRole(client, event.options._hoistedOptions[0].value);
            break;
            case 'purge':
              result = await rolemanagment.purgeRoles(client, event.options._hoistedOptions[0].value);
              break;
          default:
            break;
            
        }  
        await event.editReply({
          content: "```diff\n+ " + (result || "Success") + "```",
          ephemeral: true,
          fetchReply: true,
        });
      } catch (error) {
        await event.editReply({
          content: "```diff\n- " + error + "```",
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
