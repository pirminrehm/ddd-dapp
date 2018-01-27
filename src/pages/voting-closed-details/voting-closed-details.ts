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

  chartReloadSubject = new Subject();

  constructor(private votingProvider: VotingProvider) {
  }

  async ngOnChanges() {
    if(this.address) {
      console.log(this.address);
      this.isLoading = true;
      this.votingProvider.getLocationPoints(this.address).then(locationPoints => {
        this.locationPoints = locationPoints;
        this.isLoading = false;
        this.chartReloadSubject.next();
      });
    }
  }
}
