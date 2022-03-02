import JsonRW from 'jsonrw';

export default async (client)=>{
    const roles = await JsonRW.Read('./_roles.json');
    const help = await JsonRW.Read('./_help.json');

    client.guilds.cache.array()
    .forEach(async (guild)=>{
        if(!roles[guild.id]){
            roles[guild.id] = [];
        }
        if(!help[guild.id]){
            help[guild.id] = [];
        }
    });

    await JsonRW.Write('./_roles.json', roles);
    await JsonRW.Write('./_help.json', help);

}