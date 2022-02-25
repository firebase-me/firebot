import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { defineStore } from 'pinia';

import Datastore from 'nedb';
import path from 'path';

@Injectable()
export class DataService {
  static Instance: DataService;
  private db = {
    status: () => {},
    dbs: [],
  };
  private  cache = {
    status: () => {},
    stores: [],
  };

  private directory = '/../../data';
  private dbPath = {
    Members: path.join(this.directory, 'members.db'),
    VoiceChannels: path.join(this.directory, 'voice.db'),
    SocialClubs: path.join(this.directory, 'clubs.db'),
    ProcessQueue: path.join(this.directory, 'queue.db'),
    Schedule: path.join(this.directory, 'schedule.db'),
    Roles: path.join(this.directory, 'roles.db'),
    Guilds: path.join(this.directory, 'guilds.db'),
    Help: path.join(this.directory, 'help.db'),
    Captcha: path.join(this.directory, 'captcha.db'),
    Messages: path.join(this.directory, 'messages.db'), // do we really need this for rate limiting?
  };
  static Type = {
    MEMBER: 'Members',
    VOICE: 'VoiceChannels',
    CLUBS: 'SocialClubs',
    QUEUE: 'ProcessQueue',
    ROLES: 'Roles',
    SCHEDULE: 'Schedule',
    GUILDS: 'Guilds',
    HELP: 'Help',
  };
  constructor(private config: ConfigService) {
    if (DataService.Instance === undefined) DataService.Instance = this;
    else this.init();

  }

  docHelp = () => {}

  
  private init = () => {
    const helpStore = defineStore('help', {
        state: () => ({
          commands: [],
          filter: 'all',
          nextId: 0,
        }),
        getters: {
          findHelp: (state) => {
            return state.commands.filter((command) => {
              return command.filter === state.filter;
            });
          },
        },
        actions: {
          createHelp: (payload) => {},
          updateHelp: (payload) => {},
          deleteHelp: (payload) => {},
        },
      });
      this.cache.stores.push(helpStore);

  }
}
