import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Config } from 'ionic-angular';
import { PaymentService } from '../../providers/payment-service';
import { Utility } from '../../providers/utility';
import { Lapi } from '../../providers/lapi';
import { LoadingService } from '../../providers/loading-service';

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
	amount: any = 0.00;
	currency: string;
  currencyList = [];
  rates: any = {};
  lumens_amount = 0.00;

  constructor(public navCtrl: NavController, public navParams: NavParams, public utility: Utility,
    public lapi: Lapi, 	public paymentService: PaymentService, public loadingService: LoadingService,
    public config: Config) {
    this.currencyList = this.config.get('currencyList');
    this.currency = this.config.get('defaultCurrency');
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
    this.loadingService.showLoader("Getting best rates...");
    this.lapi.getRates()
      .map(res => res.json())
      .subscribe((resp) => {
          this.loadingService.hideLoader();
          console.log(resp);
          this.rates = resp.content.data;
          // this.calculateBalances();
        }, (err) => {
          this.loadingService.hideLoader();
          // to do add toast
          console.log(err.json());
  
        });

   //  this.utility.getRates()
   //    .subscribe((resp) => {
   //        console.log(resp);
   //        this.rates.usd = parseFloat(resp.ticker.price);
   //        // this.rates.ngn = resp.price;
   //        console.log("rates", this.rates);

   //    }, (err) => {
   //        console.log(err);
   //        // use default
   //    });

   // this.lapi.getNgnRate()
   //     .map(res => res.json())
   //    .subscribe((resp) => {
   //        console.log(resp);
   //        this.rates.ngn = parseFloat(resp.content.data);
   //        console.log("rates", this.rates);

   //    }, (err) => {
   //        console.log(err);
   //        // use default
   //    });
  }

  calculateXLM(){
    console.log("calculateXLM");

    if (this.currency === 'USD') { 
      this.lumens_amount = this.amount*this.rates.USDXLM;
    } else {
      let target = this.currency+'XLM';
      this.lumens_amount = (this.amount/this.rates[target])*this.rates.USDXLM;
    }

    // switch (this.currency) {
    //   case "NGN":
    //     this.lumens_amount = (this.amount/this.rates.ngn)*this.rates.usd;
    //     break;

    //   case "USD":
    //     this.lumens_amount = this.amount * this.rates.usd;
    //     break;
      
    //   case "EUR":
    //     this.lumens_amount = this.amount * this.rates.usd;
    //     break;
      
    //   default:
    //     // code...
    //     break;
    // }

    
  }

  onInput(value){
    console.log("calculateinput", value, this.currency, this.amount, this.lumens_amount);
    // console.log("rates", this.rates);

    if (this.currency === 'USD') { 
      this.lumens_amount = parseFloat(this.amount)*parseFloat(this.rates.USDXLM);
    } else {
      let target = this.currency+'XLM';
      this.lumens_amount = (parseFloat(this.amount)/parseFloat(this.rates[target]))*parseFloat(this.rates.USDXLM);
    }

    // switch (this.currency) {
    //   case "NGN":
    //   console.log("ngn");
    //     this.lumens_amount = (parseFloat(this.amount)/parseFloat(this.rates.ngn))*parseFloat(this.rates.usd);
    //     break;

    //   case "USD":
    //   console.log("usd");
    //     this.lumens_amount = parseFloat(this.amount) * parseFloat(this.rates.usd);
    //     break;
      
    //   case "EUR":
    //   console.log("eur");
    //     this.lumens_amount = parseFloat(this.amount) * parseFloat(this.rates.usd);
    //     break;
      
    //   default:
    //     // code...
    //     break;
    // }

  }



}
