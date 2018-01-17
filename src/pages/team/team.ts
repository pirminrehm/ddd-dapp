import { SettingsProvider } from './../../providers/storage/settings';
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import 'rxjs/add/operator/filter';

@Component({
  selector: 'page-team',
  templateUrl: 'team.html'
})
export class TeamPage implements OnInit {

  teamAddress: Boolean;

  constructor(public navCtrl: NavController, 
              private settingsProvider: SettingsProvider) {                                
  }

  ngOnInit() {
    this.teamAddress = false;
  }

  async ionViewWillEnter() {
    this.stateChanged();
  }

  private async stateChanged() {
    let teamAddress = await this.settingsProvider.getTeamAddress();
    this.teamAddress = teamAddress;
  }

  onTeamCreated() {
    this.stateChanged();
  }
}
 