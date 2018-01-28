import { Component, Input, OnChanges } from '@angular/core';

import { LocationPoint } from './../../models/location-point';
import { VotingProvider } from '../../providers/web3/voting';
import { Subject } from 'rxjs/Subject';

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

  winningLocationPoint: LocationPoint;
  winningStochasticLocation: string;

  chartReloadSubject = new Subject();

  constructor(private votingProvider: VotingProvider) {
  }

  async ngOnChanges() {
    if(this.address) {
      this.isLoading = true;

      const locationPoints$ = this.votingProvider
        .getLocationPoints(this.address)
        .then(locationPoints => {
          this.locationPoints = locationPoints;

          let winning: LocationPoint;
          this.locationPoints.forEach((locationPoint) => {
            if(!winning || locationPoint.points > winning.points) {
              winning = locationPoint;
            }
          });
          this.winningLocationPoint = winning;
        });
    
      const winningLocation$ = this.votingProvider
        .getWinningLocation(this.address)
        .then(winningLocation => this.winningStochasticLocation = winningLocation);

      Promise.all([locationPoints$, winningLocation$]).then(() => {
        this.isLoading = false;
        this.chartReloadSubject.next();
      });
    }
  }
}
