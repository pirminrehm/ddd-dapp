import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs/Subject';

interface CacheEntity {
  key: string,
  value: string
}
import 'rxjs/add/operator/do';

/*
  Generated class for the CacheProvider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CacheProvider {
  private cache = {};

  constructor() {
  }

  setTeamContract(value: any) {
    this.cache['team'] = value;
  }

  getTeamContract(): Promise<any> {
    return this.cache['team'];
  }

  resetTeamContract() {
    this.cache['team'] = null;
  }
}