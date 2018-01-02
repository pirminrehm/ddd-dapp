import { NotificationProvider } from './../../providers/notification/notification';
import { LocationProvider } from './../../providers/web3/location';
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

  locations$: Promise<Location[]>;
  userPoints: UserPoint[];
  locationPoints: LocationPoint[];

  votingName$: Promise<string>;
  votingForm: FormGroup;

  constructor(private fb: FormBuilder, 
              private votingProvider: VotingProvider,
              private locationProvider: LocationProvider,
              private notificationProvider: NotificationProvider) {
  }

  ngOnInit() {
    this.votingForm = this.fb.group({
      location: ['', Validators.required],
      points: ['', Validators.required]
    });
  }

  ngOnChanges() {
    if(this.address) {
      this.votingForm.reset();
      
      this.locations$ = this.locationProvider.getLocations();
      this.votingName$ = this.votingProvider.getVotingName(this.address);

      this.refreshUserPoints();
      this.refreshLocationPoints();
    }
  }

  async addVote() {
    const uri = this.votingForm.value.location;
    const points = this.votingForm.value.points;

    console.log('send points:', points);
    console.log('send uri:', uri);

    await this.votingProvider.addVote(this.address, uri, points);
    this.notificationProvider.success(`Voting added`);
    
    this.refreshLocationPoints()
    this.refreshUserPoints()
  }


  private async refreshLocationPoints() {
    this.locationPoints = await this.votingProvider.getAllLocationPoints(this.address);
  }

  private async refreshUserPoints() {
    this.userPoints = await this.votingProvider.getAllUserPoints(this.address);
  }

}
