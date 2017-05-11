import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthService } from './auth-service';
import { Utility } from './utility';
import { LoadingService } from './loading-service';
import { Lapi } from './lapi';
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
  raveSecretKey = 'FLWSECK-bb971402072265fb156e90a3578fe5e6-X';
  raveUrl = 'http://flw-pms-dev.eu-west-1.elasticbeanstalk.com/flwv3-pug/getpaidx/api/verify';
  // var self = this;
  constructor(public http: Http, public authService: AuthService, public lapi: Lapi
  public loadingService: LoadingService, public utility: Utility) {
    console.log('Hello PaymentService Provider');
    // self = this;
  }

  raveCheckout(amount, currency, lumens_amount){
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
      "token": this.authService.getLapiToken(),
      "lumens_amount": lumens_amount,
      "uuid":  this.authService.getUuid()
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
              console.log(err);
              alert(err);

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
    if (response.tx && (response.respcode === '00' || response.respcode === '0')) { 
      // show loading
      this.loadingService.showLoader("Processing payment...");
      //create account and send notification
      // move verification to server
      // request lumens there
      return this.requestLumens(response.tx.txref,response.tx.flwRef);
      //verify payment from flutterwave
      // let body = {
      //   "SECKEY": this.raveSecretKey,
      //   "flw_ref": 'response.tx.flwRef'
      // }

      // this.http.post(this.raveUrl, body).share()
      //     .map(res => res.json())
      //     .subscribe((resp) => {
      //         console.log(resp);
      //         this.loadingService.hideLoader();
      //         // request Lumens from Lumania
      //         // return this.requestLumens(txref, flwRef)


      //       }, (err) => {

      //         console.log(err);
      //         this.loadingService.hideLoader();
      //         this.loadingService.showLoader(err.json().status+": "+err.json().message, 5000);

      //         // alert(err);

      //       });

    } else {
      if (response.respmsg) { 
        this.loadingService.showLoader(response.respmsg, 5000);
      } else {
        this.loadingService.showLoader(response.data.data.message, 5000);
      }
      
    }

  }
  
  requestLumens(txRef, flwRef){
     let body = {
        "txRef": txRef,
        "flwRef": flwRef,
        "token": this.authService.getLapiToken(),
        "uuid":  this.authService.getUuid()
      }
    // pass account to lapi for crediting
    this.lapi.creditLumensAcct(body)
            .map(res => res.json())
            .subscribe((resp) => {
              console.log(resp);
              this.loadingService.hideLoader();
              // get payment from user
              // return initRavePay(options);

            }, (err) => {
              // to do add toast
              console.log(err);
              this.loadingService.hideLoader();
              
              // alert(err);

            });

  }

}
