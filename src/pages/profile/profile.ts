import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { ProfileMenu } from '../profile-menu/profile-menu';


/**
 * Generated class for the Profile page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Profile');
  }

  showMenu(openMenuEvent) {
    let popover = this.popoverCtrl.create(ProfileMenu);
    popover.present({
    	ev: openMenuEvent
    });
  }


}
