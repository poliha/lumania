import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactForm } from '../contact-form/contact-form';

/**
 * Generated class for the SupportChannels page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-support-channels',
  templateUrl: 'support-channels.html',
})
export class SupportChannels {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupportChannels');
  }

  contactForm(){
  	this.navCtrl.push(ContactForm);
  }

  joinWhatsappGroup(){
    
  }

}
