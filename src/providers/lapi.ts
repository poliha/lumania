import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Api } from './api';
import { AuthService } from '../../providers/auth-service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


/*
  Generated class for the Lapi provider.

  Lapi: Lumania API
*/
@Injectable()
export class Lapi {
	url: string = 'http://localhost:8888/'

  constructor(public http: Http, public authService: AuthService, public api: Api) {
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
    seq.map(res => res.json());

    return seq;
  }

  creditLumensAccount(txObj: any){
    // add authorization header with jwt token
    let headers = new Headers({ 'Authorization': 'Bearer ' + this.authService.getLapiToken() });
    let options = new RequestOptions({ headers: headers });

    let seq = this.api.post('lumens/credit/', txObj, options);
    seq.map(res => res.json());

    return seq;
  }

  getNgnRate(){
    let seq = this.api.get('ngn_usd').share();
    seq
      .map(res => res.json());

    return seq;
  }

}
