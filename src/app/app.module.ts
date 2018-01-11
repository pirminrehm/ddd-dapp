import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { NgxQRCodeModule } from 'ngx-qrcode2';
import { IonRangeSliderModule } from "ng2-ion-range-slider";

import { MyApp } from './app.component';

import { TeamPage } from '../pages/team/team';
import { TabsPage } from '../pages/tabs/tabs';
import { LocationPage } from './../pages/location/location';
import { VotingPage } from './../pages/voting/voting';

import { Web3Provider } from '../providers/web3/web3';
import { LocationProvider } from './../providers/web3/location';
import { VotingProvider } from '../providers/web3/voting';
import { VotingDetailsPage } from './../pages/voting-details/voting-details';
import { TeamProvider } from './../providers/web3/team';
import { SettingsProvider } from './../providers/storage/settings';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { TeamJoinRequestPage } from '../pages/team-join-request/team-join-request';
import { NotificationProvider } from '../providers/notification/notification';
import { AppStateProvider } from '../providers/storage/app-state';

@NgModule({
  declarations: [
    MyApp,
    TeamPage,
    TeamJoinRequestPage,
    LocationPage,
    VotingPage,
    VotingDetailsPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    SettingsPageModule,
    NgxQRCodeModule,
    IonRangeSliderModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TeamPage,
    TeamJoinRequestPage,
    LocationPage,
    VotingPage,
    VotingDetailsPage,
    TabsPage
  ],
  providers: [
    Web3Provider,
    LocationProvider,
    VotingProvider,
    TeamProvider,
    SettingsProvider,
    AppStateProvider,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    NotificationProvider
  ]
})
export class AppModule {}
