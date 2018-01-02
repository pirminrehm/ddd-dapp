import { NotificationProvider } from './../../providers/notification/notification';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SettingsProvider } from './../../providers/storage/settings';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ModalController } from 'ionic-angular';

import { Web3Provider } from './../../providers/web3/web3';
import { TeamProvider } from './../../providers/web3/team';
import { Account } from './../../models/account';
import { PendingMember } from './../../models/pending-member';
import { TeamInvitation } from './../../models/team-invitation';
import { TeamJoinRequestPage } from '../team-join-request/team-join-request';


import 'rxjs/add/operator/filter';

@Component({
  selector: 'page-team',
  templateUrl: 'team.html'
})
export class TeamPage implements OnInit {

  createTeamForm: FormGroup;
  teamAddress: Promise<Boolean>;

  invitationTokenIsLoading = false;
  teamInvitation: TeamInvitation;

  accounts: Account[];
  // membersCount: number;

  pendingMembers: Promise<PendingMember[]>;

  constructor(public navCtrl: NavController, 
              private modalCtrl: ModalController,
              private web3Provider: Web3Provider,
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
  }

  async ionViewWillEnter() {
    this.teamAddress = this.settingsProvider.getTeamAddress();


    // TODO: Do not mix Obseravbles and Promises this way...
    this.accounts = (await this.web3Provider.getAccounts())
      .map((address, index) => (new Account(address, `Account ${index}`)));

    if(await this.teamAddress) {
      this.pendingMembers = this.teamProvider.getPendingMembers();
    }
    
    // this.membersCount = await this.teamProvider.getMembersCount();

  }

  async createTeam() {
    try {
      const name = this.createTeamForm.value.name;
      const creatorName = this.createTeamForm.value.creatorName;
      await this.teamProvider.createTeam(name, creatorName);
    } catch(e) {
      this.notificationProvider.error('An error occured while creating the team.');
      console.log(e);
    }
  }

  createInvitationToken() {
    this.invitationTokenIsLoading = true;
    this.teamProvider.onTokenCreated().then(teamInvitation => {
      this.teamInvitation = teamInvitation;
      this.invitationTokenIsLoading = false;
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
    // TODO: Implement native QR Code Functionality
    // const data = await this.barcodeScanner.scan();

    const qrData = await Promise.resolve({
      address: '0xd4907def4d374d0a07910159a8e7d4fc8a5983df', 
      token: '0x3f7066bdf030b073203da95cf07b0d2ba7291014bd9f9c0f3cecbfee2a8e8a5a'
    });

    let modal = this.modalCtrl.create(TeamJoinRequestPage, qrData);
    modal.present();
  }
}
 