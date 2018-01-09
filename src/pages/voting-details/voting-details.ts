import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NotificationProvider } from './../../providers/notification/notification';
import { LocationProvider } from './../../providers/web3/location';
import { VotingProvider } from './../../providers/web3/voting';

import { LocationPoint } from './../../models/location-point';
import { UserPoint } from './../../models/user-point';
import { Account } from './../../models/account';
import { Location } from './../../models/location';

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

  isLoading: boolean;

  locations$: Promise<Location[]>;
  userPoints: UserPoint[];
  locationPoints: LocationPoint[];

  areLocationPointsLoading: Boolean;
  areUserPointsLoading: Boolean;

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
      points: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
    });
  }

  async ngOnChanges() {
    if(this.address) {
      this.isLoading = true;

      if(this.votingForm) {
        this.votingForm.reset();
      }

      this.locations$ = this.locationProvider.getLocations();
      this.votingName$ = this.votingProvider.getVotingName(this.address);

      await this.locations$;
      await this.votingName$;

      await this.refreshUserPoints();
      await this.refreshLocationPoints();

      this.isLoading = false;
    }
  }

  async addVote() {
    const uri = this.votingForm.value.location;
    const points = this.votingForm.value.points;

    try {
      await this.votingProvider.addVote(this.address, uri, points);
      this.notificationProvider.success(`You successfully voted for the location.`);
    } catch(e) {
      this.notificationProvider.error(`The vote could not be submitted.`
        + `Maybe you exceeded your maximum limit of 100 points?`
      );
    }
    
    this.refreshLocationPoints();
    this.refreshUserPoints();
  }


  private refreshLocationPoints() {
    this.areLocationPointsLoading = true;
    this.votingProvider.getAllLocationPoints(this.address).then(locationPoints => {
      this.locationPoints = locationPoints;
      this.areLocationPointsLoading = false;
    });
  }

  private async refreshUserPoints() {
    this.areUserPointsLoading = true;
    this.votingProvider.getAllUserPoints(this.address).then(userPoints => {
      this.userPoints = userPoints;
      this.areUserPointsLoading = false;
    })
  }

}
