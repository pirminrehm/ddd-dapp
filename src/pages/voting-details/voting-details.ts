import { Component, OnChanges, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NotificationProvider } from './../../providers/notification/notification';
import { LocationProvider } from './../../providers/web3/location';
import { VotingProvider } from './../../providers/web3/voting';

import { LocationPoint } from './../../models/location-point';
import { UserPoint } from './../../models/user-point';
import { Account } from './../../models/account';
import { Location } from './../../models/location';
import { IonRangeSliderCallback } from 'ng2-ion-range-slider';

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

  locations$: Promise<Location[]>;
  userPoints: UserPoint[];
  locationPoints: LocationPoint[];

  areLocationPointsLoading: Boolean;
  areUserPointsLoading: Boolean;

  votingName$: Promise<string>;

  points = {};
  remainingPoints = 100;

  constructor(private votingProvider: VotingProvider,
              private locationProvider: LocationProvider,
              private notificationProvider: NotificationProvider) {
  }

  async ngOnChanges() {
    if(this.address) {
      this.isLoading = true;

      this.remainingPoints = 100;
      this.points = {};

      this.locations$ = this.locationProvider.getLocations();
      this.votingName$ = this.votingProvider.getVotingName(this.address);

      await this.locations$;
      await this.votingName$;

      await this.refreshUserPoints();
      await this.refreshLocationPoints();

      this.isLoading = false;
    }
  }

  private async addVote(uri: string, points: number) {
    try {
      await this.votingProvider.addVote(this.address, uri, points);
    } catch(e) {
      this.notificationProvider.error(`The vote for uri ${uri} with ${points} Points failed.`
        + `Maybe you exceeded your maximum limit of 100 points?`
      );
    }
    
    this.refreshLocationPoints();
    this.refreshUserPoints();
  }

  submitVotes() {
    try {
      for(let uri in this.points) {
        this.addVote(uri, this.points[uri]);
      }
      this.notificationProvider.success('Votes successfully submitted.')
    } catch(e) {
    }
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

  pointsChanged(location: Location, $event: IonRangeSliderCallback) {
    // We have to do this here, see: 
    // https://github.com/PhilippStein/ng2-ion-range-slider/issues/15
    this.points[location.uri] = $event.from;
    
    let newPoints = 0;
    for (var value in this.points) {
        newPoints += this.points[value];
    }
    this.remainingPoints = 100 - newPoints;
  }
}
