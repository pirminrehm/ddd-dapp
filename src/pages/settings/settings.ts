import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Web3Provider } from './../../providers/web3/web3';
import { SettingsProvider } from './../../providers/storage/settings';
import { Account } from '../../models/account';

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
  teamAddress: string = 'Not set';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private fb: FormBuilder,
              private web3Provider: Web3Provider,
              private settingsProvider: SettingsProvider) {

    this.settingsForm = this.fb.group({
      account: ['', [Validators.required]],
      name: ['', Validators.required]
    });
  }

  async ionViewWillEnter() {
    this.accounts = (await this.web3Provider.getAccounts())
      .map((address, index) => new Account(address, `Account ${index}`));

    const name = await this.settingsProvider.getName();
    const account = await this.settingsProvider.getAccount();
    this.settingsForm.setValue({
      name: name,
      account: account
    });

    this.teamAddress = await this.settingsProvider.getTeamAddress();
  }

  async save() {
    try {
      await this.settingsProvider.setName(this.settingsForm.value.name);
      await this.settingsProvider.setAccount(this.settingsForm.value.account);
      await this.settingsProvider.setTeamAddress(this.teamAddress);
      console.log('SAVED');
    } catch(e) {
      console.log(e);
    }
  }

  async removeTeamAddress() {
    try {
      this.teamAddress = null;
    } catch(e) {
      console.log(e);
    }
  }
}
