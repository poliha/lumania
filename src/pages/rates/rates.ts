import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CardPayment } from '../card-payment/card-payment';
import { AuthService } from '../../providers/auth-service';
import { Lapi } from '../../providers/lapi';
import { LoadingService } from '../../providers/loading-service';
import { Utility } from '../../providers/utility';
import { StellarService } from '../../providers/stellar-sdk';
import { Sell } from '../sell/sell';
import { Storage } from '@ionic/storage';
import { SupportChannels } from '../support-channels/support-channels';


@IonicPage()
@Component({
  selector: 'page-rates',
  templateUrl: 'rates.html',
})
export class Rates {
	rates: any = {};
	ratesObj: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public stellarService: StellarService, public utility: Utility, public storage: Storage,
  	public authService: AuthService, public lapi: Lapi, public loadingService: LoadingService) {
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

        // get rates from local store
        return this.storage.get('rates');
        
      })
      .catch((err) => {
          this.loadingService.hideLoader();
          // to do add toast
          console.log("error",err);
      })
      .then((val) => {
          this.rates = val;
          this.processRates();
      });
  }

  processRates(){
    this.ratesObj = this.rates;
    console.log(this.ratesObj);

  }

  supportChannels(){
    this.navCtrl.push(SupportChannels);
  }

}
