import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Auth, User} from '@ionic/cloud-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams,
  		public auth: Auth, public user: User) {
  	this.part = "request";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordReset');
  }

  requestReset(){
  	this.auth.requestPasswordReset(this.email).then((d) => {

        // success
        console.log(d);

    }, (err) => {

   	    // problem logging in
        console.log(err);

    });;
  }

  confirmReset(){
  	this.auth.confirmPasswordReset(this.account.auth_code, this.account.password);
  }

}
