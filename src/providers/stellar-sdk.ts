import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from 'ionic-angular';

import { Utility } from './utility';
import { AuthService } from './auth-service';
import { Lapi } from './lapi';
import { Storage } from '@ionic/storage';
import { AlertService } from './alert-service';
// declare var LumSetup;
// let StellarSdk = require('stellar-sdk')
// import StellarSdk from 'stellar-sdk';
// console.dir(StellarSdk);

declare var StellarSdk: any;
/*
  Generated class for the StellarSdk provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class StellarService {
  server: any;
  constructor(public http: Http, public utility: Utility, public alertService: AlertService,
  	public authService: AuthService, public storage: Storage, public lapi: Lapi, 
    public config: Config) {
    console.log('Hello StellarSdk Provider');
    if ( config.get('production')) {
        StellarSdk.Network.usePublicNetwork();
        this.server = new StellarSdk.Server(config.get('stellarLiveNetwork'));
      }

    if ( !config.get('production')) {
      StellarSdk.Network.useTestNetwork();
      this.server = new StellarSdk.Server(config.get('stellarTestNetwork'));
    }
  }


  createAccount(){

    let messages = [];
  	let uuid = this.authService.getUuid();
  	// generate keypair
  	let keypair = StellarSdk.Keypair.random();
  	// encrypt secret for device
  	let localCipherText = this.utility.encrypt(uuid, keypair.secret());

  	let recoveryCodeArray = [];

  	for (let i = 0; i < 6; ++i) {
  		recoveryCodeArray.push(this.utility.randomString(6));
  	}

  	let recoveryCodeText = recoveryCodeArray.join(' ');

  	// encrypt secret for server
  	let serverCipherText = this.utility.encrypt(recoveryCodeText, keypair.secret());

  	let localAccountDetails = {
  		'account_id' : keypair.publicKey(),
  		'seed_obj': localCipherText
  	}

  	let serverAccountDetails = {
  		'account_id' : keypair.publicKey(),
  		'seed_obj': serverCipherText,
  		'token': this.authService.getLapiToken(),
  		'uuid': uuid,
      'recovery_code': recoveryCodeText,
      'email': this.authService.user.details.email,
      'name': this.authService.user.details.name
  	}

  	// save  account id on phone
  	// save  account id on ionic service
  	// save  account id on Lapi and notify user of recovery code
  	return this.storage.ready().then(() => {
       // set a key/value
       this.storage.set('account_details', localAccountDetails);

       return this.authService.saveData('account', localAccountDetails);

    })
    .then(()=>{
      console.log("saving account data");
    	this.lapi.saveAccount(serverAccountDetails)
        .map(res => res.json())
        .subscribe((resp) => {
              console.log(resp);

              return true;
            }, (err) => {
              // to do add toast
              console.log(err.json());
              let errorObj = err.json();
              messages.push(errorObj.content.message[0]);
              throw new Error("not saved");
              // this.alertService.basicAlert("Error", errorObj.content.message[0] ,"Ok");

            });
    }, (err) => {
    	console.log(err);
    })
    .then(()=>{
    	// console.log(resp);
    	return this.storage.get('account_details');
    }, (err) => {
    	// lapitoken error
    	console.log(err);
    })
    .catch((error) => {
      this.alertService.basicAlert("Error", messages[0] ,"Ok");
    });

  }

  getBalance(accountId){
   return this.server.accounts().accountId(accountId ).call();

  }

}
