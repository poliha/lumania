import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthService } from './auth-service';
import { Utility } from './utility';
import { StellarService } from './stellar-sdk';
import { LoadingService } from './loading-service';
import { AlertService } from './alert-service';
import { Lapi } from './lapi';
// import { Dashboard } from '../pages/dashboard/dashboard';
// import { initRavePay } from 'cordova-rave';
declare var initRavePay;


/*
  Generated class for the PaymentService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PaymentService {

  // Change before going live
  // raveSecretKey = 'FLWSECK-bb971402072265fb156e90a3578fe5e6-X';
  // raveUrl = 'http://flw-pms-dev.eu-west-1.elasticbeanstalk.com/flwv3-pug/getpaidx/api/verify';
  lumens_amount = 0;
  // var self = this;
  constructor(public http: Http, public authService: AuthService, public lapi: Lapi,
    public alertService: AlertService, public loadingService: LoadingService,
    public utility: Utility, public stellarSdk: StellarService) {
    console.log('Hello PaymentService Provider');
    // self = this;
  }

  raveCheckout(amount, currency, lumens_amount, pin){
  	
    this.lumens_amount = lumens_amount;

    let txRef = this.utility.getTxRef();

  	let options = {
  		"txref": txRef,
  		"amount": amount,
  		"currency": currency,
  		"customer_email": this.authService.user.details.email,
  		"onclose": this.closeRave,
  		"callback": this.raveCallBack
  	};

    let saveObj = {
      "txRef": txRef,
      "amount": amount,
      "currency": currency,
      "rcvr": this.authService.getAccountId(),
      "pin": pin,
      "token": this.authService.getLapiToken(),
      "lumens_amount": lumens_amount,
      "uuid":  this.authService.getUuid(),
      "txType": 1
    };

    // Todo save txref/amount/lumens_amount in  Lapi here
  	this.lapi.saveTx(saveObj)
            .map(res => res.json())
            .subscribe((resp) => {
              console.log(resp);

              // get payment from user
              return initRavePay(options);

            }, (err) => {
              // to do add toast
              console.log(err.json());
              let errorObj = err.json();
              this.alertService.basicAlert("Error", errorObj.content.message.join('. ') ,"Ok");

            });


  }



  btcCheckout(amount, currency, lumens_amount, pin){
    
    this.lumens_amount = lumens_amount;

    let txRef = this.utility.getTxRef();
    let  respObj: any;
    let  errorObj: any;
    let saveObj = {
      "txRef": txRef,
      "amount": amount,
      "currency": currency,
      "pin": pin,
      "rcvr": this.authService.getAccountId(),
      "token": this.authService.getLapiToken(),
      "lumens_amount": lumens_amount,
      "uuid":  this.authService.getUuid(),
      "txType": 1
    };

    return new Promise((resolve, reject) => {


    // Todo save txref/amount/lumens_amount in  Lapi here
      this.lapi.saveBtcTx(saveObj)
            .map(res => res.json())
            .subscribe((resp) => {
              console.log(resp);
              resolve(resp);
            }, (err) => {
              console.log(err.json());
                reject(err.json());
            });

    });

  }


  closeRave(){
  	//
  	console.log("rave closed");
  }

  raveCallBack = (response) =>{
    console.log("in callback");
    console.log(response);
    // close popoup
    // this.closeRave();
    if (response.tx && (response.tx.vbvrespcode === '00' || response.tx.vbvrespcode === '0')) {
      // show loading
      this.loadingService.showLoader("Processing payment...");
      //create account and send notification if no account


      this.stellarSdk.createAccount().then((account)=>{
        console.log("account", account);
        if (account) { 
          return this.requestLumens(response.tx.txRef,response.tx.flwRef, account.account_id, response.tx.amount);
        } else {
          this.loadingService.hideLoader();
          this.alertService.basicAlert("Error", "Account not found on device" ,"Ok");
        }

      });


    } else {
      if (response.respmsg) {
        this.loadingService.showLoader(response.respmsg, 5000);
      } else {
        this.loadingService.showLoader(response.data.data.message, 5000);
      }

    }

  }

  requestLumens(txRef, flwRef, accountId, amount){
    let body = {
        "txRef": txRef,
        "flwRef": flwRef,
        "token": this.authService.getLapiToken(),
        "uuid":  this.authService.getUuid(),
        "accountId": accountId,
        "amount": amount,
        "email": this.authService.user.details.email
      }
    // pass account to lapi for crediting
    this.lapi.creditLumensAccount(body)
            .map(res => res.json())
            .subscribe((resp) => {
              console.log(resp);
              this.loadingService.hideLoader();
              this.alertService.basicAlert("Success", this.lumens_amount+"XLM added to account" ,"Ok");
            }, (err) => {
              // to do add toast
              console.log(err);
              this.loadingService.hideLoader();
              this.alertService.basicAlert("Request Saved", "Your request will be automatically processed shortly" ,"Ok");

            });

  }

  sellLumens(fiatAmount, xlmAmount, currency, currentRate, currentAccount, pin){

    // verify if currency is supported
    // if surported save tx in lapi
    // if tx saved return lumania account id and memotext
    // send lumania amounts in lumens with memo
    // connect to lapi with tx hash
    // if tx hash is correct and tx complete  withdraw funds 
    // return success or failure or pending



    this.loadingService.showLoader("Processing...");
    let body = {
        "fiatAmount": fiatAmount,
        "xlmAmount": xlmAmount,
        "currency": currency,
        "pin": pin,
        "currentRate": currentRate,
        "accountId": currentAccount,
        "token": this.authService.getLapiToken(),
        "uuid":  this.authService.getUuid(),
        "email": this.authService.user.details.email,
        "name": this.authService.user.details.name,
        "tx_hash": "",
        "tx_id": ""
      };

      this.lapi.saveSellTx(body)
          .map(res => res.json())
          .subscribe((resp) => {
            console.log(resp);
            let respObj = resp.content.data;
            body.tx_id = respObj.tx_id;
            // send lumens to Lumania
            this.stellarSdk.sendLumens(respObj.lumania_account, xlmAmount, respObj.memo_text).then((result)=>{

                body.tx_hash = result.hash;
                // send tx hash to lumania for verification and withdrawal
                this.lapi.sellLumens(body)
                    .map(res => res.json())
                    .subscribe((resp) => {
                      console.log(resp);
                      this.loadingService.hideLoader();
                      this.alertService.basicAlert("Success", xlmAmount+"XLM sold" ,"Ok");
                    }, (err) => {
                      // to do add toast
                      console.log(err);
                      this.loadingService.hideLoader();
                      this.alertService.basicAlert("Request Saved", "Your request will be automatically processed shortly" ,"Ok");

                    });

            })
            .catch((err)=>{

                      console.log(err);
                      this.loadingService.hideLoader();
            });



          }, (err) => {

            // could not save sell request, unsupported currency or sales error
            console.log(err);
            let errorObj = err.json();
            this.loadingService.hideLoader();
            this.alertService.basicAlert("Request Error", errorObj.content.message.join('. ') ,"Ok");

          });






  }

}
