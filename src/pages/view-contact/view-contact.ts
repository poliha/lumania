import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Send } from '../send/send';
import { EditContactPage } from '../edit-contact/edit-contact';
import { AlertService } from '../../providers/alert-service';
import { AuthService } from '../../providers/auth-service';
import { Lapi } from '../../providers/lapi';
import { LoadingService } from '../../providers/loading-service';

@IonicPage()
@Component({
  selector: 'page-view-contact',
  templateUrl: 'view-contact.html',
})
export class ViewContactPage {

	displayName = "";
	email = "";
	photo = "";
	amount = 0.00;
	publicKey = "";
	contactId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public authService: AuthService, public lapi: Lapi, public loadingService: LoadingService,
    public alertService: AlertService) {

  	this.displayName = this.navParams.get('displayName') || '';
  	this.email = this.navParams.get('email') || '';
  	this.photo = this.navParams.get('photo') || '';
  	this.publicKey = this.navParams.get('publicKey') || '';
  	this.contactId = this.navParams.get('id') || '';
  }

  /**
   * Send contact details to send xlm page
   */
  send(){
  	let payload = {"destAcct": this.publicKey || this.email,
  									"xlmAmount": this.amount};

    this.navCtrl.push(Send, payload);

  }

  /**
   * request lumens from a contact
   */
  request(){
    // send user account id, recepient email, amount to lapi 
    this.loadingService.showLoader("Sending request...");
    let accountID = this.authService.getAccountId();

    if (this.email && accountID) { 
      let requestObj = {
        "amount": this.amount,
        "sender_email": this.authService.user.details.email,
        "sender_name": this.authService.user.details.name,
        "sender_account_id": accountID,
        "rcvr_email": this.email,
        "rcvr_name": this.displayName,
        "token": this.authService.getLapiToken(),
        "uuid":  this.authService.getUuid()
      };

      this.lapi.requestLumens(requestObj)
        .map(res => res.json())
        .subscribe((resp) => {
          console.log(resp);
          this.loadingService.hideLoader();
          this.alertService.basicAlert("Success", "Request sent" ,"Ok");
        }, (err) => {

          console.log(err);
          this.loadingService.hideLoader();
          this.alertService.basicAlert("Request Error", "Unable to send request. Please try again" ,"Ok");

        });

    } else {
      this.loadingService.hideLoader();
      this.alertService.basicAlert("Error", "No email or Account ID" ,"Ok");

      
    }


  }
  /**
   * load edit page.
   * issue with cordova save edit. removed  from app
   */
  edit(){
    let payload = {
              "id": this.contactId,
              "displayName": this.displayName,
              "email": this.email,
              "photo": this.photo,
              "publicKey": this.publicKey
            };

		this.navCtrl.push(EditContactPage, payload);
  }

}
