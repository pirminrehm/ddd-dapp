import { Component, Input, OnChanges } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { LocationPoint } from './../../models/location-point';
import { VotingProvider } from '../../providers/web3/voting';

/**
 * Generated class for the VotingClosedDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-voting-closed-details',
  templateUrl: 'voting-closed-details.html',
})
export class VotingClosedDetailsPage implements OnChanges {
  @Input() address: string;

  isLoading: Boolean;
  locationPoints: LocationPoint[];
  votingName$: Promise<string>;

  winningLocationPoint: LocationPoint;
  winningStochasticLocation: string;

  chartReloadSubject = new Subject();

  constructor(private votingProvider: VotingProvider) {
  }

  ngOnChanges() {
    if(!this.address) {
      return;
    }
    this.isLoading = true;
    
    this.votingName$ = this.votingProvider.getVotingName(this.address);
    const locationPoints$ = this.votingProvider
      .getLocationPoints(this.address)
      .then(locationPoints => {
        this.locationPoints = locationPoints;
        this.determineWinningLocation(locationPoints);
      });
  
    const winningLocation$ = this.votingProvider
      .getWinningLocation(this.address)
      .then(winningLocation => this.winningStochasticLocation = winningLocation);

    Promise.all([locationPoints$, winningLocation$, this.votingName$]).then(() => {
      this.isLoading = false;
      this.chartReloadSubject.next();
    });
  }

  private determineWinningLocation(locationPoints: LocationPoint[]) {
    let winning: LocationPoint;
    this.locationPoints.forEach((locationPoint) => {
      if(!winning || locationPoint.points > winning.points) {
        winning = locationPoint;
      }
    });
    this.winningLocationPoint = winning;
  }
}
