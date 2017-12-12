import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';

import { Web3Provider } from './../../providers/web3/web3';
import { TeamProvider } from './../../providers/web3/team';
import { Account } from './../../models/account';


import 'rxjs/add/operator/filter';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  teamForm: FormGroup;  
  accounts: Account[];
  membersCount: number;
  pendingMembersCount: number;

  constructor(public navCtrl: NavController, 
              private web3Provider: Web3Provider,
              private teamProvider: TeamProvider,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.teamForm = this.fb.group({
      address: ['', [Validators.required]],
      name: ['', [Validators.required]]
    });
  }

  async ionViewWillEnter() {
    // TODO: Do not mix Obseravbles and Promises this way...
    this.web3Provider
      .isLoaded()
      .filter(loaded => loaded === true)
      .subscribe(_ => {
        this.accounts = this.web3Provider.getAccounts()
          .map((address, index) => (new Account(address, `Account ${index}`)));
      })
    
    this.teamProvider.getMembersCount().then(c => this.membersCount = c);
    this.teamProvider.getPendingMembersCount().then(c => this.pendingMembersCount = c)
  }

  sendJoinTeamRequest() {
    this.teamProvider.sendJoinTeamRequest(
      this.teamForm.value.address,
      this.teamForm.value.name
    ).catch(e => alert('An error occurred, maybe already a pending user?'));
  }
}
 