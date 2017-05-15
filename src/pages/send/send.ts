import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PaymentService } from '../../providers/payment-service';
import { AuthService } from '../../providers/auth-service';
import { Lapi } from '../../providers/lapi';
import { LoadingService } from '../../providers/loading-service';

import { StellarService } from '../../providers/stellar-sdk';
import { AlertService } from '../../providers/alert-service';

/**
 * Generated class for the Send page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-send',
  templateUrl: 'send.html',
})
export class Send {
	
	balances: any = [];
  currentAccountId: any = false;
  xlmAmount = 0.00;
  destAcct: any = "";
  currentBalance = 0.00;
  displayBalance = 0.00;
  currency = 'XLM';

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingService: LoadingService,
  	public lapi: Lapi, 	public paymentService: PaymentService,public alertService: AlertService, 
  	public stellarService: StellarService, public authService: AuthService
  ) {

    this.currentAccountId = this.authService.getAccountId();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Send');
  }

	ionViewWillEnter(){
    console.log('getting balance');

    this.getBalance();

  }


  getBalance(){

    if (this.currentAccountId) {
      this.stellarService.getBalance(this.currentAccountId)
        .then((account)=>{

          this.balances = account.balances;
          this.currentBalance = this.balances[0].balance;
          this.displayBalance = this.balances[0].balance;
        })
        .catch((error)=>{

          console.log(error);
        })
    } else {
       this.balances = [{
        "balance": "0.00",
        "asset_type": "native"
      }];

    }
  }

  calculateXLM(value){

    this.displayBalance = this.currentBalance - value;

  }

  send(){
  	this.loadingService.showLoader("Sending...");
  	if ((this.xlmAmount - 20) >= parseFloat(this.balances[0].balance)) { 
  		this.stellarService.sendLumens(this.destAcct, this.xlmAmount)
  		.then((result)=>{
        
        this.loadingService.hideLoader();
        this.alertService.basicAlert("Success", this.xlmAmount+"XLM sent" ,"Ok");
        
    	});


  	} else {
  		this.loadingService.hideLoader();
  		this.alertService.basicAlert("Insufficent Balance", "Your XLM balance must be at least 20XLM after sending" ,"Ok");
  	}

  	
  }

}
