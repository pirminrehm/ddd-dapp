import { AvatarSelectorPage } from './../avatar-selector/avatar-selector';
import { SettingsProvider } from './../../providers/storage/settings';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavParams, ViewController, ModalController } from 'ionic-angular';

import { TeamProvider } from './../../providers/web3/team';
import { MemberApprovedProvider } from '../../providers/helpers/member-approved';

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
  avatarId: number; 

  constructor(public navParams: NavParams,
              private fb: FormBuilder,
              public viewCtrl: ViewController,
              private teamProvider: TeamProvider,
              private memberApprovedProvider: MemberApprovedProvider,
              private settingsProvider: SettingsProvider,
              private modalCtrL: ModalController) {

    this.joinRequestForm = this.fb.group({
      name: ['', [Validators.required]]
      // TODO: AVATAR ID form field in template
    });
  }

  selectAvatar() {
    const modal = this.modalCtrL.create(AvatarSelectorPage);
    modal.onDidDismiss(avatarId => {
      this.avatarId = avatarId
    })
    modal.present();
  }


  async ionViewWillEnter() {
    this.joinRequestForm.setValue({
      name: await this.settingsProvider.getName()
    });

    this.requestFailed = false;
    this.avatarId = await this.settingsProvider.getAvatarId();
  }

  async sendJoinTeamRequest() {
    try {
      const name = this.joinRequestForm.value.name;
      await this.teamProvider.sendJoinTeamRequest(this.address, this.token, name, this.avatarId);

      await this.settingsProvider.setPendingTeamAddress(this.address);
      this.memberApprovedProvider.doCheck();

      this.viewCtrl.dismiss(true);
    } catch(e) {
      this.requestFailed = true;
      console.log(e);
    }
  }

  dismiss() {
    this.viewCtrl.dismiss(false);
  }
}
