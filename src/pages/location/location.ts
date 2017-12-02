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

@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage implements OnInit {
  status = "";
  locations: Location[];
  locationForm: FormGroup;
  

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private locationProvider: LocationProvider,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.locationForm = this.fb.group({
      name: ['', [Validators.required]],
      uri: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');
    this.refreshLocations();
  }

  refreshLocations() {
    this.locationProvider
      .getAllLocations()
      .then(locations => this.locations = locations);
  }

  addLocation() {
    var self = this;
    this.status = "Initiating transaction... (please wait)";  
    
    this.locationProvider
      .addLocation(this.locationForm.value.name, this.locationForm.value.uri)
      .then((traId) => {
        this.status = "Transaction complete!";
        self.refreshLocations();
      });
  }
}
