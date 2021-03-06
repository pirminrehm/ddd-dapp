import { AvatarSelectorPage } from './../avatar-selector/avatar-selector';
import { ModalController } from 'ionic-angular';
import { NotificationProvider } from './../../providers/notification/notification';
import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TeamProvider } from './../../providers/web3/team';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { TeamJoinRequestPage } from '../team-join-request/team-join-request';
import { SettingsProvider } from '../../providers/storage/settings';


/**
 * Generated class for the TeamNoMemberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-team-no-member',
  templateUrl: 'team-no-member.html',
})
export class TeamNoMemberPage implements OnInit {
  @Output() teamCreated: EventEmitter<any> = new EventEmitter();

  createTeamForm: FormGroup;
  avatarId: number;
  pendingTeamName: string;

  constructor(private fb: FormBuilder,
              private teamProvider: TeamProvider,
              private notificationProvider: NotificationProvider,
              private barcodeScanner: BarcodeScanner,
              private modalCtrl: ModalController,
              private settingsProvider: SettingsProvider) {
  }

  async ngOnInit() {
    this.createTeamForm = this.fb.group({
      name: ['', Validators.required],
      creatorName: ['', Validators.required]
    });

    const creatorName = await this.settingsProvider.getName();
    this.createTeamForm.controls['creatorName'].patchValue(creatorName);

    this.avatarId = await this.settingsProvider.getAvatarId();

    this.refreshPendingTeam();
  }

  async createTeam() {
    try {
      const name = this.createTeamForm.value.name;
      const creatorName = this.createTeamForm.value.creatorName;
      await this.teamProvider.createTeam(name, creatorName, this.avatarId);
      this.notificationProvider.success(`Congrats! You're now part of the new team ${name}`)
      
      this.teamCreated.emit();
    } catch(e) {
      this.notificationProvider.error('An error occured while creating the team.');
      console.log(e);
    }
  }

  async scanInvitationToken() {
    let data = await this.barcodeScanner.scan();
    if(data.cancelled) {
      this.notificationProvider.error('QR Code scan cancelled.');
      return;
    }

    try {
      const qrData = JSON.parse(data.text);
      
      const tokenRegExp = new RegExp('^([a-z0-9]){66}$');
      if(!tokenRegExp.test(qrData.token)) {
        this.notificationProvider.error('Invalid token format.');
        return;
      }

      let modal = this.modalCtrl.create(TeamJoinRequestPage, qrData);
      modal.onDidDismiss(succeeded => {
        if(succeeded) {
          this.refreshPendingTeam();
          this.notificationProvider.success('The join team request has been sent sucessfully.');
        }
      });
      modal.present();

    } catch(e) {
      this.notificationProvider.error('Invalid QR code.');
    }
  }

  selectAvatar() {
    const modal = this.modalCtrl.create(AvatarSelectorPage);
    modal.onDidDismiss(avatarId => this.avatarId = avatarId);
    modal.present();
  }

  private async refreshPendingTeam() {
    const pendingTeamAddress = await this.settingsProvider.getPendingTeamAddress();
    if(pendingTeamAddress) {
      this.pendingTeamName = await this.teamProvider.getTeamName(pendingTeamAddress);
    }
  }
}
