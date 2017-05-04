import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

/**
 * Generated class for the PasswordReset page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-password-reset',
  templateUrl: 'password-reset.html',
})
export class PasswordReset {

	email: string;
	part: string;
	account: {auth_code: number, password: string, confirm_password: string} = {
		'auth_code': null,
  	'password': "",
  	'confirm_password': ""
  };
  messages: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController,
  		public authService: AuthService) {
  	this.part = "request";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordReset');
  }

  showToast(m) {
    let toast = this.toastCtrl.create({
      message: m,
      duration: 5000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      this.part = "change";
    });

    toast.present();
  }

  requestReset(){
  	this.authService.resetPasswordRequest(this.email)
    .then((resp) => {

      console.log(resp);

      if (resp.status === 'error') {
        this.messages = resp.messages;


      }

      if (resp.status === 'success') {
        // display toast 
        // navigate to new tab
        this.showToast('Please check your mail for the authorisation code');
      }

    });
  }

  confirmReset(){
  	this.authService.changePassword(this.account.auth_code, this.account.password)
    .then((resp) => {

      console.log(resp);

      if (resp.status === 'error') {
        this.messages = resp.messages;


      }

      if (resp.status === 'success') {
        // display toast 
        // navigate to new tab
        this.showToast('Password changed successfuly');
      }

    });
  }

}
