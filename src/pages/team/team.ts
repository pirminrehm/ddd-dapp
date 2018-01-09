import { NotificationProvider } from './../../providers/notification/notification';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SettingsProvider } from './../../providers/storage/settings';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ModalController } from 'ionic-angular';

import { TeamProvider } from './../../providers/web3/team';
import { PendingMember } from './../../models/pending-member';
import { Member } from './../../models/member';

import { TeamInvitation } from './../../models/team-invitation';
import { Loader } from './../../models/loader';
import { TeamJoinRequestPage } from '../team-join-request/team-join-request';


import 'rxjs/add/operator/filter';

@Component({
  selector: 'page-team',
  templateUrl: 'team.html'
})
export class TeamPage implements OnInit {

  createTeamForm: FormGroup;
  teamAddress: Boolean;

  teamInvitation: TeamInvitation;

  pendingMembers: PendingMember[];
  members: Member[];

  loader: Loader;

  constructor(public navCtrl: NavController, 
              private modalCtrl: ModalController,
              private teamProvider: TeamProvider,
              private settingsProvider: SettingsProvider,
              private fb: FormBuilder,
              private barcodeScanner: BarcodeScanner,
              private notificationProvider: NotificationProvider) {                                
  }

  ngOnInit() {
    this.createTeamForm = this.fb.group({
      name: ['', Validators.required],
      creatorName: ['', Validators.required]
      // TODO: Add Avatar ID
    });
    this.pendingMembers = [];
    this.members = [];
    this.teamAddress = false;
    this.loader = new Loader(['members', 'pendingMembers', 'createInvitationToken']);    
  }

  async ionViewWillEnter() {
    this.stateChanged();
  }

  async createTeam() {
    try {
      const name = this.createTeamForm.value.name;
      const creatorName = this.createTeamForm.value.creatorName;
      await this.teamProvider.createTeam(name, creatorName);
      this.notificationProvider.success(`Congrats! You're now part of the new team ${name}`)
      await this.stateChanged();
    } catch(e) {
      this.notificationProvider.error('An error occured while creating the team.');
      console.log(e);
    }
  }

  createInvitationToken() {
    this.loader.activate('createInvitationToken');
    this.teamProvider.onTokenCreated().then(teamInvitation => {
      this.teamInvitation = teamInvitation;
      console.log(this.teamInvitation);
      this.loader.deactivate('createInvitationToken');
    });

    this.teamProvider.createInvitationToken();
  }

  deleteInvitationToken() {
    this.teamInvitation = null;
  }


  async acceptPendingMember(pendingMember: PendingMember) {
    try {
      await this.teamProvider.acceptPendingMember(pendingMember.account);
      this.notificationProvider.success(`Pending user ${pendingMember.name} added`);
    } catch(e) {
      this.notificationProvider.error(`An error occured while approving the member. ${pendingMember.name} remains unapproved`);
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

      let modal = this.modalCtrl.create(TeamJoinRequestPage, data);
      modal.present();

    } catch(e) {
      this.notificationProvider.error('Invalid QR code.');
    }
  }

  private async stateChanged() {
    this.loader.activateAll();
    this.loader.deactivate('createInvitationToken');    
    
    let teamAddress = await this.settingsProvider.getTeamAddress();
    this.teamAddress = teamAddress;
    
    if(this.teamAddress) {
      this.teamProvider.getMembers().then(members => {
        this.members = members;       
        this.loader.deactivate('members');
      });
      this.teamProvider.getPendingMembers().then(pendingMembers =>  {
        this.pendingMembers = pendingMembers;
        this.loader.deactivate('pendingMembers');
      });
    }

    if(!this.createTeamForm.value.creatorName) {
      const creatorName = await this.settingsProvider.getName();
      this.createTeamForm.controls['creatorName'].patchValue(creatorName);
    }
  }
}
 