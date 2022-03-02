import { Client } from 'discord.js';
import JsonRW from 'jsonrw';

export default async (client:Client) => {
  const roles = await JsonRW.Read('./_roles.json');
  const help = await JsonRW.Read('./_help.json');

  client.guilds.cache.map(g=>g).forEach(async (guild) => {
    if (!roles[guild.id]) {
      roles[guild.id] = { protectedRoles: [], selfRoles: [], staff: null };
    }
    if (!help[guild.id]) {
      help[guild.id] = [];
    }
  });

  await JsonRW.Write('./_roles.json', roles);
  await JsonRW.Write('./_help.json', help);
};
