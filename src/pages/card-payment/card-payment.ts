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
    // this.currentRate = this.navParams.get('sellRate') || 1.00;
    // this.recvCurreny = this.navParams.get('currency') || 'NGN';
    this.currency = this.navParams.get('currency') || this.config.get('defaultCurrency');
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
      .then((resp)=>{
        this.loadingService.hideLoader();
        console.log(resp);
        this.rates = resp;
      })
      .catch((err) => {
          this.loadingService.hideLoader();
          // to do add toast
          console.log("error",err.json());
  
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
      this.lumens_amount = this.utility.round((this.amount*this.rates.USDXLM),7);
    } else {
      let target = this.currency+'XLM';
      this.lumens_amount = this.utility.round(( (this.amount/this.rates[target])*this.rates.USDXLM), 7);
    }
  }

  onInput(value){
    
    // console.log("rates", this.rates);

    if (this.currency === 'USD') { 
      let temp = ( parseFloat(this.amount)*parseFloat(this.rates.USDXLM));
      console.log("temp", temp);
      this.lumens_amount = this.utility.round(temp,7);
      console.log("calculateinput", value, this.currency, this.amount, this.lumens_amount, this.rates.USDXLM);
    } else {
      let target = this.currency+'XLM';
      let temp = (parseFloat(this.amount)/parseFloat(this.rates[target]))*parseFloat(this.rates.USDXLM);
      console.log("temp", temp);
      this.lumens_amount = this.utility.round(temp, 7);
      console.log("calculateinput", value, this.currency, this.amount, this.lumens_amount, this.rates.USDXLM, this.rates[target]);
    }
  }



}
