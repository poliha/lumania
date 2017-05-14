import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VerifyEmail } from '../verify-email/verify-email';
import { PaymentMethod } from '../payment-method/payment-method';
import { AuthService } from '../../providers/auth-service';
import { Lapi } from '../../providers/lapi';
import { LoadingService } from '../../providers/loading-service';
import { Utility } from '../../providers/utility';
import { StellarService } from '../../providers/stellar-sdk';
import { Sell } from '../sell/sell';
import { Send } from '../send/send';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the Wallet page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class Wallet {

  balances: any = [];
  currentAccountId: any = false;
  rates: any = {};
  equivalentBalances: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public stellarService: StellarService, public utility: Utility, public storage: Storage,
  	public authService: AuthService, public lapi: Lapi, public loadingService: LoadingService) {
    this.currentAccountId = this.authService.getAccountId();
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Wallet');
    

  }

  ionViewWillEnter(){
    console.log('getting balance');

    // this.getBalance();
    this.getRates();
    // this.calculateBalances();

  }

  verifyEmail(){
  	this.navCtrl.push(VerifyEmail);
  }

  showPaymentPage(){
    this.navCtrl.push(PaymentMethod);
  }
  sendPage(){
    this.navCtrl.push(Send);
  }
  sellPage(){
    this.navCtrl.push(Sell);
  }

  getBalance(){
  
    if (this.currentAccountId) { 
      this.stellarService.getBalance(this.currentAccountId)
        .then((account)=>{
          
         this.balances = account.balances;
         // this.getRates();

         
         return this.storage.get('rates');
        })
        .catch((error)=>{
          
          console.log(error);
        })
        .then((val) => {
          this.rates = val;
          this.calculateBalances();
        });

    } else {
      this.balances.push({
        "balance": "0.00",
        "asset_type": "native"
      })
      
    }
  }

  getRates(){
    if (this.currentAccountId) { 
      this.loadingService.showLoader("Loading...");
      this.lapi.getRates()
        .then((resp)=>{
        this.loadingService.hideLoader();
        console.log(resp);
        // this.rates = resp;
        this.getBalance();

        // this.calculateBalances();
      })
      .catch((err) => {
          this.loadingService.hideLoader();
          // to do add toast
          console.log("error",err);
  
      });
        // .map(res => res.json())
        // .subscribe((resp) => {
        //         this.loadingService.hideLoader();
        //         console.log(resp);
        //         this.rates = resp.content.data;
        //         this.calculateBalances();
        //       }, (err) => {
        //         this.loadingService.hideLoader();
        //         // to do add toast
        //         console.log(err.json());
        
        //       });
    } else {
      this.balances.push({
        "balance": "0.00",
        "asset_type": "native"
    })
      
    }
  }

  calculateBalances(){
    let lumen_balance: any;
    let equivBal = [];
    for (let i = 0; i < this.balances.length; i++) {
      
     if (this.balances[i].asset_type === 'native') {
          lumen_balance = this.balances[i].balance
        }
    }

    
      for (var prop in this.rates) {
        if (prop !== 'timestamp') {
          if (prop !== 'USDXLM') {
            let currencyPairValue = this.utility.round((parseFloat(this.rates.USDXLM) * parseFloat(this.rates[prop])),7);
            equivBal.push({
              "balance": currencyPairValue,
              "asset_type": prop.substring(0,3)
            });
          }else{
            equivBal.push({
              "balance": this.rates.USDXLM,
              "asset_type": prop.substring(0,3)
            });
          }
      }
    }
    this.equivalentBalances = equivBal
    console.log(this.equivalentBalances);

  }

}
