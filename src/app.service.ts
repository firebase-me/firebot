import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits} from 'discord.js';
import { DataModule } from './store/store.module';
import ClientEvents from './events';

@Injectable()
export class AppService {

 private client: Client= new Client({intents:[
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
]});

constructor(
  private config: ConfigService,
  private cache: DataModule){
this.client.login(this.config.get('discord.token'));


this.client.on("ready", async () => {
  ClientEvents.ready.default(this.client,this.config);
});
this.client.on("interactionCreate", async (interaction) => {
  ClientEvents.interactions.create(this.client,this.config, interaction);
});
this.client.on("messageCreate", async message => {
  ClientEvents.messages.create(this.client,this.config,message);
});
}
}