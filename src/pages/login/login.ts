import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Auth, User} from '@ionic/cloud-angular';
/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {

	account: {email: string, password: string} = {
		'email': "",
  	'password': ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public auth: Auth, public user: User) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  doLogin(){

  	let details = {'email': this.account.email, 'password': this.account.password};

  	this.auth.login('basic', details).then(() => {

        // success
        console.log(this.user);

    }, (err) => {

   	    // problem logging in
        console.log(err);

    });
  }

}
