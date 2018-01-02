import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ToastController } from 'ionic-angular';


/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationProvider {

  constructor(private toastCtrl: ToastController) {
  }


  success(message: string) {
    this.presentToast({
      message: message,
      cssClass: 'toast-success'
    });
  } 

  error(message: string) {
    this.presentToast({
      message: message,
      cssClass: 'toast-error'
    });
  }

  private presentToast(options: Object) {
    const defaultOptions = {
      duration: 3000,
      position: 'top'
    };
    let toast = this.toastCtrl.create(Object.assign(defaultOptions, options));
  
    toast.onDidDismiss(() => {});
    toast.present();
  }

}
