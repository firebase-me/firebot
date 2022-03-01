import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from '@discordjs/builders';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { group } from 'console';
import { ApplicationCommandOptionType, Client, GatewayIntentBits } from 'discord.js';
import ClientEvents from './events';
import { StoreService } from './store/store.service';

@Injectable()
export class AppService {
  private client: Client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });

  constructor(private config: ConfigService, private state: StoreService) {
    this.client.login(this.config.get('discord.token'));

    this.client.on('ready', async () => {
      // SETUP BUILDER SCRIPTS
      // https://youtu.be/-YUaxBCWcR0?t=140

      ClientEvents.ready.default(this.client, this.config, this.state);
    });
    this.client.on('interactionCreate', async (interaction) => {
      ClientEvents.interactions.invoke(this.client, this.config, interaction, this.state);
    });
    this.client.on('messageCreate', async (message) => {
      ClientEvents.messages.create(this.client, this.config, message, this.state);
    });
    this.client.on('', async (message) => {
      ClientEvents.messages.create(this.client, this.config, message, this.state);
    });
  }
}
