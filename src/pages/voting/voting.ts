import { TeamProvider } from './../../providers/web3/team';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  votings$: Promise<any[]>;
  selectedVoting: string;

  constructor(private teamProvider: TeamProvider,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.createVotingForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  async ionViewWillEnter() {
    this.refreshVotings();
  }

  async addVoting() {
    const name = this.createVotingForm.value.name;
    this.teamProvider.onVotingCreated().then(votingAddress => {
      this.refreshVotings();
    });
    await this.teamProvider.addVoting(name);
  }

  private refreshVotings() {
    this.votings$ = this.teamProvider.getVotingAddresses();
  }
}
