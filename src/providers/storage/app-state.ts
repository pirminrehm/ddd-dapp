import { Injectable } from '@angular/core';

import { AppStateTypes } from '../../states/types';
import { TeamState } from '../../states/team';

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
    }
  }

  resetStates() {
    this.instances.forEach(instance => instance.reset());
  }
}