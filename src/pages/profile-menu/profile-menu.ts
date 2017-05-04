import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { Welcome } from '../welcome/welcome';


/**
 * Generated class for the ProfileMenu page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile-menu',
  templateUrl: 'profile-menu.html',
})
export class ProfileMenu {

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public viewCtrl: ViewController, public authService: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileMenu');
  }

  logout(){
  	this.viewCtrl.dismiss();
  	this.authService.logout();
  	console.log("view dismissed: ", this.authService.user);
  	this.navCtrl.push(Welcome);
  }
}
