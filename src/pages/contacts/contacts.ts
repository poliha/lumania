import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactService } from '../../providers/contact-service';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { ViewContactPage } from '../view-contact/view-contact';
import { AddContactPage } from '../add-contact/add-contact';

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

	contactList = [];
  masterList = [];
   searchTerm: string = '';
    searchControl: FormControl;
    items: any;
    searching: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public contactService: ContactService) {
  	this.loadContacts();
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Contacts');
  }

  loadContacts(){
  	this.contactService.getList().then((contacts:any) => {

        this.masterList = contacts;
        this.contactList = contacts

        this.searchControl.valueChanges.debounceTime(700).subscribe(search => {

          this.searching = false;
           this.contactList = this.filterItems(this.searchTerm);

        });

      // for (var i = 0; i < contacts.length; ++i) {
      //   if (contacts[i].emails) {
      //     this.contactList.push(contacts[i]);
      //   }
      // }

      console.log(this.contactList);

      // console.log("contacts:", contacts);
      // this.searchControl.valueChanges.debounceTime(700).subscribe(search => {

      //       this.searching = false;
      //       this.filterItems(this.searchTerm);

      //   });
    }, (error) => {
          console.log(error);
          // alert("Error\n"+error);
        })
  }

  onSearchInput(){
      this.searching = true;
  }


  filterItems(searchTerm){
    let searchList = this.masterList;
      return searchList.filter((item) => {
        if (item.displayName) { 
          return item.displayName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        } else {
          return item.email.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        }

      });

  }

  viewContact(contact){
    let payload = {
                  "id": contact.id,
                  "displayName": contact.displayName,
                  "email": contact.email,
                  "photo": contact.photo,
                  "publicKey": contact.publicKey
                };

      // if (contact.photos) {
      //    payload.photo = contact.photos[0].value;
      // }

      // if (contact.categories) {
      //   for (var i = 0; i < contact.categories.length; ++i) {
      //     if (contact.categories[i].type === 'stellar_public_key') {
      //       payload.publicKey = contact.categories[i].value;
      //     }
      //   }
      // }


    this.navCtrl.push(ViewContactPage, payload);
  }

  add(){
   this.navCtrl.push(AddContactPage);
  }

}
