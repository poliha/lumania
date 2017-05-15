import { Injectable } from '@angular/core';
import { AlertController} from 'ionic-angular';
// import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  // advancedAlert(title,message,btnText,destination){
  //    this.alert = this.alertCtrl.create({
  //     title: title,
  //     message: message,
  //     buttons: [
  //     {
  //       text: btnText,
  //       role: 'cancel',
  //       handler: () => {
  //         console.log('Cancel clicked');
  //         this.navCtrl.push(destination);
  //       }
  //     }
  //     ]
  //   });
  //   this.alert.present();

  // }



}
