import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
export class VotingClosedDetailsPage {
  @Input() address: string;
  
  selectedLocationPoints$: Promise<LocationPoint[]>;

  constructor(private votingProvider: VotingProvider) {
  }

  ngOnChanges() {
    if(this.address) {
      this.selectedLocationPoints$ = this.votingProvider.getLocationPoints(this.address);
    }
  }
}
