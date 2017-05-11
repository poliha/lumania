import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AlertService {

	alert: any;
  constructor(public alertCtrl: AlertController) {
    console.log('Hello BasicAlert Provider');
  }

  basicAlert(title,message,btnText){
     this.alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [btnText]
    });
    this.alert.present();

  }



}
