import { LocationProvider } from './../../providers/web3/location';
import { VotingProvider } from './../../providers/web3/voting';
import { Web3Provider } from './../../providers/web3/web3';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { LocationPoint } from './../../models/location-point';
import { UserPoint } from './../../models/user-point';
import { Account } from './../../models/account';
import { Location } from './../../models/location';

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

  accounts: Account[];
  locations: Location[];
  userPoints: UserPoint[];
  locationPoints: LocationPoint[];

  votingForm: FormGroup;
  votingName: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private web3Provider: Web3Provider,
              private votingProvider: VotingProvider,
              private locationProvider: LocationProvider,
              private fb: FormBuilder) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VotingPage');
  }

  ngOnInit() {
    this.votingForm = this.fb.group({
      address: ['', [Validators.required]],
      location: ['', Validators.required],
      points: ['', Validators.required]
    });
  }

  ionViewWillEnter() {
    this.accounts = this.web3Provider.getAccounts()
    .map((address, index) => (new Account(address, `Account ${index}`)));

    this.locationProvider
      .getAllLocations()
      .then(locations => this.locations = locations);

    this.refreshUserPoints();
    this.refreshLocationPoints();
  }


  createVoting() {
    const uri = this.votingForm.value.location;
    const address = this.votingForm.value.address;
    const points = this.votingForm.value.points;

    console.log('send points:', points);
    console.log('send address:', address);
    console.log('send uri:', uri);

    // this.status = "Initiating transaction... (please wait)";

    this.votingProvider
      .addVote(address, uri, points)
      .then(_ => {
        // self.setStatus("Transaction complete!");
        this.refreshLocationPoints()
        this.refreshUserPoints()
      });
  }

  fetchVotingName() {
    this.votingProvider.getVotingName().then(name => this.votingName = name);
  }


  private refreshLocationPoints() {
    this.votingProvider
      .getAllLocationPoints()
      .then(locationPoints => this.locationPoints = locationPoints);
  }

  private refreshUserPoints() {
    this.votingProvider.getAllUserPoints()
      .then(userPoints => this.userPoints = userPoints);
  }
}
