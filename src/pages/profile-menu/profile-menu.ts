import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { Welcome } from '../welcome/welcome';

@IonicPage()
@Component({
  selector: 'page-profile-menu',
  templateUrl: 'profile-menu.html',
})
export class ProfileMenu {

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public viewCtrl: ViewController, public authService: AuthService) {
  }

  logout(){
  	this.viewCtrl.dismiss();
  	this.authService.logout();
  	console.log("view dismissed: ", this.authService.user);
  	this.navCtrl.push(Welcome);
  }
}
