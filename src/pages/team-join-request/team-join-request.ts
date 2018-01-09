import { SettingsProvider } from './../../providers/storage/settings';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavParams, ViewController } from 'ionic-angular';

import { TeamProvider } from './../../providers/web3/team';

/**
 * Generated class for the TeamJoinRequestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-team-join-request',
  templateUrl: 'team-join-request.html',
})
export class TeamJoinRequestPage {
  private token: string = this.navParams.get('token');
  private address: string = this.navParams.get('address');

  joinRequestForm: FormGroup;
  requestFailed: boolean; 

  constructor(public navParams: NavParams,
              private fb: FormBuilder,
              public viewCtrl: ViewController,
              private teamProvider: TeamProvider,
              private settingsProvider: SettingsProvider) {

    this.joinRequestForm = this.fb.group({
      name: ['', [Validators.required]],
      avatarId: [0]
      // TODO: AVATAR ID form field in template
    });
  }

  async ionViewWillEnter() {
    this.joinRequestForm.setValue({
      name: await this.settingsProvider.getName(),
      avatarId: await this.settingsProvider.getAvatarId()
    });

    this.requestFailed = false;
  }

  async sendJoinTeamRequest() {
    try {
      const name = this.joinRequestForm.value.name;
      await this.teamProvider.sendJoinTeamRequest(this.address, this.token, name, 0 /* TODO: AVATAR VAL */);
      this.viewCtrl.dismiss();
    } catch(e) {
      this.requestFailed = true;
      console.log(e);
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
