import { Component, OnChanges, Input, SimpleChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NotificationProvider } from './../../providers/notification/notification';
import { LocationProvider } from './../../providers/web3/location';
import { VotingProvider } from './../../providers/web3/voting';
import { TeamProvider } from './../../providers/web3/team';

import { LocationPoint } from './../../models/location-point';
import { UserPoint } from './../../models/user-point';
import { Account } from './../../models/account';
import { Location } from './../../models/location';
import { IonRangeSliderCallback } from 'ng2-ion-range-slider';
import { SLIDE_COLORS } from '../voting-chart/voting-chart';

import { Subject } from 'rxjs/Subject';

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
export class VotingDetailsPage implements OnChanges, OnInit {
  @Input() address: string;
  @Output() votingClosed = new EventEmitter();

  isLoading: boolean;
  locationPoints: LocationPoint[];

  hasVoted: Boolean;
  chartReloadSubject: Subject<any>;

  votingName$: Promise<string>;
  
  remainingPoints = 100;
  isTransmitting: Boolean;
  colors = SLIDE_COLORS;

  constructor(private votingProvider: VotingProvider,
              private teamProvider: TeamProvider,
              private locationProvider: LocationProvider,
              private notificationProvider: NotificationProvider) {
  }

  ngOnInit() {
    this.chartReloadSubject = new Subject();
  }

  async ngOnChanges() {
    if(!this.address) {
      return;
    }
    
    this.isLoading = true;

    this.remainingPoints = 100;
    this.locationPoints = [];
    
    const locations = await this.locationProvider.getLocations();
    locations.forEach(location => {
      this.locationPoints.push(new LocationPoint(location, 0));
    });

    this.votingName$ = this.votingProvider.getVotingName(this.address);
    await this.votingName$;

    this.isTransmitting = false;
    this.hasVoted = await this.votingProvider.hasVoted(this.address);

    this.isLoading = false;
  }

  submitVotes() {
    const votePromises = [];
    this.isTransmitting = true;
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
        this.isTransmitting = false;
        this.notificationProvider.success('Votes successfully submitted.');
      })
      .catch(e => {
        console.log(e);
        this.notificationProvider.error(`The voting of your Points failed.`
          + `Maybe you exceeded your maximum limit of 100 points?`);
      });
  }

  async closeVoting() {
    await this.teamProvider.closeVoting(this.address);
    this.notificationProvider.success('The voting has been closed successfully.')
    this.votingClosed.emit(this.address);
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
    this.chartReloadSubject.next();
  }
}
