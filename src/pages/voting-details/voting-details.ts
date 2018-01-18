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

  hasVoted: Boolean;

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

      this.hasVoted = await this.votingProvider.hasVoted(this.address);

      this.isLoading = false;
    }
  }

  submitVotes() {
    const votePromises = [];
    this.locationPoints.forEach(locationPoint => {
      //avoid call for 0 points -> error
      if (locationPoint.points) {
        const uri = locationPoint.location.uri;
        const vote = this.votingProvider.addVote(this.address, uri, locationPoint.points);
        votePromises.push(vote);
      }
    });

    Promise
      .all(votePromises)
      .then(_ => {
        this.hasVoted = true;
        this.notificationProvider.success('Votes successfully submitted.');
      })
      .catch(e => {
        console.log(e);
        this.notificationProvider.error(`The voting of your Points failed.`
          + `Maybe you exceeded your maximum limit of 100 points?`);
      });
  }

  closeVoting() {
    
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
}
