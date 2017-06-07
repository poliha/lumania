import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Lapi } from '../../providers/lapi';
import { AuthService } from '../../providers/auth-service';
import { AlertService } from '../../providers/alert-service';
import { StellarService } from '../../providers/stellar-sdk';
import { LoadingService } from '../../providers/loading-service';
import { Wallet } from '../wallet/wallet';

@IonicPage()
@Component({
  selector: 'page-claim-lumens',
  templateUrl: 'claim-lumens.html',
})
export class ClaimLumensPage {
	claim_code: any;
	messages = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public lapi: Lapi,
    public loadingService: LoadingService, public authService: AuthService, 
    public alertService: AlertService, public stellarSdk: StellarService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClaimLumensPage');
  }

  claimLumens(){
    this.loadingService.showLoader("Processing claim...");
  	let options = {
  			'claim_code': this.claim_code,
  			'email': this.authService.user.details.email,
  			'account_id': "",
  			'token': this.authService.getLapiToken(),
  			'uuid': this.authService.getUuid()
  		};

  		// get account details
      this.stellarSdk.createAccount().then((account)=>{
        console.log("account", account);

        if (account) { 
        	options.account_id = account.account_id;

	        this.lapi.claimLumens(options)
	        .map(res => res.json())
	        .subscribe((resp) => {
	              console.log(resp);
                this.loadingService.hideLoader();
	              this.alertService.basicAlert("Success", resp.content.message.join('. ') ,"Ok");
                this.navCtrl.setRoot(Wallet);

	         },
	         (err:any)=>{
           this.loadingService.hideLoader();
            console.log(err.json());
            let errorObj = err.json();
            this.alertService.basicAlert("Error", errorObj.content.message.join('. ') ,"Ok");

	        });

        } else {
          this.loadingService.hideLoader();
        	this.messages.push("Account details not found on device. Please recover your account");

        }




      });

  		
  }
}
