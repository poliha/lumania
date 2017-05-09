import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, App } from 'ionic-angular';
import { ProfileMenu } from '../profile-menu/profile-menu';
import { ProfileEdit } from '../profile-edit/profile-edit';
import { AuthService } from '../../providers/auth-service';
import { Welcome } from '../welcome/welcome';

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

  constructor(private appCtrl: App, public navCtrl: NavController, public navParams: NavParams,
  	public popoverCtrl: PopoverController, public authService: AuthService) {
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
  editProfile(){
    this.navCtrl.push(ProfileEdit);
  }

  logout(){

    this.authService.logout();
    this.appCtrl.getRootNav().setRoot(Welcome);
  }

}
