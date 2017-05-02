import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
	account: {auth_code: string, password: string, confirm_password: string} = {
		'auth_code': "",
  	'password': "",
  	'confirm_password': ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.part = "request";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordReset');
  }

  requestReset(){

  }

}
