import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PaymentService } from '../../providers/payment-service';
import { Utility } from '../../providers/utility';

/**
 * Generated class for the CardPayment page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-card-payment',
  templateUrl: 'card-payment.html',
})
export class CardPayment {
	amount: any;
	currency: string;
  rates: any;
  lumens_amount = 0.00;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public paymentService: PaymentService) {
    this.getRates();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardPayment');
    // get rates and store
  }

  pay(){
  	this.paymentService.raveCheckout(this.amount, this.currency, this.lumens_amount);
  }

  getRates(){
    Utility.getRates()
      .subscribe((resp) => {
          console.log(resp);
          this.rates.usd = resp.price;
          this.rates.ngn = resp.price;

      }, (err) => {
          console.log(err);
          // use default
      });

    Lapi.getNgnRate()
      .subscribe((resp) => {
          console.log(resp);
          this.rates.ngn = resp.content.data;

      }, (err) => {
          console.log(err);
          // use default
      });
  }

  calculateXLM(){

    switch (this.currency) {
      case "NGN":
        this.lumens_amount = (this.amount/this.rates.usd)*this.rates.usd;
        break;

      case "USD":
        this.lumens_amount = this.amount * this.rates.usd;
        break;
      
      case "EUR":
        this.lumens_amount = this.amount * this.rates.usd;
        break;
      
      default:
        // code...
        break;
    }

    
  }

}
