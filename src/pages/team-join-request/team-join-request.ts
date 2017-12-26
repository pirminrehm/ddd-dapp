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
  private teamAddress: string = this.navParams.get('teamAddress');

  joinRequestForm: FormGroup;

  constructor(public navParams: NavParams,
              private fb: FormBuilder,
              public viewCtrl: ViewController,
              private teamProvider: TeamProvider) {

    this.joinRequestForm = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  async sendJoinTeamRequest() {
    try {
      const name = this.joinRequestForm.value.name;
      await this.teamProvider.sendJoinTeamRequest(this.teamAddress, this.token, name);
      this.viewCtrl.dismiss();
    } catch(e) {
      alert('An error occurred, maybe already a pending user?');
      console.log(e);
    }
  }

}
