import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from 'ionic-angular';
import { Utility } from './utility';
import { AuthService } from './auth-service';
import { Lapi } from './lapi';
import { Storage } from '@ionic/storage';
import { AlertService } from './alert-service';

declare var StellarSdk: any;

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

    if (this.authService.getData('account_details')) {
      return this.storage.get('account_details');
    } else {


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

         let deviceAcct = {"account_id": localAccountDetails.account_id};
         return this.authService.saveData('account', deviceAcct);

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
        this.alertService.basicAlert("Error", messages.join('. ') ,"Ok");
      });

    }

  }

  validateSecretKey(skey){
    try{
          // generate keypair
      let keypair = StellarSdk.Keypair.fromSecret(skey);
      return keypair;
    }catch(error){
      return false;
    }

  }

  linkAccount(skey){

    let messages = [];
    let uuid = this.authService.getUuid();
    let keypair = this.validateSecretKey(skey);

    if (!keypair) {
      return new Promise<void>((resolve, reject) => {
        reject(new Error("Something awful happened"));
      });
    } else {



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

      let deviceAcct = {"account_id": localAccountDetails.account_id};
      return this.authService.saveData('account', deviceAcct);


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
      this.alertService.basicAlert("Error", messages.join('. ') ,"Ok");
    });
   }
  }

  linkRecoveredAccount(rcvrObj, password){

    let messages = [];
    let uuid = this.authService.getUuid();
    // decrypt account
    // store on local device
    // store account id in cloud
    let skey = this.utility.decrypt(rcvrObj, password);

    let keypair = this.validateSecretKey(skey);

    if (!keypair) {
      return new Promise<void>((resolve, reject) => {
        reject(new Error("Something awful happened"));
      });
    } else {



    // encrypt secret for device
    let localCipherText = this.utility.encrypt(uuid, keypair.secret());

    // let recoveryCodeArray = [];

    // for (let i = 0; i < 6; ++i) {
    //   recoveryCodeArray.push(this.utility.randomString(6));
    // }

    // let recoveryCodeText = recoveryCodeArray.join(' ');

    // encrypt secret for server
    // let serverCipherText = this.utility.encrypt(recoveryCodeText, keypair.secret());

    let localAccountDetails = {
      'account_id' : keypair.publicKey(),
      'seed_obj': localCipherText
    }

    // let serverAccountDetails = {
    //   'account_id' : keypair.publicKey(),
    //   'seed_obj': serverCipherText,
    //   'token': this.authService.getLapiToken(),
    //   'uuid': uuid,
    //   'recovery_code': recoveryCodeText,
    //   'email': this.authService.user.details.email,
    //   'name': this.authService.user.details.name
    // }

    // save  account id on phone
    // save  account id on ionic service
    // save  account id on Lapi and notify user of recovery code
    return this.storage.ready().then(() => {
       // set a key/value
      this.storage.set('account_details', localAccountDetails);

      let deviceAcct = {"account_id": localAccountDetails.account_id};
      return this.authService.saveData('account', deviceAcct);


    })
    .then(()=>{
      // console.log(resp);
      return this.storage.get('account_details');
    }, (err) => {
      // lapitoken error
      console.log(err);
    })
    .catch((error) => {
      this.alertService.basicAlert("Error", messages.join('. ') ,"Ok");
    });
   }
  }


  getBalance(accountId){
   return this.server.accounts().accountId(accountId ).call();

  }

  sendLumens(destAcct, amountToSend){

    let messages = [];
    let uuid = this.authService.getUuid();
    let stellarAccount = {};
    let skey = "";
    let destAcctActive = 0;
    let senderKeypair: any;
    let asset = this.generateAsset(0);

    //get account details
   return this.storage.ready().then(() => {
       // set a key/value
       this.storage.set('trials', 1);

      return this.storage.get('account_details');
    })
    .then((account) => {
      stellarAccount = account;
      // decrypt secret
      skey = this.utility.decrypt(account, uuid);
      senderKeypair = StellarSdk.Keypair.fromSecret(skey);

      // load dest acct
      return this.server.loadAccount(destAcct);
    })
    .catch((error) =>{
      if (error.status == 404 || error.status == '404') {
        // unable to load dest account
        // messages.push(' Account not active');
        console.error('Destination Account not active');
        destAcctActive = 0;
      }

    })
    .then((receiver) => {
      console.log("receiver: ", receiver);
      if (receiver) {
        console.log("its active oo");
        destAcctActive = 1;

      }
      // load source acct
      return this.server.loadAccount(senderKeypair.publicKey());
    })
    .catch((error) => {
      if (error.status == 404 || error.status == '404') {
        // unable to load source account
        messages.push('Source Account not active');
        console.error('Something went wrong! The source account does not exist!');
        throw new Error('The source account does not exist!');
      }


    })
    .then((sender) => {
      // build a transaction based on if dest was found or not
      let transaction: any;
      if (destAcctActive == 1) {
      transaction = new StellarSdk.TransactionBuilder(sender)
                        .addOperation(StellarSdk.Operation.payment({
                          destination: destAcct,
                          asset: asset,
                          amount: amountToSend.toString()
                        }))
                        .build();
      }
      if (destAcctActive === 0) {
        transaction = new StellarSdk.TransactionBuilder(sender)
                          .addOperation(StellarSdk.Operation.createAccount({
                            destination: destAcct,
                            startingBalance: amountToSend.toString()
                          }))
                          .build();
      }

      // sign transaction
      transaction.sign(senderKeypair);

      return this.server.submitTransaction(transaction);

    })
    .catch((error) => {
      console.error('Something went wrong at the end\n', error);
      messages.push('Transaction not complete');

      this.alertService.basicAlert("Error", messages.join('. ') ,"Ok");
    });

  }

  sendLumensViaFederation(destAcct, amountToSend){

    let messages = [];
    let uuid = this.authService.getUuid();
    let stellarAccount = {};
    let rcvrAcct: any = {};
    let skey = "";
    let destAcctActive = 0;
    let senderKeypair: any;
    let asset = this.generateAsset(0);
    // get account id from federation

    //get account details
   return this.storage.ready().then(() => {
      return this.storage.get('account_details');
    })
    .then((account) => {
      stellarAccount = account;
      // decrypt secret
      skey = this.utility.decrypt(account, uuid);
      senderKeypair = StellarSdk.Keypair.fromSecret(skey);

      // load dest acct
      return StellarSdk.FederationServer.resolve(destAcct);
    })
    .catch((error) => {
        console.log("Error",error);
        messages.push('Unable to load federated account');
        // console.error('Something went wrong! The source account does not exist!');
        throw new Error('The source account does not exist!');
      })
    .then(function(acctDetails) {
        console.log("acctDetails", acctDetails);
        rcvrAcct = acctDetails;
        return this.server.loadAccount(acctDetails.account_id);
     })
    .catch((error) =>{
      if (error.status == 404 || error.status == '404') {
        // unable to load dest account
        // messages.push(' Account not active');
        console.error('Destination Account not active');
        destAcctActive = 0;
      }else{
        throw new Error('The source account does not exist!');
      }

    })
    .then((receiver) => {
      console.log("receiver: ", receiver);
      if (receiver) {
        console.log("its active oo");
        destAcctActive = 1;

      }
      // load source acct
      return this.server.loadAccount(senderKeypair.publicKey());
    })
    .catch((error) => {
      if (error.status == 404 || error.status == '404') {
        // unable to load source account
        messages.push('Source Account not active');
        console.error('Something went wrong! The source account does not exist!');
        throw new Error('The source account does not exist!');
      }else{
        throw new Error('The source account does not exist!');
      }


    })
    .then((sender) => {
      // build a transaction based on if dest was found or not
      let transaction: any;
      if (destAcctActive == 1) {
      transaction = new StellarSdk.TransactionBuilder(sender)
                        .addOperation(StellarSdk.Operation.payment({
                          destination: rcvrAcct.account_id,
                          asset: asset,
                          amount: amountToSend.toString()
                        }))
                        .build();
      }
      if (destAcctActive === 0) {
        transaction = new StellarSdk.TransactionBuilder(sender)
                          .addOperation(StellarSdk.Operation.createAccount({
                            destination: rcvrAcct.account_id,
                            startingBalance: amountToSend.toString()
                          }))
                          .build();
      }

      // sign transaction
      transaction.sign(senderKeypair);

      return this.server.submitTransaction(transaction);

    })
    .catch((error) => {
      console.error('Something went wrong at the end\n', error);
      messages.push('Transaction not complete');

      this.alertService.basicAlert("Error", messages.join('. ') ,"Ok");
    });

  }

  sendLumensViaEmail(destAcct, amountToSend, pin){
    // check for email in Lumania federation
    // if exists get account id and send
    //  if not exists, send lumens to Lumania with memo text id
    //  save tx in lumania db
    //  send email tx


    let messages = [];
    let uuid = this.authService.getUuid();
    let stellarAccount = {};
    let rcvrAcct: any = {};
    let masterAccount = "";
    let skey = "";
    let destAcctActive = 0;
    let senderKeypair: any;
    let asset = this.generateAsset(0);
    let memoText = this.utility.randomString(6);
    // get account id from federation

    //get account details
   return this.storage.ready().then(() => {
      return this.storage.get('account_details');
    })
    .then((account) => {
      stellarAccount = account;
      // decrypt secret
      skey = this.utility.decrypt(account, uuid);
      senderKeypair = StellarSdk.Keypair.fromSecret(skey);

      // load dest acct
      return StellarSdk.FederationServer.resolve(destAcct+'*'+'lumania.tech');
    })
    .catch((error) => {
        console.log("Error",error);
        // messages.push('Unable to load federated account');
        // console.error('Something went wrong! The source account does not exist!');
        // throw new Error('The source account does not exist!');
      })
    .then(function(acctDetails) {
        console.log("acctDetails", acctDetails);
        rcvrAcct = acctDetails;
        return this.server.loadAccount(acctDetails.account_id);
     })
    .catch((error) =>{
      if (error.status == 404 || error.status == '404') {
        // unable to load dest account
        // messages.push(' Account not active');
        console.error('Destination Account not active');
        destAcctActive = 0;
      }

    })
    .then((receiver) => {
      console.log("receiver: ", receiver);
      if (receiver) {
        console.log("its active oo");
        destAcctActive = 1;

      }
      // load source acct
      return this.server.loadAccount(senderKeypair.publicKey());
    })
    .catch((error) => {
      if (error.status == 404 || error.status == '404') {
        // unable to load source account
        messages.push('Source Account not active');
        console.error('Something went wrong! The source account does not exist!');
        throw new Error('The source account does not exist!');
      }else{
        throw new Error('The source account does not exist!');
      }


    })
    .then((sender) => {
      // build a transaction based on if dest was found or not
      let transaction: any;
      if (destAcctActive == 1) {
      transaction = new StellarSdk.TransactionBuilder(sender)
                        .addOperation(StellarSdk.Operation.payment({
                          destination: rcvrAcct.account_id,
                          asset: asset,
                          amount: amountToSend.toString()
                        }))
                        .build();
      }
      if (destAcctActive === 0) {
       
        // send to lumania with memo id
        this.lapi.getMasterAccount()
          .map(res => res.json())
            .subscribe((resp) => {
                  console.log(resp);
                  masterAccount = resp.data.account_id
                          transaction = new StellarSdk.TransactionBuilder(sender)
                          .addOperation(StellarSdk.Operation.payment({
                          destination: masterAccount,
                          asset: asset,
                          amount: amountToSend.toString()
                        }))
                          .addMemo(StellarSdk.Memo.text(memoText))
                          .build();
                }, (err) => {
                  // to do add toast
                  console.log(err);
                  // let errorObj = err.json();
                  // messages.push(errorObj.content.message[0]);
                  // throw new Error("not saved");
                  // this.alertService.basicAlert("Error", errorObj.content.message[0] ,"Ok");

                });



      }

      // sign transaction
      transaction.sign(senderKeypair);

      return this.server.submitTransaction(transaction);

    })
    .then((result)=>{
      // save tx in lumania
      // send email
      let txDetails = {
        "token": this.authService.getLapiToken(),
        "uuid":  this.authService.getUuid(),
        "amount": amountToSend,
        "rcvr": destAcct,
        "memo": memoText,
        "pin": pin
      };

      this.lapi.saveEmailTx(txDetails)
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


    })
    .catch((error) => {
      console.error('Something went wrong at the end\n', error);
      messages.push('Transaction not complete');

      this.alertService.basicAlert("Error", messages.join('. ') ,"Ok");
    });



  }

  generateAsset(type,code?: any,issuer?: any) {
    if (type === 'undefined') {
      return false;
    }

    if (code === 'undefined') {
      code = "";
    }

    if (issuer === 'undefined') {
      issuer = "";
    }

    if (type == 0) {
      return StellarSdk.Asset.native();
    }else{
      var asset = "";
      try{
        asset =  new StellarSdk.Asset(code, issuer);
        return asset;
      }
      catch(error){
        return false;
      }

    }
  }



}
