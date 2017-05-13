import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the Sell page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-sell',
  templateUrl: 'sell.html',
})
export class Sell {
	balances: any = [];
  currentAccountId: any = false;
  rates: any = {};
  currentRate: any = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public lapi: Lapi, 	public paymentService: PaymentService, 
  	public stellarService: StellarService, public authService: AuthService) 
  {
  	this.currentAccountId = this.authService.getAccountId();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Sell');
  }

  getBalance(){

    if (this.currentAccountId) {
      this.stellarService.getBalance(this.currentAccountId)
        .then((account)=>{

          this.balances = account.balances;
        })
        .catch((error)=>{

          console.log(error);
        })
    } else {
      this.balances.push({
        "balance": "0.00",
        "asset_type": "native"
      })

    }
  }

    getRates(){
    this.loadingService.showLoader("Getting best rates...");
    this.lapi.getRates()
      .map(res => res.json())
      .subscribe((resp) => {
          this.loadingService.hideLoader();
          console.log(resp);
          
          this.rates = resp.content.data;
          this.getCurrentRate();
          // this.calculateBalances();
        }, (err) => {
          this.loadingService.hideLoader();
          // to do add toast
          console.log(err.json());
        });

  }

  getCurrentRate(){
  	let target = this.currency+'XLM';
    this.currentRate = parseFloat(this.rates[target])/parseFloat(this.rates.USDXLM);
  }

  calculateFiat(value){
    console.log("calculateinput", value, this.currency, this.amount, this.lumens_amount);
    // console.log("rates", this.rates);

    if (this.currency === 'USD') { 
      this.fiatAmount = parseFloat(this.xlmAmount)*parseFloat(this.rates.USDXLM);
    } else {
      let target = this.currency+'XLM';
      this.fiatAmount = (parseFloat(this.xlmAmount)/parseFloat(this.rates[target]))*parseFloat(this.rates.USDXLM);
    }

  }

  calculateXLM(value){
  	this.getCurrentRate();
    console.log("calculateinput", value, this.currency, this.amount, this.lumens_amount);
    // console.log("rates", this.rates);

    if (this.currency === 'USD') {

      this.xlmAmount = parseFloat(this.fiatAmount)/parseFloat(this.rates.USDXLM);
    } else {
      let target = this.currency+'XLM';
      this.xlmAmount = (parseFloat(this.fiatAmount)*parseFloat(this.rates[target]))/parseFloat(this.rates.USDXLM);
    }

  }

  sell(){
  	this.paymentService.sellLumens(this.fiatAmount, this.xlmAmount, this.currency, this.currentRate, this.currentAccount);
  }

}
