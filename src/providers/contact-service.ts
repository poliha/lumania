import { Injectable } from '@angular/core';
import { Contacts, Contact,  ContactField } from '@ionic-native/contacts';
import { Storage } from '@ionic/storage';

@Injectable()
export class ContactService {

  contactList = [];
  constructor(private contacts: Contacts, public storage: Storage) {
    console.log('Hello ContactService Provider');
        // this.platform.ready().then(() => {
      this.findAll();
    // });
  }

  findAll(){
  	let options = {
          filter : "",
          multiple: true,
          desiredFields: [ 'displayName', 'name', 'emails', 'photos', 'categories' ],
          // hasPhoneNumber:false,
        };

    // let fields = [ 'displayName', 'name', 'emails'  ];

    return this.storage.ready().then(() => {
      return this.contacts.find(['*'],options);
    })
     .then((contacts) => {

      for (var i = 0; i < contacts.length; ++i) {
        if (contacts[i].emails) {
          let tempContact = {
            "id": contacts[i].id,
            "displayName": contacts[i].displayName || '',
            "email": contacts[i].emails[0].value,
            "photo": "",
            "publicKey": ""
          };

          if(contacts[i].photos){
            tempContact.photo = contacts[i].photos[0].value;
          }


            for (var j = 0; j < contacts[i].emails.length; ++j) {
              if(contacts[i].emails[j].type === 'stellarpublickey'){
                tempContact.publicKey = contacts[i].emails[j].value;
              }
            }


          // if(contacts[i].categories){
          //   for (var j = 0; j < contacts[i].categories.length; ++j) {
          //     if(contacts[i].categories[j].type === 'stellar_public_key'){
          //       tempContact.publicKey = contacts[i].categories[j].value;
          //     }
          //   }
          // }



          this.contactList.push(tempContact);
        }
      }

      console.log(this.contactList);

      console.log("contacts:", contacts);
      this.storage.set('contactList', this.contactList);

      return this.storage.get('contactList');
    }, (error) => {
          console.log(error);
          return new Promise<void>((resolve, reject) => {
            reject("No contacts");
          });
          // alert("Error\n"+error);
        });

  }

  save(contactObj){
    let contact: Contact = this.contacts.create();

    if (contactObj.id) {
      contact.id = contactObj.id
    }

    console.log(contactObj);

    contact.displayName = contactObj.displayName;
    contact.emails = [new ContactField('other', contactObj.email)];
    contact.emails = [new ContactField('stellarpublickey', contactObj.publicKey)];

    console.log(contact);
    return contact.save();
  }

  getList(){
    return this.storage.get('contactList');
  }

}
