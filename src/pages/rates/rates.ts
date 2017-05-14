import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CardPayment } from '../card-payment/card-payment';
import { AuthService } from '../../providers/auth-service';
import { Lapi } from '../../providers/lapi';
import { LoadingService } from '../../providers/loading-service';
import { Utility } from '../../providers/utility';
import { StellarService } from '../../providers/stellar-sdk';
import { Sell } from '../sell/sell';


/**
 * Generated class for the Rates page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-rates',
  templateUrl: 'rates.html',
})
export class Rates {
	rates: any = {};
	ratesObj: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public stellarService: StellarService, public utility: Utility,
  	public authService: AuthService, public lapi: Lapi, public loadingService: LoadingService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Rates');
  }

  ionViewWillEnter(){
    console.log('getting balance');
    this.getRates();
  }

	buyPage(currency, rate){
		let payload = {"buyRate": rate,
									"currency": currency};

    this.navCtrl.push(CardPayment, payload);
  }
  sellPage(currency, rate){
  	let payload = {"sellRate": rate,
  								"currency": currency};

    this.navCtrl.push(Sell, payload);
  }

  getRates(){

      this.loadingService.showLoader("Loading...");
      this.lapi.getRates()
        .then((resp)=>{
        this.loadingService.hideLoader();
        console.log(resp);
        this.rates = resp;
        this.processRates();
      })
      .catch((err) => {
          this.loadingService.hideLoader();
          // to do add toast
          console.log("error",err);

      });
  }

  processRates(){
  	// for each rate, calculate buy/sell amount
  	// push to new obj or array
  	let tempRatesArray = [];
  	for (var prop in this.rates) {
     	if (prop !== 'timestamp') {
     	
     
	      if (prop !== 'USDXLM') {
	        let base = parseFloat(this.rates[prop])/parseFloat(this.rates.USDXLM);
	        let buyValue = this.utility.round((base),7);
	        let sellValue = this.utility.round((base),7);
	        tempRatesArray.push({
	        	"currency": prop.substring(0,3),
	          "buy": buyValue,
	          "sell": sellValue
	        });
	      }else{
	      	let base = 1/parseFloat(this.rates.USDXLM);
	        let buyValue = this.utility.round((base),7);
	        let sellValue = this.utility.round((base),7);
	        tempRatesArray.push({
	        	"currency": prop.substring(0,3),
	          "buy": buyValue,
	          "sell": sellValue
	        });
	      }
    	}
    }

    this.ratesObj = tempRatesArray;
    console.log(this.ratesObj);

  }

}
