import { ActionRow, Embed, SelectMenuComponent } from 'discord.js';
import verifycaptcha from './microfunctions/verifycaptcha';

const create = async (client, config, event, state) => {
  if (event.isCommand()) {
  }
  if (event.isButton()) {
    // process captcha
    if (event.customId == 'welcome.verify') {
      console.log('verify');
      // log attempt
      state.getState().attempts.push({
        id: event.user.id,
        time: Date.now(),
      });
      console.log(state.getState().attempts);
      // whisper with captcha
      await verifycaptcha(client, config, event, state);
    }
  }
};

export { create };
