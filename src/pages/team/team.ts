import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SettingsProvider } from './../../providers/storage/settings';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ModalController } from 'ionic-angular';

import { Web3Provider } from './../../providers/web3/web3';
import { TeamProvider } from './../../providers/web3/team';
import { Account } from './../../models/account';
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
    this.teamProvider.onTokenCreated().then(teamInvitation => {
      this.teamInvitation = teamInvitation;
      this.invitationTokenIsLoading = false;
    });

    this.teamProvider.createInvitationToken();
  }

  deleteInvitationToken() {
    this.teamInvitation = null;
  }


  async scanInvitationToken() {
    // TODO: Implement native QR Code Functionality
    // const data = await this.barcodeScanner.scan();

    const qrData = await Promise.resolve({
      address: '0xd6b61cad80dbe2fe26fa672b8ec2fdaf002cebbc', 
      token: '0xc70e3c8a277a23c7c5b16a9ac991714062dd3fc383eb3b1b80419d9c318e7232'
    });

    let modal = this.modalCtrl.create(TeamJoinRequestPage, qrData);
    modal.present();
  }
}
 