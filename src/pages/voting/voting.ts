import { LocationProvider } from './../../providers/web3/location';
import { VotingProvider } from './../../providers/web3/voting';
import { Web3Provider } from './../../providers/web3/web3';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


interface Account {
  address: string,
  name: string
}

interface Location {
  name: string,
  uri: string
}

export interface UserPoint {
  account: string,
  points: number
}

export interface LocationPoint {
  uri: string,
  points: number
}

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

    this.accounts = this.web3Provider.getAccounts()
      .map((address, index) => ({ "address": address, "name": "Account " + index}));

    this.prepareLocations();
    this.refreshUserPoints();
    this.refreshLocationPoints();
  }


  createVoting() {
    const uri = this.votingForm.value.location;
    const address = this.votingForm.value.address;
    const points = this.votingForm.value.points;

    console.log('send points:', points);

    // this.status = "Initiating transaction... (please wait)";

    this.votingProvider
      .addVote(address, uri, points)
      .then(() => {
        // self.setStatus("Transaction complete!");
        this.refreshLocationPoints()
        this.refreshUserPoints()
      }).catch((e) => {
        console.log(e);
        // self.setStatus("Error adding vote; see log.");
      });
  }

  getVotingName() {
    this.votingProvider
    .getVotingName()
    .then(name => this.votingName = name)
    .catch((e) => {
      console.log(e);
      // self.setStatus("Error getting voting name; see log.");
    });
  }


  refreshLocationPoints() {
    this.votingProvider
      .getVotedLocationsCount()
      .then(count => this.queryLocationPoints(count))
      .catch((e) => {
        console.log(e);
        // self.setStatus("Error getting balance; see log.");
      });
  }

  private queryLocationPoints(count: number) {
    this.locationPoints = [];
    var i = 0;
    while (i < count) {
      this.votingProvider
        .getLocationPointsByIndex(i)
        .then(locationsPoint => this.locationPoints.push(locationsPoint))
        .catch(v => console.log(v));
      i++;
    }
  }


  private refreshUserPoints() {
    this.votingProvider.getVotingUsersCount()
      .then(count => this.queryUserPoints(count))
      .catch((e) => {
        console.log(e);
        // self.setStatus("Error getting balance; see log.");
      });
  }


  private queryUserPoints(count: number) {
    this.userPoints = [];
    var i = 0;
    while (i < count) {
      this.votingProvider
        .getUserPointsByIndex(i)
        .then(userPoint => this.userPoints.push(userPoint))
        .catch(v => console.log(v));
      i++;
    }
    return count;
  }


  private prepareLocations() {
    this.locationProvider
      .getCount()
      .then(count => this.queryLocations(count))
      .catch((e) => {
        console.log(e);
        // this.status = "Error getting balance; see log.";
      });
  }

  private queryLocations(count) {
    this.locations = [];
    let i = 0;
    while (i < count) {
      this.locationProvider
        .getLocationAtIndex(i)
        .then(v => {
          console.log(v, 'V');
          const uri = this.web3Provider.getWeb3().toUtf8(v[0]);
          const name = this.web3Provider.getWeb3().toUtf8(v[1]);
          console.log(this.locations);
          this.locations.push({uri, name});
        })
        .catch(v => console.log(v));
      i++;
    }
  }
}
