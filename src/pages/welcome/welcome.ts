import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Login } from '../login/login';
import { Signup } from '../signup/signup';
import { AuthService } from '../../providers/auth-service';
import { Dashboard } from '../dashboard/dashboard';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class Welcome {

  constructor( public navCtrl: NavController, public navParams: NavParams, public authService: AuthService) {

    // check if user is logged in.
    // To do: move to ionviewwillenter?
    if (this.authService.isLoggedIn()) { 
      this.navCtrl.push(Dashboard);
    }

  }

  login() {
    this.navCtrl.push(Login);
  }

  signup() {
    this.navCtrl.push(Signup);
  }

}
