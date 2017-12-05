import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { LocationPage } from '../location/location';
import { VotingPage } from '../voting/voting';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = VotingPage;
  tab3Root = LocationPage;

  constructor() {

  }
}
