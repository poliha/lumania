import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utility } from '../../providers/utility';
import { Lapi } from '../../providers/lapi';
import { LoadingService } from '../../providers/loading-service';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { ToastService } from '../../providers/toast-service';



@IonicPage()
@Component({
  selector: 'page-bank-details',
  templateUrl: 'bank-details.html',

})
export class BankDetails {
	account_number: any = "";
	bank_code: any = "";
	bank_list: any = {};
	bank_details: any = {
    "bank_code": "",
    "bank_name": "",
    "account_number": "",
    "account_name": ""
  };
	account_name: any = "";
	isset_bank = false;
  bankListArray = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
    public utility: Utility,  public lapi: Lapi, public loadingService: LoadingService, 
    public toastService: ToastService, public authService: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BankDetails');
  }

  ionViewWillEnter(){
    console.log('getting banks');
    this.getBanks();
    if (this.authService.getData('bank_details')) { 
      this.bank_details = this.authService.getData('bank_details');
      this.isset_bank = true
    } else {

    }

  }

  getBanks(){
    this.loadingService.showLoader("Loading banks...");
		let body = {
        "token": this.authService.getLapiToken(),
        "uuid":  this.authService.getUuid(),
      }

    this.lapi.getBanks(body)
            .map(res => res.json())
            .subscribe((resp) => {
              console.log(resp);
              this.loadingService.hideLoader();
              this.bank_list = resp.content.data;
              this.processBankList();

            }, (err) => {
              // to do add toast
              console.log(err);
              this.loadingService.hideLoader();

            });
  }

  processBankList(){
    for (var prop in this.bank_list) {

      this.bankListArray.push({
        "bank_code": prop,
        "bank_name": this.bank_list[prop]
      });
      // this.bankListArray[prop] = this.bank_list[prop];

    }
  }

  verifyBankAccount(){
    this.loadingService.showLoader("Loading...");
		let body = {
        "token": this.authService.getLapiToken(),
        "uuid":  this.authService.getUuid(),
        "account_number": this.account_number,
        "bank_code": this.bank_code
      }

    this.lapi.verifyBankAccount(body)
            .map(res => res.json())
            .subscribe((resp) => {
              console.log(resp);
              this.loadingService.hideLoader();
              this.account_name = resp.content.data.account_name;

            }, (err) => {
              // to do add toast
              console.log(err);
              this.loadingService.hideLoader();

            });


  }

  saveAccount(){
    this.loadingService.showLoader("Saving...");

		let body = {
        "bank_code": this.bank_code,
        "bank_name": this.bank_list[this.bank_code],
        "account_number": this.account_number,
        "account_name": this.account_name
      }
      this.bank_details = body;
      console.log(this.bank_details);
    this.storage.set('bank_details', body);
    this.authService.saveData('bank_details', body)
    		.then(()=>{

    			this.loadingService.hideLoader();
    			this.toastService.showToast("Bank details saved");
          this.isset_bank = true;

    		});

  }

  editBank(){
    this.isset_bank = false;
    this.account_number = this.bank_details.account_number;
    this.bank_code = this.bank_details.bank_code;
    this.account_name = this.bank_details.account_name;
  }

}
