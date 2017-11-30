import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Web3Provider } from './../../providers/web3/web3';
import { LocationProvider } from './../../providers/web3/location';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


interface Location {
  name: string,
  uri: string
}


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
export class LocationPage {
  status = "";
  locations: Location[];
  locationForm: FormGroup;
  

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private web3Provider: Web3Provider, 
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
    // Reset the selectbox for 
    var locationInstance;
    this.locationProvider
      .getCount()
      .then(count => this.queryLocations(count))
      .catch((e) => {
        console.log(e);
        this.status = "Error getting balance; see log.";
      });
  }

  addLocation() {
    var self = this;
    this.status = "Initiating transaction... (please wait)";  
    
    this.locationProvider
      .addLocation(this.locationForm.value.name, this.locationForm.value.uri)
      .then((traId) => {
        this.status = "Transaction complete!";
        self.refreshLocations();
      })
      .catch((e) => {
        console.log(e);
        this.status = "Error adding location; see log.";
      });
  }

  private queryLocations(count) {
    this.locations = [];
    let i = 0;
    while (i < count) {
      this.locationProvider
        .getLocationAtIndex(i)
        .then(v => {
          const uri = this.web3Provider.getWeb3().toUtf8(v[0]);
          const name = this.web3Provider.getWeb3().toUtf8(v[1]);
          this.locations.push({uri, name});
        })
        .catch(v => console.log(v));
      i++;
    }
  }
}
