import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SettingsProvider } from './../../providers/storage/settings';
import { TeamProvider } from './../../providers/web3/team';
import { Voting } from '../../models/voting';

import { VotingProvider } from './../../providers/web3/voting';
import { MemberApprovedProvider } from './../../providers/helpers/member-approved';


/**
 * Generated class for the VotingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-voting',
  templateUrl: 'voting.html',
})
export class VotingPage implements OnInit {
  createVotingForm: FormGroup;
  teamAddress$: Promise<string>;

  segmentArea = 'open';

  openVotings: Voting[];
  selectedOpenVoting: string;
  areOpenVotingsLoading: boolean;
  
  closedVotings: Voting[];
  selectedClosedVoting: string;
  areClosedVotingsLoading: boolean;

  constructor(private teamProvider: TeamProvider,
              private fb: FormBuilder,
              private settingsProvider: SettingsProvider,
              private votingProvider: VotingProvider,
              private memberApprovedProvider: MemberApprovedProvider) {
  }

  ngOnInit() {
    this.createVotingForm = this.fb.group({
      name: ['', [Validators.required]],
    });

    // TODO:
    this.closedVotings = [];

    this.memberApprovedProvider.onApproved().subscribe(_ => this.stateChanged());
  }

  async ionViewWillEnter() {
    await this.stateChanged();
    if(this.openVotings.length == 0) {
      this.segmentArea = 'new';
    }
  }

  async addVoting() {
    const name = this.createVotingForm.value.name;
    this.teamProvider.onVotingCreated().then(votingAddress => {
      this.refreshOpenVotings();
    });
    await this.teamProvider.addVoting(name);
    this.segmentArea = 'open';
  }

  private async stateChanged() {
    this.teamAddress$ = this.settingsProvider.getTeamAddress();

    if(await this.teamAddress$) {
      await this.refreshOpenVotings();
      await this.refreshClosedVotings();
    }

    // We have to reset the selected voting here to prevent inconsistencies
    this.selectedOpenVoting = null;
  }
  
  async doRefresh(refresher) {
    await this.stateChanged();
    refresher.complete();
  }

  private async refreshOpenVotings() {
    this.areOpenVotingsLoading = true;
    this.openVotings = await this.teamProvider.getVotings();

    this.areOpenVotingsLoading = false;    
  }

  private async refreshClosedVotings() {
    this.areClosedVotingsLoading = true;
    this.closedVotings = await this.teamProvider.getClosedVotings();
    this.areClosedVotingsLoading = false;    
  }

  onVotingClosed() {
    this.stateChanged();
    this.selectedOpenVoting = null;
  }
}
