import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Config } from 'ionic-angular';
import { PaymentService } from '../../providers/payment-service';
import { AuthService } from '../../providers/auth-service';
import { Lapi } from '../../providers/lapi';
import { LoadingService } from '../../providers/loading-service';
import { Utility } from '../../providers/utility';
import { StellarService } from '../../providers/stellar-sdk';
import { AlertService } from '../../providers/alert-service';
import { Storage } from '@ionic/storage';
import { ChangePin } from '../change-pin/change-pin';
import { BankDetails } from '../bank-details/bank-details';


@IonicPage()
@Component({
  selector: 'page-sell',
  templateUrl: 'sell.html',
})
export class Sell {
	balances: any = [];
  currentBalance = 0.00;
  currentAccountId: any = false;
  rates: any = {};
  pin: any = "";
  currentRate: any = 1;
  xlmAmount: any;
  fiatAmount:any;
  sendCurrency = 'XLM';
  recvCurrency = 'NGN';
  currencyList = [];
  bank_details:any ;

  constructor(public navCtrl: NavController, public navParams: NavParams, public config: Config,
    public loadingService: LoadingService, public utility: Utility,	public lapi: Lapi,
    public paymentService: PaymentService,public alertService: AlertService, 
    public alertCtrl: AlertController, public storage: Storage, 
    public stellarService: StellarService, public authService: AuthService)
  {
    this.currencyList = this.config.get('currencyList');
  	this.currentAccountId = this.authService.getAccountId();
    this.currentRate = this.navParams.get('sellRate') || 1.00;
    this.recvCurrency = this.navParams.get('currency') || 'NGN';
  }

  ionViewWillEnter(){
    console.log('getting balance');
    this.getRates();
    this.checkBankAccount();
  }

  /**
   * Check if user has set a pin.
   * Prompts if not
   */
  checkPin(){
    if (this.authService.getData('pin')) {
      return true;
    } else {
        let alert = this.alertCtrl.create({
        title: 'Set Pin',
        message: 'You have not set a PIN yet. Please set Pin',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.navCtrl.push(ChangePin);
            }
          }
        ]
      });
      
      alert.present();
    }
  }

  /**
   * Check if user has set a bank account
   * Prompts if not
   */
  checkBankAccount(){
    if (this.authService.getData('bank_details')) {
      this.bank_details = this.authService.getData('bank_details');
      return true;
    } else {
        let alert = this.alertCtrl.create({
        title: 'Set Bank Details',
        message: 'You have no bank details for set',
        buttons: [
          {
            text: 'Set Bank Details',
            handler: () => {
              this.navCtrl.push(BankDetails);
            }
          }
        ]
      });
      
      alert.present();
    }
  }

  // To Do move getBalance() in all pages to utility func
  /**
   * Get account balance in XLM
  */
  getBalance(){

    if (this.currentAccountId) {
      this.stellarService.getBalance(this.currentAccountId)
        .then((account)=>{
          this.balances = account.balances;
          this.currentBalance = this.balances[0].balance;
        })
        .catch((error)=>{

          console.log(error);
          this.balances = [{
            "balance": "0.00",
            "asset_type": "native"
          }];
        });
    } else {
       this.balances = [{
        "balance": "0.00",
        "asset_type": "native"
      }];

    }
  }

  /**
   * Get rates for buyin/selling XLM in other currencies
   */
  getRates(){
    this.loadingService.showLoader("Getting best rates...");
    this.lapi.getRates()
      .then((resp)=>{
        this.loadingService.hideLoader();
        console.log(resp);
        return this.storage.get('rates');

      })
      .catch((err) => {
          this.loadingService.hideLoader();
          console.log("error",err.json());

      })
      .then((val) => {
          this.rates = val;
          this.getCurrentRate();
          this.getBalance();
      });
  }

  /**
   * Get current rate depending on the curreny selected
   */
  getCurrentRate(){

    for (var i = 0; i < this.rates.length; i++) {
        if (this.rates[i].currency === this.recvCurrency) {
          this.currentRate = this.rates[i].sell;
        }
    }

    // if (this.recvCurrency === 'USD') { 
    //   this.currentRate = this.utility.round((1/this.rates.USDXLM), 7);
    // } else {
    //   let target = this.recvCurrency+'XLM';
    //   this.currentRate = this.utility.round((parseFloat(this.rates[target])/parseFloat(this.rates.USDXLM)), 7);
    // }

  }

  /**
   * calculate value of fiat based on xlm value
   * @param {[type]} value [description]
   */
  calculateFiat(value){


    if (!this.xlmAmount) { 
      this.fiatAmount = 0.00;
    } else {
      this.fiatAmount = this.utility.round((this.xlmAmount*this.currentRate),7);
    }

  }

  /**
   * calculate value of xlm based on fiat value
   * @param {[type]} value [description]
   */
  calculateXLM(value){
  	this.getCurrentRate();

    if (!this.fiatAmount) { 
      this.xlmAmount = 0.00;
    } else {
      this.xlmAmount = this.utility.round(((this.fiatAmount)/this.currentRate),7);
    }
  }

  /**
   * Sell XLM
   */
  sell(){
    // To do
    // check balance before selling
    // return Promises
  	this.paymentService.sellLumens(this.fiatAmount, this.xlmAmount, this.recvCurrency, this.currentRate, this.currentAccountId, this.pin);
  }

}
