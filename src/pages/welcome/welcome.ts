import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Login } from '../login/login';
import { Signup } from '../signup/signup';
import { AuthService } from '../../providers/auth-service';
import { Dashboard } from '../dashboard/dashboard';
// import { SplashScreen } from '@ionic-native/splash-screen';

/**
 * Generated class for the Welcome page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class Welcome {

  constructor( public navCtrl: NavController, public navParams: NavParams, public authService: AuthService) {
   // splashScreen.hide();
    if (this.authService.isLoggedIn()) { 
      this.navCtrl.push(Dashboard);
    } else {
      console.log("nt auth");
      
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Welcome');
  }

  login() {
    this.navCtrl.push(Login);
  }

  signup() {
    this.navCtrl.push(Signup);
  }

}
