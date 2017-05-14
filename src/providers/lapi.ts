import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Api } from './api';
import { AuthService } from './auth-service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Storage } from '@ionic/storage';

/*
  Generated class for the Lapi provider.

  Lapi: Lumania API
  local storage variables
    -account_details
    -rates
*/
@Injectable()
export class Lapi {
	url: string = 'http://localhost:8888/'

  constructor(public http: Http, public authService: AuthService, public api: Api,
    public storage: Storage) {
    console.log('Hello Lapi Provider');
  }

  signUp(accountInfo: any){
  	let seq = this.api.post('signup', accountInfo).share();
  	seq
      .map(res => res.json());

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
    seq.map(res => res.json());

    return seq;
  }

  getNgnRate(){
    let seq = this.api.get('ngn_usd');
    seq
      .map(res => res.json());

    return seq;
  }

  getRates(){
    // get from localstorage
    // if false or timestamp diff > 10mins get from remote
    //store rates locally
    // return promise to get rates

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

      if (!value || timestampDiff > 60000) { 
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

          this.storage.set('rates', resp.content.data);
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

    // let seq = this.api.get('rates');
    // seq
    //   .map(res => res.json())
    //   .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

    // return seq;
  }

}
