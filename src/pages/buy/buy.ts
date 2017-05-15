import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Config } from 'ionic-angular';
import { PaymentService } from '../../providers/payment-service';
import { Utility } from '../../providers/utility';
import { Lapi } from '../../providers/lapi';
import { LoadingService } from '../../providers/loading-service';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-buy',
  templateUrl: 'buy.html',
})
export class Buy {
	amount: any = 0.00;
	currency: string;
  currencyList = [];
  rates: any = {};
  lumens_amount = 0.00;

  constructor(public navCtrl: NavController, public navParams: NavParams,public storage: Storage,
    public utility: Utility,  public lapi: Lapi, 	public paymentService: PaymentService, 
    public loadingService: LoadingService,  public config: Config) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Buy');
  }
	ionViewWillEnter(){
    console.log('getting balance');
    this.getRates();
  }

  pay(){
  	// this.paymentService.waveCheckout(this.amount, this.currency, this.lumens_amount);
  }

  getRates(){
    this.loadingService.showLoader("Getting best rates...");
    this.lapi.getRates()
      .then((resp)=>{
        this.loadingService.hideLoader();
        console.log(resp);
        // this.rates = resp;
        return this.storage.get('rates');
      })
      .catch((err) => {
          this.loadingService.hideLoader();
          // to do add toast
          console.log("error",err.json());
      })
      .then((val) => {
          this.rates = val;
          // this.calculateBalances();
      });
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
