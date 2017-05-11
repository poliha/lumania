import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

/*
  Generated class for the Utility provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Utility {

  tickerUrl = 'https://api.cryptonator.com/api/ticker/usd-xlm'

  constructor(public http: Http) {
    console.log('Hello Utility Provider');
  }

  randomString(length) {
    
    if (length === 'undefined') {
    	length = 6;
    }

    let text = "";

    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    console.log("random text: ",text);
    return text;
  }

  getTxRef(){
    let timeInMs = Date.now();
    let randomString = this.randomString(8);
    let txRef = timeInMs+randomString;
    return txRef;
  }

  getRate(){
    return this.http.get(this.tickerUrl).share()
      .map(res => res.json())
      .subscribe((resp) => {
          console.log(resp);
      }, (err) => {
          console.log(err);
          // use default
      });
  }

}
