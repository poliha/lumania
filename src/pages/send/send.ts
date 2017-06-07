import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';
import { PaymentService } from '../../providers/payment-service';
import { AuthService } from '../../providers/auth-service';
import { Lapi } from '../../providers/lapi';
import { Utility } from '../../providers/utility';
import { LoadingService } from '../../providers/loading-service';
import { ContactService } from '../../providers/contact-service';
import { StellarService } from '../../providers/stellar-sdk';
import { AlertService } from '../../providers/alert-service';
import { ChangePin } from '../change-pin/change-pin';
import { Wallet } from '../wallet/wallet';

@IonicPage()
@Component({
  selector: 'page-send',
  templateUrl: 'send.html',
})
export class Send {
	
	balances: any = [];
  currentAccountId: any = false;
  xlmAmount: any;
  destAcct: any = "";
  currentBalance = 0.00;
  displayBalance = 0.00;
  currency = 'XLM';
  pin: any = "";
  address_type = 0;
  contactList = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public loadingService: LoadingService, public lapi: Lapi, public paymentService: PaymentService,
    public alertService: AlertService, public stellarService: StellarService, 
    public contactService: ContactService, public authService: AuthService, 
    public utility: Utility, public alertCtrl: AlertController
  ) {

    this.currentAccountId = this.authService.getAccountId();
    this.destAcct = this.navParams.get('destAcct') || '';
    this.xlmAmount = this.navParams.get('xlmAmount');
    this.calculateXLM(this.xlmAmount);
  }

	ionViewWillEnter(){
    console.log('getting balance');

    this.getBalance();
    this.checkPin();
    this.loadContacts();

  }

  /**
   * Check if user has set a pin.
   * Prompts if not
   */
  checkPin(){
    if (this.authService.getData('pin')) {
      return true;
    } else {
        let alert = this.alertCtrl.create({
        title: 'Set Pin',
        message: 'You have not set a PIN yet. Please set Pin',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.navCtrl.push(ChangePin);
            }
          }
        ]
      });

      alert.present();
    }
  }

  /**
   * Get account balance in XLM
   */
  getBalance(){

    if (this.currentAccountId) {
      this.stellarService.getBalance(this.currentAccountId)
        .then((account)=>{

          this.balances = account.balances;
          this.currentBalance = this.balances[0].balance;
          this.displayBalance = this.balances[0].balance;
          this.calculateXLM(this.xlmAmount);
        })
        .catch((error)=>{

          console.log(error);
          this.balances = [{
            "balance": "0.00",
            "asset_type": "native"
          }];
        })
    } else {
       this.balances = [{
        "balance": "0.00",
        "asset_type": "native"
      }];

    }
  }

  /**
   * calculates balance in XLM
   * @param {number} value amount to be sent
   */
  calculateXLM(value){
    if (!value) { 
      this.displayBalance = this.currentBalance
    } else {
      this.displayBalance = this.currentBalance - value;
    }
  }

  /**
   * Get contacts for selection
   */
  loadContacts(){

    this.contactService.getList().then((contacts:any) => {

      this.contactList = contacts
      console.log(this.contactList);
    }, (error) => {
          console.log(error);

    });
    console.log(this.contactList);
  }

  /**
   * Shows contacts as an alert box
   */
  showContacts() {

    let alert = this.alertCtrl.create();
    alert.setTitle('Select Contact');

    for (var i = 0; i < this.contactList.length; ++i) {
      // set destAcct as Public key if the pubKey is stored, else sets email
      if (this.contactList[i].publicKey) { 
        alert.addInput({
          type: 'radio',
          label: this.contactList[i].displayName || this.contactList[i].email,
          value: this.contactList[i].publicKey,
          checked: false
        });
      } else {
        alert.addInput({
          type: 'radio',
          label: this.contactList[i].displayName || this.contactList[i].email,
          value: this.contactList[i].email,
          checked: false
        });
      }
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.destAcct = data;
        console.log(data);
      }
    });
    alert.present();
  }


  /**
   * Sends XLM to recipient
   */
  send(){
  	this.loadingService.showLoader("Sending...");

    // remaining balance should be more than 20 XLM
    if (this.displayBalance >= 20) {
        let body = {
            "pin": this.pin,
            "token": this.authService.getLapiToken(),
            "uuid":  this.authService.getUuid()
          };

      // verify pin
        this.lapi.verifyPin(body)
            .map(res => res.json())
            .subscribe((resp) => {
              console.log(resp);

              // determine address type
              let addressType = this.utility.getAddressType(this.destAcct);

              switch (addressType) {
                case 1:
                  // address type = pubkey
                  this.stellarService.sendLumens(this.destAcct, this.xlmAmount)
                  .then((result)=>{

                    this.loadingService.hideLoader();
                    this.alertService.basicAlert("Success", this.xlmAmount+"XLM sent" ,"Ok");
                    this.navCtrl.setRoot(Wallet);

                  })
                  .catch((error)=>{
                    console.log(error);
                    this.loadingService.hideLoader();
                    this.alertService.basicAlert("Error", error.message ,"Ok");
                  });

                  break;
                case 2:
                  // address type = stellar address
                  this.stellarService.sendLumensViaFederation(this.destAcct, this.xlmAmount)
                  .then((result)=>{

                    this.loadingService.hideLoader();
                    this.alertService.basicAlert("Success", this.xlmAmount+"XLM sent" ,"Ok");
                    this.navCtrl.setRoot(Wallet);

                  }).catch((error)=>{
                    console.log(error);
                    this.loadingService.hideLoader();
                    this.alertService.basicAlert("Error", error.message ,"Ok");
                  });

                  break;

                case 3:
                  // address type = email
                  this.stellarService.sendLumensViaEmail(this.destAcct, this.xlmAmount,this.pin)
                  .then((result)=>{
                    console.log(result);
                    this.loadingService.hideLoader();
                    this.alertService.basicAlert("Success", this.xlmAmount+"XLM sent" ,"Ok");
                    this.navCtrl.setRoot(Wallet);

                  }).catch((error)=>{
                    console.log(error);
                    this.loadingService.hideLoader();
                    this.alertService.basicAlert("Error", error.message ,"Ok");
                  });

                  break;

                default:
                  this.alertService.basicAlert("Error", "Select an address type" ,"Ok");
                  break;
              }

            }, (err) => {

              console.log(err.json());
              let errorObj = err.json();
              this.loadingService.hideLoader();
              this.alertService.basicAlert("Error", errorObj.content.message.join('. ') ,"Ok");

            });


  	} else {
  		this.loadingService.hideLoader();
  		this.alertService.basicAlert("Insufficent Balance", "Your XLM balance must be at least 20XLM after sending" ,"Ok");
  	}


  }

}
