import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
// import { Auth, User} from '@ionic/cloud-angular';
import { PasswordReset } from '../password-reset/password-reset';
import { AuthService } from '../../providers/auth-service';
import { Dashboard } from '../dashboard/dashboard';
/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {

	account: {email: string, password: string} = {
		'email': "",
  	'password': ""
  };
  messages: any = [];
  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public loadingCtrl: LoadingController, public authService: AuthService) {
    if (this.authService.isLoggedIn()) { 
      this.navCtrl.push(Dashboard);
    } else {
      console.log("nt auth");
      
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  showLoader(){
     this.loading = this.loadingCtrl.create({
      content: "Authenticating..."
    });
    this.loading.present();
  }

  doLogin(){
     // show loading message
    this.showLoader();
    let details = {'email': this.account.email, 'password': this.account.password};
    this.authService.login(details)
      .then((resp) => {
        this.loading.dismiss();
        if (resp.status === 'error') {
          this.messages = resp.messages;
        }

        if (resp.status === 'success') {
          // navigate to dashboard
          this.navCtrl.push(Dashboard);
        }
      });




  }

  requestPassword(){
    this.navCtrl.push(PasswordReset);
  }

}
