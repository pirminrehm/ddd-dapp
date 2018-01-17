import { LoggingProvider } from './../../providers/web3/logging';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Web3Provider } from './../../providers/web3/web3';
import { SettingsProvider } from './../../providers/storage/settings';
import { Account } from '../../models/account';
import { NotificationProvider } from '../../providers/notification/notification';
import { TeamProvider } from '../../providers/web3/team';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  
  settingsForm: FormGroup;
  accounts: Account[];

  teamAddress$: Promise<string>;
  teamName$: Promise<string>

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private fb: FormBuilder,
              private web3Provider: Web3Provider,
              private teamProvider: TeamProvider,
              private settingsProvider: SettingsProvider,
              private loggingProvider: LoggingProvider,
              private notificationProvier: NotificationProvider) {

    this.settingsForm = this.fb.group({
      account: ['', [Validators.required]],
      name: ['', Validators.required],
      loggingAddress: ['']
    });
  }

  async ionViewWillEnter() {
    this.accounts = (await this.web3Provider.getAccounts())
      .map((address, index) => new Account(address, `Account ${index}`));

    this.settingsForm.setValue({
      name: await this.settingsProvider.getName(),
      account: await this.settingsProvider.getAccount(),
      loggingAddress: await this.loggingProvider.getAddress() || '0x345ca3e014aaf5dca488057592ee47305d9b3e10'
    });

    this.teamAddress$ = this.settingsProvider.getTeamAddress();
    
    this.teamName$ = null;
    if(await this.teamAddress$) {
      this.teamName$ = this.teamProvider.getTeamName();
    }
  }

  async save() {
    try {
      await this.settingsProvider.setName(this.settingsForm.value.name);
      await this.settingsProvider.setAccount(this.settingsForm.value.account);
      await this.settingsProvider.setLoggingAddress(this.settingsForm.value.loggingAddress);
      await this.settingsProvider.setTeamAddress(await this.teamAddress$);
      this.notificationProvier.success('Settings saved');
    } catch(e) {
      this.notificationProvier.error('An error occured while saving the settings.');
      console.log(e);
    }
  }

  async removeTeamAddress() {
    this.teamAddress$ = null;
  }
}
