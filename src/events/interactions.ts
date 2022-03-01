import { } from 'discord.js';
import { StoreService } from 'src/store/store.service';
import selfroles from './microfunctions/selfroles';
import captcha from './microfunctions/verifycaptcha';

const invoke = async (client: any, config: any, event, state: StoreService) => {
  // Process slash commands
  if (event.isCommand() && event.inCachedGuild()) {
    if (event.commandName === 'bot') {
      await event.deferReply({
        ephemeral: true,
      });
      if (event.options.getSubCommand() === 'setting') console.log('setting');
      event.editReply({
        content: 'What would you like to set?',
      });
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
