import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { NgxQRCodeModule } from 'ngx-qrcode2';

import { MyApp } from './app.component';

import { TeamPage } from '../pages/team/team';
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
    TeamPage,
    LocationPage,
    VotingPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    SettingsPageModule,
    NgxQRCodeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TeamPage,
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
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner
  ]
})
export class AppModule {}
