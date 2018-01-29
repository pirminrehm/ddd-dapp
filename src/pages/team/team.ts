import { MemberApprovedProvider } from './../../providers/helpers/member-approved';
import { SettingsProvider } from './../../providers/storage/settings';
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-team',
  templateUrl: 'team.html'
})
export class TeamPage implements OnInit {

  teamAddress: Boolean;
  isLoading: Boolean;

  constructor(public navCtrl: NavController, 
              private settingsProvider: SettingsProvider,
              private memberApprovedProvider: MemberApprovedProvider) {                                
  }

  ngOnInit() {
    this.teamAddress = false;
    this.memberApprovedProvider.onApproved().subscribe(_ => this.stateChanged());
  }

  async ionViewWillEnter() {
    this.stateChanged();
  }

  private async stateChanged() {
    this.isLoading = true;
    this.teamAddress = await this.settingsProvider.getTeamAddress();
    this.isLoading = false;
  }

  onTeamCreated() {
    this.stateChanged();
  }
}
 