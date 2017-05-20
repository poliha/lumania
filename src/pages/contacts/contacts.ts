import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactService } from '../../providers/contact-service';
/**
 * Generated class for the Contacts page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class Contacts {

	contactList = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public contactService: ContactService) {
  	this.loadContacts();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Contacts');
  }

  loadContacts(){
  	this.contactService.findAll().then((contacts) => {
          this.contactList=contacts;
        }, (error) => {
          console.log(error);
        })
  }

}
