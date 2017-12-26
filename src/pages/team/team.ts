import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SettingsProvider } from './../../providers/storage/settings';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ModalController } from 'ionic-angular';

import { Web3Provider } from './../../providers/web3/web3';
import { TeamProvider } from './../../providers/web3/team';
import { Account } from './../../models/account';
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
  invitationToken: string;
  
  accounts: Account[];
  // membersCount: number;
  // pendingMembersCount: number;

  constructor(public navCtrl: NavController, 
              private modalCtrl: ModalController,
              private web3Provider: Web3Provider,
              private teamProvider: TeamProvider,
              private settingsProvider: SettingsProvider,
              private fb: FormBuilder,
              private barcodeScanner: BarcodeScanner) {
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
    
    // this.membersCount = await this.teamProvider.getMembersCount();
    // this.pendingMembersCount = await this.teamProvider.getPendingMembersCount();
  }

  async createTeam() {
    try {
      const name = this.createTeamForm.value.name;
      const creatorName = this.createTeamForm.value.creatorName;
      await this.teamProvider.createTeam(name, creatorName);
    } catch(e) {
      alert('An error occured while creating the team');
      console.log(e);
    }
  }

  createInvitationToken() {
    this.invitationTokenIsLoading = true;
    this.teamProvider.onTokenCreated().then(token => {
      this.invitationToken = token;
      this.invitationTokenIsLoading = false;
    });

    this.teamProvider.createInvitationToken();
  }

  killInvitationToken() {
    this.invitationToken = null;
  }


  async scanInvitationToken() {
    // const data = await this.barcodeScanner.scan();
    const token = await Promise.resolve('TEST_CODE');
    let modal = this.modalCtrl.create(TeamJoinRequestPage, {token: token})

    modal.onDidDismiss(data => {
      // this.user = data.userName;
    });

    modal.present();
  }
}
 