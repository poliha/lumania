import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';
import { VerifyEmail } from '../verify-email/verify-email';
import { PaymentMethod } from '../payment-method/payment-method';
import { AccountRecovery } from '../account-recovery/account-recovery';
import { AuthService } from '../../providers/auth-service';
import { Lapi } from '../../providers/lapi';
import { LoadingService } from '../../providers/loading-service';
import { Utility } from '../../providers/utility';
import { StellarService } from '../../providers/stellar-sdk';
import { Sell } from '../sell/sell';
import { Send } from '../send/send';
import { Storage } from '@ionic/storage';
import { AlertService } from '../../providers/alert-service';
import { SupportChannels } from '../support-channels/support-channels';

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
    public alertService: AlertService, public stellarService: StellarService,
    public utility: Utility, public storage: Storage,
  	public authService: AuthService, public lapi: Lapi,
    public alertCtrl: AlertController, public loadingService: LoadingService) {

    this.currentAccountId = this.authService.getAccountId();

  }

  ionViewWillEnter(){

    this.currentAccountId = this.authService.getAccountId();
    this.getBalance();
    this.getRates();
    this.calculateBalances();
    this.checkForSeed();

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

  /**
   * Checks if account details is on device
   */
  checkForSeed(){
    this.currentAccountId = this.authService.getAccountId();
    if (this.currentAccountId) {
      this.storage.get('account_details_'+this.authService.getUuid())
      .then((data) => {
          if (data) {
            console.log("account details retrieved",data);
          } else {
            // no details found. Recover account
              let alert = this.alertCtrl.create({
              title: 'Recover Account',
              message: 'Account details no found on device. You will be unable to perform any transactions. Please recover your account',
              buttons: [
                  {
                    text: 'Ok',
                    handler: () => {
                      this.navCtrl.push(AccountRecovery);
                    }
                  }
                ]
              });

            alert.present();
          }

      },
      (err) => {

      });

    } else {
      // user does not have account. Screen will display buy lumens options
    }
  }

  /**
   * Get balance for the current stellar ID, defaults to 0, if account
   * not found
   */
  getBalance(){
    this.currentAccountId = this.authService.getAccountId();

    if (this.currentAccountId) {
      this.stellarService.getBalance(this.currentAccountId)
        .then((account)=>{
         this.balances = account.balances;
         return this.storage.get('rates');
        })
        .catch((error)=>{
          console.log(error);
          this.balances = [{
            "balance": "0.00",
            "asset_type": "native"
          }];

        })
        .then((val) => {
          this.rates = val;
          // calculate balance equivalent in other currencies
          this.calculateBalances();
        });

    } else {
      this.balances = [{
        "balance": "0.00",
        "asset_type": "native"
      }];

    }
  }

  /**
   * Get currency exchange rates
   */
  getRates(){
    if (this.currentAccountId) {
      this.loadingService.showLoader("Loading...");
      this.lapi.getRates()
        .then((resp)=>{
        this.loadingService.hideLoader();
        console.log(resp);

        this.getBalance();

      })
      .catch((err) => {
          this.loadingService.hideLoader();
          console.log("error",err);

      });

    } else {
      this.balances = [{
        "balance": "0.00",
        "asset_type": "native"
      }];

    }
  }

  /**
   * calculates balance of XLM in other currencies
   */
  calculateBalances(){
    let lumen_balance: any;
    let equivBal = [];
    for (let i = 0; i < this.balances.length; i++) {

     if (this.balances[i].asset_type === 'native') {
          lumen_balance = this.balances[i].balance
        }
    }


    //   for (var prop in this.rates) {
    //     if (prop !== 'timestamp') {
    //       if (prop !== 'USDXLM') {
    //         let currencyPairValue = this.utility.round( (lumen_balance * (parseFloat(this.rates[prop]) / parseFloat(this.rates.USDXLM))),7);
    //         equivBal.push({
    //           "balance": currencyPairValue,
    //           "asset_type": prop.substring(0,3)
    //         });
    //       }else{
    //         equivBal.push({
    //           "balance":  this.utility.round((lumen_balance * (1/this.rates.USDXLM)),7),
    //           "asset_type": prop.substring(0,3)
    //         });
    //       }
    //   }
    // }

      for (var prop in this.rates) {
        if (prop !== 'timestamp') {
           let currencyPairValue = this.utility.round( (lumen_balance * parseFloat(this.rates[prop].buy)),7);
            equivBal.push({
              "balance": currencyPairValue,
              "asset_type": this.rates[prop].currency
            });
          }
      }



    this.equivalentBalances = equivBal
    console.log(this.equivalentBalances);

  }

  /**
   * resend Authorisation code to user email
   */
  resendAuthCode(){
      let options = {
        'firstname': this.authService.user.details.name,
        'email': this.authService.user.details.email,
        'auth_code': this.authService.getData('email_auth_code'),
        'token': this.authService.getLapiToken(),
        'uuid': this.authService.getUuid()
      };

      this.lapi.resendAuthCode(options)
        .map(res => res.json())
        .subscribe((resp) => {
              console.log(resp);
              this.alertService.basicAlert("Success", resp.content.message.join('. ') ,"Ok");

         },
         (err:any)=>{

              console.log(err.json());
              let errorObj = err.json();
              this.alertService.basicAlert("Error", errorObj.content.message.join('. ') ,"Ok");

        });
  }

  supportChannels(){
    this.navCtrl.push(SupportChannels);
  }

}
