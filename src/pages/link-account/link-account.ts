import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StellarService } from '../../providers/stellar-sdk';
import { LoadingService } from '../../providers/loading-service';
import { AlertService } from '../../providers/alert-service';
import { AuthService } from '../../providers/auth-service';
import { Wallet } from '../wallet/wallet';

@IonicPage()
@Component({
  selector: 'page-link-account',
  templateUrl: 'link-account.html',
})
export class LinkAccount {
	skey:any  = "";
	account:any  =  {};
  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public alertService: AlertService, public authService: AuthService,
  	public loadingService: LoadingService,	public stellarService: StellarService ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LinkAccount');
  }

 	ionViewWillEnter(){

    this.getAccountDetails();
  }

  getAccountDetails(){
  	this.account = this.authService.getAccount();
  }


  doLinking(){

  	if (this.account) {
  		this.alertService.basicAlert("Heads Up!", "You already have an account active. Unable to link account" ,"Ok");
  	} else {
      this.loadingService.showLoader("Linking account...");
  		this.stellarService.linkAccount(this.skey).then((account)=>{
        console.log("account", account);
        this.loadingService.hideLoader();
        if (!account) {
        	this.alertService.basicAlert("Oops!", "Invalid Secret Key" ,"Ok");
        } else {
        	this.account = account;
        	this.alertService.basicAlert("Congrats!", "Account linked successfully" ,"Ok");
          this.navCtrl.setRoot(Wallet);
        }

      })
      .catch((err) => {
        this.loadingService.hideLoader();
      	this.alertService.basicAlert("Oops!", "Invalid Secret Key" ,"Ok");

			});

  	}

  }

}
