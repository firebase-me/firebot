import { ActionRow, Embed, Interaction, InteractionCollector, InteractionResponseType, InteractionWebhook, SelectMenuComponent } from 'discord.js';
import captcha from './microfunctions/verifycaptcha';

const create = async (client, config, event, state) => {
  console.log('EVENT TYPE', event.customId);
  
  // process verify click
  if (event.customId == 'welcome.verify') {
    // log attempt
    state.getState().attempts.push({
      id: event.user.id,
      time: Date.now(),
    });
    console.log(state.getState().attempts);
    // whisper with captcha
    await captcha.create(client, config, event, state);
  }

  // process captcha
  if (event.customId == 'welcome.captcha') {
    // log attempt
    state.getState().attempts.push({
      id: event.user.id,
      time: Date.now(),
    });
    console.log(state.getState().attempts);
    // whisper with captcha
    await captcha.validate(client, config, event, state);
  }
};

export { create };
