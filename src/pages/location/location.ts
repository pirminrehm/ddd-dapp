import { NotificationProvider } from './../../providers/notification/notification';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LocationProvider } from './../../providers/web3/location';

import { Location } from '../../models/location';
import { Subject } from 'rxjs/Subject';


/**
 * Generated class for the LocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage implements OnInit {
  @Input() refresh: Subject<any>;

  locations: Location[];
  newLocationName: String;
  areLocationsLoading: boolean;

  constructor(private locationProvider: LocationProvider,
              private notificationProvider: NotificationProvider,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.refreshLocations();
    this.refresh.subscribe(_ => this.refreshLocations());
  }

  refreshLocations() {
    this.areLocationsLoading = true;
    this.locationProvider.getLocations().then(locations => {
      this.locations = locations;
      this.areLocationsLoading = false;
    });
  }

  async addLocation() {
    try { 
      await this.locationProvider.addLocation(this.newLocationName, this.newLocationName)
      this.notificationProvider.success(`Location: ${name} added.`);
      this.newLocationName = null;
      
      this.refreshLocations();
    } catch(e) {
      this.notificationProvider.error(`Location ${name} could not be added. Maybe a duplicated uri?`);
    }
  }
}
