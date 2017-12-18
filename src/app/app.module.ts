import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LocationPage } from './../pages/location/location';
import { VotingPage } from './../pages/voting/voting';

import { Web3Provider } from '../providers/web3/web3';
import { LocationProvider } from './../providers/web3/location';
import { VotingProvider } from '../providers/web3/voting';
import { TeamProvider } from './../providers/web3/team';
import { SettingsProvider } from './../providers/storage/settings';
import { SettingsPageModule } from '../pages/settings/settings.module';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LocationPage,
    VotingPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    SettingsPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LocationPage,
    VotingPage,
    TabsPage
  ],
  providers: [
    Web3Provider,
    LocationProvider,
    VotingProvider,
    TeamProvider,
    SettingsProvider,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
