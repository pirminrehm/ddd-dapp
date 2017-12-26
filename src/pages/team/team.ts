import { SettingsProvider } from './../../providers/storage/settings';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';

import { Web3Provider } from './../../providers/web3/web3';
import { TeamProvider } from './../../providers/web3/team';
import { Account } from './../../models/account';


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

  teamForm: FormGroup;  
  accounts: Account[];
  // membersCount: number;
  // pendingMembersCount: number;

  constructor(public navCtrl: NavController, 
              private web3Provider: Web3Provider,
              private teamProvider: TeamProvider,
              private settingsProvider: SettingsProvider,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.createTeamForm = this.fb.group({
      name: ['', Validators.required],
      creatorName: ['', Validators.required]
      // TODO: Add Avatar ID
    });

    this.teamForm = this.fb.group({
      address: ['', [Validators.required]],
      name: ['', [Validators.required]]
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
    this.teamProvider.onTokenCreated(token => {
      this.invitationToken = token;
      this.invitationTokenIsLoading = false;
    });

    this.teamProvider.createInvitationToken();
  }

  killInvitationToken() {
    this.invitationToken = null;
  }

  async sendJoinTeamRequest() {
    try {
      const address = this.teamForm.value.address;
      const name = this.teamForm.value.name;
      await this.teamProvider.sendJoinTeamRequest(address, name);
    } catch(e) {
      alert('An error occurred, maybe already a pending user?');
    }
  }
}
 