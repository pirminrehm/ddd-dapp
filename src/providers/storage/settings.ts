import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AppStateProvider } from './app-state';

/*
  Generated class for the SettingsProvider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingsProvider {

  constructor(private storage: Storage,
              private appStateProvider: AppStateProvider) {
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
    const avatarId = await this.get('avatar-id');
    return avatarId ? avatarId : 0;
  }
  
  async getLoggingAddress() {
    return await this.get('loggingAccount');
  }

  async getPendingTeamAddress() {
    return await this.get('pending-team-address');
  }

  async setName(value: string) {
    return await this.set('name', value);
  }

  async setAccount(value: string) {
    await this.set('account', value);
    this.appStateProvider.resetStates();
  }

  async setAvatarId(avatarId: number) {
    await this.set('avatar-id', avatarId);
  }

  async setTeamAddress(value: string) {
    await this.set('team-address', value);
    this.appStateProvider.resetStates();
  }

  async setLoggingAddress(value: string) {
    return await this.set('loggingAccount', value);
  }

  async setPendingTeamAddress(value: string) {
    return await this.set('pending-team-address', value);
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

  private set(key: string, value: string | number): Promise<any> {
    try {
      return this.storage.set(key, value);
    } catch(e) {
      console.log(e);
    }
  }
}