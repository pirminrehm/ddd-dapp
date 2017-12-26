import { Component } from '@angular/core';

import { TeamPage } from '../team/team';
import { LocationPage } from '../location/location';
import { VotingPage } from '../voting/voting';
import { SettingsPage } from './../settings/settings';



@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = TeamPage;
  tab2Root = VotingPage;
  tab3Root = LocationPage;
  tab4Root = SettingsPage;

  constructor() {

  }
}
