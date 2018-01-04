import { NotificationProvider } from './../../providers/notification/notification';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { LocationProvider } from './../../providers/web3/location';

import { Location } from '../../models/location';


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

  locations: Location[];
  locationForm: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private locationProvider: LocationProvider,
              private notificationProvider: NotificationProvider,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.locationForm = this.fb.group({
      name: ['', [Validators.required]],
      uri: ['', Validators.required],
    });
    this.refreshLocations();
  }

  async refreshLocations() {
    this.locations = await this.locationProvider.getAllLocations();
  }

  async addLocation() {
    const uri = this.locationForm.value.uri;
    const name = this.locationForm.value.name;

    try { 
      await this.locationProvider.addLocation(uri, name)
      this.notificationProvider.success(`Location: ${name} added.`);
      this.refreshLocations();
      this.notificationProvider.success('Locations reloaded.');
    } catch(e) {
      this.notificationProvider.error(`Location ${name} could not be added. Maybe a duplicated uri?`);
    }
  }
}
