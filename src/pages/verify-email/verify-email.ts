import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { Dashboard } from '../dashboard/dashboard';
/**
 * Generated class for the VerifyEmail page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifyEmail');
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
  		//check user obj
  		if (this.authService.user.get('email_verified', false)) {
  			// toast success
  			this.showToast("Email verified successfully");
  			// navigate to dashboard
  			this.navCtrl.push(Dashboard);
  		}else{
  			// toast error
  			this.showToast("Verification failed");
  		}

  	} else {
  		// toast error
  		this.showToast("Verification failed");
  	}
  }

}
