import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { Dashboard } from '../dashboard/dashboard';

@IonicPage()
@Component({
  selector: 'page-verify-email',
  templateUrl: 'verify-email.html',
})
export class VerifyEmail {

	auth_code: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	private toastCtrl: ToastController, public authService: AuthService) {
  }

  showToast(m) {
    let toast = this.toastCtrl.create({
      message: m,
      duration: 3000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  verifyEmailCode(){
  	let resp = this.authService.verifyEmail(this.auth_code);
  	if (resp) {

      this.authService.saveData('email_verified', true)
      .then(()=>{
        this.showToast("Email verified successfully");

        this.navCtrl.pop();
      })
      .catch((err)=>{
        console.log(err);
        this.showToast("Verification failed");
      });

  	} else {

  		this.showToast("Verification failed");
  	}
  }

}
