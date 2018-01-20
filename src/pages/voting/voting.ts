import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SettingsProvider } from './../../providers/storage/settings';
import { TeamProvider } from './../../providers/web3/team';
import { Voting } from '../../models/voting';

import { VotingProvider } from './../../providers/web3/voting';
import { MemberApprovedProvider } from './../../providers/helpers/member-approved';
import { LocationPoint } from './../../models/location-point';


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
  selectedLocationPoints$: Promise<LocationPoint[]>;
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
    this.stateChanged();
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
      if(this.openVotings.length == 0) {
        this.segmentArea = 'new';
      }
    }

    // We have to reset the selected voting here to prevent inconsistencies
    this.selectedOpenVoting = null;
  }
    
  private async refreshOpenVotings() {
    this.areOpenVotingsLoading = true;
    let votings = await this.teamProvider.getVotings();
    this.openVotings = votings;

    // TODO: query closed votings
    this.closedVotings = this.openVotings;
    this.areOpenVotingsLoading = false;    
  }

  async onChangeClosedVoting(address: string) {
    this.selectedLocationPoints$ = this.votingProvider.getLocationPoints(address);
  }
}
