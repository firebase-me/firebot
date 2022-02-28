import { ActionRow, Embed, Interaction, InteractionCollector, InteractionResponseType, InteractionWebhook, SelectMenuComponent } from 'discord.js';
import selfroles from './microfunctions/selfroles';
import captcha from './microfunctions/verifycaptcha';

const create = async (client, config, event, state) => {
  
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
  if (event.customId.startsWith('selfrole')) { //  == 'selfrole.framework.react'
    // Check if user has member role first
    // whisper with captcha
    await selfroles.handle(client, config, event, state);
  }
};

export { create };
