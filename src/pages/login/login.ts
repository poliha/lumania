import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App} from 'ionic-angular';
// import { Auth, User} from '@ionic/cloud-angular';
import { PasswordReset } from '../password-reset/password-reset';
import { AuthService } from '../../providers/auth-service';
import { LoadingService } from '../../providers/loading-service';
import { Dashboard } from '../dashboard/dashboard';
import { Welcome } from '../welcome/welcome';
import { AlertService } from '../../providers/alert-service';

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
  // loading: any;

  constructor(private appCtrl: App, public navCtrl: NavController, public navParams: NavParams, 
    public alertService: AlertService, public loadingService: LoadingService, 
    public authService: AuthService) {
    if (this.authService.isLoggedIn()) { 
      this.navCtrl.push(Dashboard);
    } else {
      console.log("nt auth");
      
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }



  doLogin(){
     // show loading message
    this.loadingService.showLoader("Authenticating...");
    let details = {'email': this.account.email, 'password': this.account.password};
    this.authService.login(details)
      .then((resp) => {
        this.loadingService.hideLoader();
        console.log(resp);
        // this.loading.dismiss();
        if (resp.status === 'error') {
          this.messages = resp.messages;
        }

        if (resp.status === 'success') {
          // navigate to dashboard
          this.navCtrl.push(Dashboard).catch(err => {
            this.alertService.basicAlert("Error", "Please Login" ,"Ok");
            this.authService.logout();
            this.appCtrl.getRootNav().setRoot(Welcome);
          });
        }
      });




  }

  requestPassword(){
    this.navCtrl.push(PasswordReset);
  }

}
