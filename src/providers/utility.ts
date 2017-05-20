import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import forge from 'node-forge';
import math from 'mathjs';


/*
  Generated class for the Utility provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Utility {

  tickerUrl = 'https://api.cryptonator.com/api/ticker/usd-xlm'
  forge: any;
  constructor(public http: Http, ) {
    console.log('Hello Utility Provider');
    this.forge = forge;
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

  round(value, decimals) {
    return math.round(value, decimals); 
    // return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
  }

  getTxRef(){
    let timeInMs = Date.now();
    let randomString = this.randomString(8);
    let txRef = timeInMs+randomString;
    return txRef;
  }

  getRates(){
    return this.http.get(this.tickerUrl).share()
      .map(res => res.json());
  }

  encrypt(password, plainText){

    let numIteration = 4096;
    let salt = this.forge.random.getBytesSync(128);
    let key = this.forge.pkcs5.pbkdf2(password, salt, numIteration, 16);
    let iv = this.forge.random.getBytesSync(16);
    let cipher = this.forge.cipher.createCipher('AES-CBC', key);
    cipher.start({iv: iv});
    cipher.update(this.forge.util.createBuffer(plainText));
    cipher.finish();
    let cipherText = this.forge.util.encode64(cipher.output.getBytes());
    let rtnObj = {
        text: cipherText,
        salt: this.forge.util.encode64(salt),
        iv:  this.forge.util.encode64(iv)
    };

    return rtnObj;

  }

  decrypt(cipherObj, password){

    let numIteration = 4096;
    let salt = this.forge.util.decode64(cipherObj.salt);
    let iv = this.forge.util.decode64(cipherObj.iv);
    let key = this.forge.pkcs5.pbkdf2(password, salt, numIteration, 16);
    let decipher = this.forge.cipher.createDecipher('AES-CBC', key);
    decipher.start({iv: iv});
    decipher.update(this.forge.util.createBuffer(this.forge.util.decode64(cipherObj.text)));
    decipher.finish();
    let decipheredText = decipher.output.toString();

    return decipheredText;

  }



}
