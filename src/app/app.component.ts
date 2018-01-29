import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { MemberApprovedProvider } from './../providers/helpers/member-approved';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = TabsPage;

  constructor(public platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              public alertCtrl: AlertController,
              private memberApprovedProvider: MemberApprovedProvider) {
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.backgroundColorByHexString('#0e0705');
      splashScreen.hide();
      this.initializeBackButtonAction();
      this.memberApprovedProvider.doCheck();
    });
  }


  private initializeBackButtonAction() {
    //android only
    let lockPrompt = false;
    this.platform.registerBackButtonAction(data => {
      if (this.nav.canGoBack()) {
        this.nav.pop();
      } else if (!lockPrompt) {
        lockPrompt = true;
        let title = 'Close App';
        let message = `Do you really want to close the app?`;
        this.promptYesNoWithMessage(title,message).then(() => {
          navigator['app'].exitApp()
        }).catch(()=>{
          lockPrompt = false;
        })
      }
    }, 1)
  }
  
  private promptYesNoWithMessage (title: string, message: string) {
		return new Promise ((resolve,reject) => {
			let buttons = [{ 
        text: 'Yes',		handler: data => resolve(true) },{
        text: 'No',	handler: data => reject({abort:true, message: null})
      }];
			let prompt = this.alertCtrl.create({
				title: title,
				message: message,
        buttons: buttons,
        cssClass: 'alert-dark'
			});
			prompt.present();
			prompt.onDidDismiss(data => reject({abort:true, message: null}));
		})
	}
}
