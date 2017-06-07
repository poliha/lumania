import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StellarService } from '../../providers/stellar-sdk';
import { LoadingService } from '../../providers/loading-service';
import { AlertService } from '../../providers/alert-service';
import { AuthService } from '../../providers/auth-service';
import { Wallet } from '../wallet/wallet';

@IonicPage()
@Component({
  selector: 'page-transfer-lumens',
  templateUrl: 'transfer-lumens.html',
})
export class TransferLumensPage {
	skey:any;
	xlmAmount:any;
	account:any  =  {};
  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public alertService: AlertService, public authService: AuthService,
  	public loadingService: LoadingService,	public stellarService: StellarService ) {
  }

 	ionViewWillEnter(){

    this.getAccountDetails();
  }

  getAccountDetails(){
  	this.account = this.authService.getAccount();
  }

  /**
   * Transfer funds to your stellar account on Lumania
   */
  doTransfer(){
  	let valid_secret = this.stellarService.validateSecretKey(this.skey);

  	if (!valid_secret) {
  		this.alertService.basicAlert("Heads Up!", "Invalid Secret Key" ,"Ok");
  	} else {
      this.loadingService.showLoader("Transferring Lumens...");
  		this.stellarService.createAccount().then((account)=>{
        console.log("account", account);
        if (!account) {
        	this.loadingService.hideLoader();
        	this.alertService.basicAlert("Oops!", "Account details no found on device. You will be unable to perform any transactions. Please recover your account" ,"Ok");
        } else {

        	this.account = account;
        	return this.stellarService.transferLumens(this.skey, this.account.account_id, this.xlmAmount);

        }

      })
      .catch((err) => {
        this.loadingService.hideLoader();
      	this.alertService.basicAlert("Oops!", err.message.join('. ') ,"Ok");

			})
			.then((response)=>{
        console.log("response", response);
        this.loadingService.hideLoader();

        	this.alertService.basicAlert("Congrats!", "Transaction successful","Ok");
          this.navCtrl.setRoot(Wallet);


      })
      .catch((err) => {
        this.loadingService.hideLoader();
      	this.alertService.basicAlert("Oops!", err.message.join('. ') ,"Ok");

			});

  	}

  }

}
