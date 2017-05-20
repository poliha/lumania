import { Injectable } from '@angular/core';
import { ToastController} from 'ionic-angular';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';





@Injectable()
export class ToastService {

  constructor(public toastCtrl: ToastController) {
    console.log('Hello ToastService Provider');
  }

  public showToast(text, duration?: number, position?: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration:  duration || 3000,
      position:  position || 'top'
    });
    toast.present();
  }

}
