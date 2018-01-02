import { VotingProvider } from './../../providers/web3/voting';
import { Component, OnInit, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { LocationPoint } from './../../models/location-point';
import { UserPoint } from './../../models/user-point';
import { Account } from './../../models/account';
import { Location } from './../../models/location';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

/**
 * Generated class for the VotingDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-voting-details',
  templateUrl: 'voting-details.html',
})
export class VotingDetailsPage implements OnInit, OnChanges {
  @Input() address: string;

  accounts: Account[];
  locations: Location[];
  userPoints: UserPoint[];
  locationPoints: LocationPoint[];

  votingName: string;
  votingForm: FormGroup;

  constructor(private fb: FormBuilder, 
              private votingProvider: VotingProvider) {
  }

  ngOnInit() {
    this.votingForm = this.fb.group({
      address: ['', [Validators.required]],
      location: ['', Validators.required],
      points: ['', Validators.required]
    });
  }

  ngOnChanges() {
    console.log(this.address);
  }

  ionViewDidLoad() {
    // this.accounts = (await this.web3Provider.getAccounts())
    //   .map((address, index) => (new Account(address, `Account ${index}`)));

    // this.locations = await this.locationProvider.getAllLocations();
    // this.refreshUserPoints();
    // this.refreshLocationPoints();
    console.log('ionViewDidLoad VotingDetailsPage');
  }

  async addVote() {
    const uri = this.votingForm.value.location;
    const address = this.votingForm.value.address;
    const points = this.votingForm.value.points;

    console.log('send points:', points);
    console.log('send address:', address);
    console.log('send uri:', uri);

    // this.status = "Initiating transaction... (please wait)";

    await this.votingProvider.addVote(address, uri, points);
    // self.setStatus("Transaction complete!");
    this.refreshLocationPoints()
    this.refreshUserPoints()
  }

  async fetchVotingName() {
    this.votingName = await this.votingProvider.getVotingName();
  }


  private async refreshLocationPoints() {
    this.locationPoints = await this.votingProvider.getAllLocationPoints();
  }

  private async refreshUserPoints() {
    this.userPoints = await this.votingProvider.getAllUserPoints();
  }

}
