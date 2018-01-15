import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NotificationProvider } from './../../providers/notification/notification';
import { LocationProvider } from './../../providers/web3/location';
import { VotingProvider } from './../../providers/web3/voting';

import { LocationPoint } from './../../models/location-point';
import { UserPoint } from './../../models/user-point';
import { Account } from './../../models/account';
import { Location } from './../../models/location';
import { IonRangeSliderCallback } from 'ng2-ion-range-slider';
import { SLIDE_COLORS } from '../voting-chart/voting-chart';

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
export class VotingDetailsPage implements OnChanges {
  @Input() address: string;

  isLoading: boolean;
  locationPoints: LocationPoint[];

  votingName$: Promise<string>;
  
  remainingPoints = 100;
  colors = SLIDE_COLORS;

  constructor(private votingProvider: VotingProvider,
              private locationProvider: LocationProvider,
              private notificationProvider: NotificationProvider) {
  }

  async ngOnChanges() {
    if(this.address) {
      this.isLoading = true;

      this.remainingPoints = 100;
      this.locationPoints = [];
      
      const locations = await this.locationProvider.getLocations();
      locations.forEach(location => {
        this.locationPoints.push(new LocationPoint(location, 0));
      });

      this.votingName$ = this.votingProvider.getVotingName(this.address);
      await this.votingName$;

      this.isLoading = false;
    }
  }

  submitVotes() {
    try {
      this.locationPoints.forEach(locationPoint => {
        this.addVote(locationPoint.location.uri, locationPoint.points);
      });
      this.notificationProvider.success('Votes successfully submitted.')
    } catch(e) {
    }
  }

  pointsChanged(locationPoint: LocationPoint, $event: IonRangeSliderCallback) {
    // We have to do this here, see: 
    // https://github.com/PhilippStein/ng2-ion-range-slider/issues/15
    locationPoint.points = $event.from;
    
    let newTotalPoints = 0;
    this.locationPoints.forEach(currentLocationPoint => {
      newTotalPoints += currentLocationPoint.points;
    });
    this.remainingPoints = 100 - newTotalPoints;
    this.locationPoints = this.locationPoints.slice(0);
  }

  private async addVote(uri: string, points: number) {
    try {
      await this.votingProvider.addVote(this.address, uri, points);
    } catch(e) {
      this.notificationProvider.error(`The vote for uri ${uri} with ${points} Points failed.`
        + `Maybe you exceeded your maximum limit of 100 points?`
      );
    }
  }
}
