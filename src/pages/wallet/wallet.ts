import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VerifyEmail } from '../verify-email/verify-email';
import { AuthService } from '../../providers/auth-service';
/**
 * Generated class for the Wallet page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class Wallet {

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public authService: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Wallet');
  }

  verifyEmail(){
  	this.navCtrl.push(VerifyEmail);
  }

}
