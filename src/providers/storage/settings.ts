import { CacheProvider } from './cache';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the SettingsProvider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingsProvider {

  constructor(private storage: Storage,
              private cacheProvider: CacheProvider) {
  }


  async getName() {
    return await this.get('name');
  }

  async getAccount() {
    return await this.get('account');
  }

  async getTeamAddress() {
    return await this.get('team-address');
  }

  async getAvatarId() {
    return 0;
    // TODO: return await this.get('avatar-id');
  }
  

  async setName(value: string) {
    return await this.set('name', value);
  }

  async setAccount(value: string) {
    return await this.set('account', value);
  }

  async setTeamAddress(value: string) {
    await this.set('team-address', value);
    this.cacheProvider.resetTeamContract();
  }



  // Getters


  // INTERNAL
  private get(key: string): Promise<any> {
    try {
      return this.storage.get(key);
    } catch(e) {
      console.log(e);
    }
  }

  private set(key: string, value: string): Promise<any> {
    try {
      return this.storage.set(key, value);
    } catch(e) {
      console.log(e);
    }
  }
}