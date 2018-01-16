import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SettingsProvider } from './../../providers/storage/settings';
import { TeamProvider } from './../../providers/web3/team';
import { Voting } from '../../models/voting';


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
  selectedVoting: string;
  teamAddress$: Promise<string>;

  segmentArea = 'open';

  openVotings: Voting[];
  areOpenVotingsLoading: boolean;
  
  closedVotings: Voting[];
  areClosedVotingsLoading: boolean;

  constructor(private teamProvider: TeamProvider,
              private fb: FormBuilder,
              private settingsProvider: SettingsProvider) {
  }

  ngOnInit() {
    this.createVotingForm = this.fb.group({
      name: ['', [Validators.required]],
    });

    // TODO:
    this.closedVotings = [];
  }

  async ionViewWillEnter() {
    this.teamAddress$ = this.settingsProvider.getTeamAddress();

    if(await this.teamAddress$) {
      await this.refreshOpenVotings();
      if(this.openVotings.length == 0) {
        this.segmentArea = 'new';
      }
    }

    // We have to reset the selected voting here to prevent inconsistencies
    this.selectedVoting = null;
  }

  async addVoting() {
    const name = this.createVotingForm.value.name;
    this.teamProvider.onVotingCreated().then(votingAddress => {
      this.refreshOpenVotings();
    });
    await this.teamProvider.addVoting(name);
    this.segmentArea = 'open';
  }

  private async refreshOpenVotings() {
    this.areOpenVotingsLoading = true;
    this.openVotings = await this.teamProvider.getVotings();
    this.areOpenVotingsLoading = false;
  }
}
