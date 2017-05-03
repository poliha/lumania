import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

/*
  Generated class for the Utility provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Utility {

  constructor() {
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

}
