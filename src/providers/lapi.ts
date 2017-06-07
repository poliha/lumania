import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Api } from './api';
import { AuthService } from './auth-service';
import { Utility } from './utility';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Storage } from '@ionic/storage';
import { Config } from 'ionic-angular';

/*
  Generated class for the Lapi provider.

  Lapi: Lumania API
  local storage variables
    -account_details_[user_id]
    -rates
*/
@Injectable()
export class Lapi {
	// url: string = 'http://localhost:8888/';
  // url: string = 'http://lumania.tech:8888';
  url: string;

  constructor(public http: Http, public authService: AuthService, public api: Api,
    public storage: Storage, public config: Config, public utility: Utility) {
    this.url = this.config.get('production') ? this.config.get('apiLiveUrl') : this.config.get('apiTestUrl');
    console.log("url",this.url);
    console.log('Hello Lapi Provider');
  }

  signUp(accountInfo: any){
  	let seq = this.api.post('signup', accountInfo).share();
  	seq
      .map(res => res.json());

    return seq;
  }

  saveProfileData(txInfo: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('save/profile', txInfo, options);
    seq.map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    return seq;
  }

  saveTx(txInfo: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('transaction/save', txInfo, options);
    seq.map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    return seq;
  }

  saveBtcTx(txInfo: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('transaction/save_btc', txInfo, options);
    seq.map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    return seq;
  }

  saveEmailTx(txInfo: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('transaction/save_email', txInfo, options);
    seq.map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    return seq;
  }

  saveSellTx(txInfo: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('transaction/save_sell', txInfo, options);
    seq.map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    return seq;
  }



  contactForm(txInfo: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('mail/support', txInfo, options);
    seq.map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    return seq;
  }


  saveWaveTx(txInfo: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('transaction/wave/save', txInfo, options);
    seq.map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    return seq;
  }

  saveAccount(txInfo: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('account/save', txInfo, options);
    seq.map(res => res.json());

    return seq;
  }

  creditLumensAccount(txObj: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('lumens/credit', txObj, options);
    seq.map(res => res.json());

    return seq;
  }

  sellLumens(txObj: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('lumens/sell', txObj, options);
    seq.map(res => res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any

    return seq;
  }

  claimLumens(txObj: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('lumens/claim', txObj, options);
    seq.map(res => res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any

    return seq;
  }

  requestLumens(txObj: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('lumens/request', txObj, options);
    seq.map(res => res.json())
       .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any

    return seq;
  }

  getNgnRate(){
    let seq = this.api.get('ngn_usd');
    seq
      .map(res => res.json());

    return seq;
  }

  resendAuthCode(opts: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('mail/authcode', opts, options);
    seq.map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    return seq;
  }

  verifyPin(opts: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('verify/pin', opts, options);
    seq.map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    return seq;
  }

  changePassword(opts: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('user/changepassword', opts, options);
    seq.map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    return seq;
  }

  changePin(opts: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('user/changepin', opts, options);
    seq.map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    return seq;
  }

  setPin(opts: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('user/setpin', opts, options);
    seq.map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    return seq;
  }

  recoverAccount(opts: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('account/recover', opts, options);
    seq.map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    return seq;
  }

  getBanks(opts: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('banks', opts, options);
    seq.map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    return seq;
  }

  getMasterAccount(opts?: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('tanker', opts, options);
    seq.map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    return seq;
  }


  verifyBankAccount(opts: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('verify/bank', opts, options);
    seq.map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    return seq;
  }

  getNews(opts: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('news', opts, options);
    seq.map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if any
    return seq;
  }


  getRates(){

    return this.storage.ready().then(() => {

      return this.storage.get('rates');

    })
    .then((value)=>{
      console.log(value);
      let timestampDiff = 0;
      if (value) {
        console.log(value);
        let timeInMs = Date.now();
        let rates = value;
        timestampDiff = timeInMs - rates['timestamp'];
        console.log(timestampDiff);
      }

      if (!value || timestampDiff > 600000) { 
        let seq = this.api.get('rates');
        seq
        .map(res => res.json())
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

        return seq;

      } else {
        // return this.storage.get('rates');
      }



    })
    .then((resp)=>{

      console.log(resp);

      if (resp) { 
        resp.map(res => res.json()).subscribe((resp) => {

          console.log(resp);
          let localRates = resp.content.data;
          let tempRatesArray = [];
          for (var prop in localRates) {
             if (prop !== 'timestamp') {
             
           
              if (prop !== 'USDXLM') {

                if (prop === 'NGNXLM') { 
                  let base = parseFloat(localRates[prop])/parseFloat(localRates.USDXLM);
                  let buyValue = this.utility.round((base + (base*0.05)),7);
                  let sellValue = this.utility.round((base - (base*0.05)),7);
                  tempRatesArray.push({
                    "currency": prop.substring(0,3),
                    "buy": buyValue,
                    "sell": sellValue,
                    "base": base
                  });
                } else {
                  // code...
                  let base = parseFloat(localRates[prop])/parseFloat(localRates.USDXLM);
                  let buyValue = this.utility.round((base + (base*0.02)),7);
                  let sellValue = this.utility.round((base - (base*0.02)),7);
                  tempRatesArray.push({
                    "currency": prop.substring(0,3),
                    "buy": buyValue,
                    "sell": sellValue,
                    "base": base
                  });
                }

              }else{
                let base = 1/parseFloat(localRates.USDXLM);
                let buyValue = this.utility.round((base + (base*0.02)),7);
                let sellValue = this.utility.round((base - (base*0.02)),7);
                tempRatesArray.push({
                  "currency": prop.substring(0,3),
                  "buy": buyValue,
                  "sell": sellValue,
                  "base": base
                });
              }
            }
          }
          tempRatesArray['timestamp'] = Date.now();
          this.storage.set('rates', tempRatesArray);



          return this.storage.get('rates');

        }, (err) => {

          // to do add toast
          console.log(err.json());
          // return old data

        });

      } else {
        return this.storage.get('rates');
      }


    });


  }

}
