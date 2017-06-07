import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactForm } from '../contact-form/contact-form';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-support-channels',
  templateUrl: 'support-channels.html',
})
export class SupportChannels {

  constructor(public navCtrl: NavController, public navParams: NavParams,
     private iab: InAppBrowser) {
  }

  contactForm(){
  	this.navCtrl.push(ContactForm);
  }

  joinWhatsappGroup(){
    // whatsapp chat group
    let url = 'https://chat.whatsapp.com/A9uwS2hVLryJ7yJQo0ozxm';
    this.iab.create(url,"_system");
  }

}
