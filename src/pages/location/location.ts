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
  areLocationsLoading: boolean;

  newLocationForm: FormGroup;

  constructor(private locationProvider: LocationProvider,
              private notificationProvider: NotificationProvider,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.newLocationForm = this.fb.group({
      name: ['', Validators.required]
    });

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
      const newLocationName = this.newLocationForm.value.name;
      await this.locationProvider.addLocation(newLocationName, newLocationName);
      this.notificationProvider.success(`Location: ${name} added.`);
      this.newLocationForm.controls['name'].reset();
      
      this.refreshLocations();
    } catch(e) {
      this.notificationProvider.error(`Location ${name} could not be added. Maybe a duplicated uri?`);
    }
  }
}
