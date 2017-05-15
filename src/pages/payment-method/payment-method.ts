import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CardPayment } from '../card-payment/card-payment';
import { AccountDetails } from '../account-details/account-details';
import { LinkAccount } from '../link-account/link-account';

/**
 * Generated class for the PaymentMethod page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-payment-method',
  templateUrl: 'payment-method.html',
})
export class PaymentMethod {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentMethod');
  }

  addFunds(x){
  	switch (x) {
  		case 1:
  			this.navCtrl.push(CardPayment);
  			break;
  		case 2:
  			this.navCtrl.push(LinkAccount);
  			break;
  		case 3:
  			this.navCtrl.push(AccountDetails);
  			break;
  		default:
  			// code...
  			break;
  	}
  }

}
