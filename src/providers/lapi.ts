import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


/*
  Generated class for the Lapi provider.

  Lapi: Lumania API
*/
@Injectable()
export class Lapi {
	url: string = 'http://localhost:8888/'

  constructor(public http: Http, public api: Api) {
    console.log('Hello Lapi Provider');
  }

  signUp(accountInfo: any){
  	let seq = this.api.post('signup', accountInfo).share();
  	seq
      .map(res => res.json());

    return seq;
  }
}
