import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Send } from '../send/send';
import { EditContactPage } from '../edit-contact/edit-contact';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.displayName = this.navParams.get('displayName') || '';
  	this.email = this.navParams.get('email') || '';
  	this.photo = this.navParams.get('photo') || '';
  	this.publicKey = this.navParams.get('publicKey') || '';
  	this.contactId = this.navParams.get('id') || '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewContactPage');
  }

  send(){
  	let payload = {"destAcct": this.publicKey || this.email,
  									"xlmAmount": this.amount};

    this.navCtrl.push(Send, payload);

  }

  request(){

  }

  edit(){
    let payload = {
              "id": this.contactId,
              "displayName": this.displayName,
              "email": this.email,
              "photo": this.photo,
              "publicKey": this.publicKey
            };
  	// let payload = {"contact": contact};
		this.navCtrl.push(EditContactPage, payload);
  }

}
