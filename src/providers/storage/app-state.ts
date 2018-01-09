import { Injectable } from '@angular/core';

import { AppStateTypes } from '../../states/types';
import { TeamState } from '../../states/team';
import { VotingState } from '../../states/voting';
import { LocationState } from './../../states/location';

/*
  Generated class for the CacheProvider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AppStateProvider { 
  private instances = [];

  constructor() {
  }

  static getInstance(type: AppStateTypes) {
    if(type == AppStateTypes.TEAM) {
      return new TeamState();
    } else if(type === AppStateTypes.VOTING) {
      return new VotingState();
    } else if(type === AppStateTypes.LOCATION) {
      return new LocationState();
    }
  }

  resetStates() {
    this.instances.forEach(instance => instance.reset());
  }
}