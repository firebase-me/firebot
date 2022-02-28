import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Djinn, DjinnService } from 'djinn-state';
import _ from 'lodash';

import Datastore from 'nedb';
import path from 'path';
import nestedPath from 'src/utils/nested.path';

@Injectable()
export class StoreService implements OnApplicationBootstrap{
  static Instance: StoreService;
  private djinn = new Djinn();
  private db = {
    status: () => {},
    dbs: [],
  };
  private state = {
    attempts: [],
    collectors: [],
    whispers: {},
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
  onApplicationBootstrap() {
      // this.db.doDataInitialization();
  }
  constructor(private config: ConfigService) {

  }

  docHelp = () => {}
  getState = (path?) => {
    if(!path)
    return StoreService.Instance.state
    else return _.get(StoreService.Instance.state, path,undefined);
  }
  setState = (path:string,  payload?:any) => {
    const SIS = StoreService.Instance.state;
    if(!_.has(SIS, path)) return;
    switch(typeof payload) {
      // case 'push': if(Array.isArray(value)) value.push(payload); break;
      // case 'pop': if(Array.isArray(value)) _.pullAllBy(array, [...payload.map(i=> { return {[i.key]: i.value}}){ 'x': 1 }, { 'x': 3 }], 'x');; break;

      case 'undefined': _.unset(SIS, path); break;
      default: _.set(SIS, path, payload); break;
    }
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