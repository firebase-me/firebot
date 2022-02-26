import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Djinn, DjinnService } from 'djinn-state';

import Datastore from 'nedb';
import path from 'path';

@Injectable()
export class StoreService {
  static Instance: StoreService;
  private djinn = new Djinn();
  private db = {
    status: () => {},
    dbs: [],
  };
  private  cache = {
    status: () => {},
    stores: [],
  };
  private state = {
    attempts: [],
    collectors: [],
  }

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
    CAPTCHA: 'Captcha',
  };
  constructor(private config: ConfigService) {

  }

  docHelp = () => {}
  getState = () => {
    return this.state
  }

  
  private init = () => {

  }
}

// class AuthService extends DjinnService {
//   state = {
//     token: '',
//   };
  
//   authenticate() {
//     this.patch({
//       token: 'someNewTokenHere',
//     });
//   }
// }

// class HttpService extends DjinnService {
//   initService() {
//     super.initService();
//     this.authService = djinn.getService(AuthService);
//   }
  
//   get(url) {
//     const token = this.authService.getState().token;
//     const headers = {
//       'Authorize': `Bearer ${token}`,
//     };
    
//     makeHttpRequest(url, headers);
//   }
// }
 
// // djinnServices.js
// djinn.register(AuthService);
// djinn.register(HttpService);
// djinn.start();
 
// // myPage.js
// const authService = djinn.getService(AuthService);
 
// const onStateUpdate = (update) => {
//   console.log(update); // { token: { current: 'someNewTokenHere', previous: '' } }  
// };
 
// const unsubscribe = authService.subscribe(onStateUpdate);
 
// authService.authenticate();
// // onStateUpdate() called
 
// console.log(authService.getState()); // { token: 'someNewTokenHere' }
 
// unsubscribe(); // Don't listen to changes anymore