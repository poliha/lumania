import { Injectable } from '@angular/core';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';

// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

/*
  Generated class for the ContactService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ContactService {

  constructor(private contacts: Contacts) {
    console.log('Hello ContactService Provider');
        // this.platform.ready().then(() => {
      this.findAll();
    // });
  }

  findAll(){
  	let options = {
          filter : "M",
          multiple: true,
          hasPhoneNumber:false,
          fields:  [ 'displayName', 'name', 'emails'  ]
        };

   	return this.contacts.find(['*'],options);

  }

}
