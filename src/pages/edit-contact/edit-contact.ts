import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactService } from '../../providers/contact-service';
import { ToastService } from '../../providers/toast-service';
import { ViewContactPage } from '../view-contact/view-contact';

@IonicPage()
@Component({
  selector: 'page-edit-contact',
  templateUrl: 'edit-contact.html',
})
export class EditContactPage {
	displayName = "";
	email = "";
	photo = "";
	publicKey = "";
	contactId: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public contactService: ContactService, public toastService: ToastService) {
  	this.displayName = this.navParams.get('displayName') || '';
  	this.email = this.navParams.get('email') || '';
  	this.photo = this.navParams.get('photo') || '';
  	this.publicKey = this.navParams.get('publicKey') || '';
  	this.contactId = this.navParams.get('id') || '';

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditContactPage');
  }


  save(){
  	let payload = {
              "id": this.contactId,
              "displayName": this.displayName,
              "email": this.email,
              "photo": this.photo,
              "publicKey": this.publicKey
    };

    this.contactService.save(payload).then(()=>{
    	this.toastService.showToast("Contact saved");
    	this.navCtrl.push(ViewContactPage, payload);
    },
    (error: any) => {
    	console.log(error);
    	this.toastService.showToast("Contact not saved");

    }
    );
    // .catch((error)=>{
    // 	console.log(error);
    // 	this.toastService.showToast("Contact not saved");

    // })


  }

}
