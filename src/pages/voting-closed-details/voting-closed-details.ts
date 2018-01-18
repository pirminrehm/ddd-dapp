import { Component, Input, OnChanges } from '@angular/core';

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
  selectedLocationPoints: LocationPoint[];

  constructor(private votingProvider: VotingProvider) {
  }

  async ngOnChanges() {
    if(this.address) {
      this.isLoading = true;
      this.selectedLocationPoints = await this.votingProvider.getLocationPoints(this.address);
      this.isLoading = false;
    }
  }
}
