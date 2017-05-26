import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CardPayment } from '../card-payment/card-payment';
import { AccountDetails } from '../account-details/account-details';
import { LinkAccount } from '../link-account/link-account';
import { ClaimLumensPage } from '../claim-lumens/claim-lumens';

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
      case 4:
        this.navCtrl.push(ClaimLumensPage);
        break;
  		default:
  			// code...
  			break;
  	}
  }

}
