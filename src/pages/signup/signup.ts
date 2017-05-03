import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UserDetails} from '@ionic/cloud-angular';
import { Login } from '../login/login';
import { Dashboard } from '../dashboard/dashboard';
import { AuthService } from '../../providers/auth-service';
/**
 * Generated class for the Signup page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class Signup {
	account: {name: string, email: string, password: string} = {
		'email': "",
  	'password': "",
  	'name': ""
  };

  loading: any;
  alert: any;
  messages: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
     public loadingCtrl: LoadingController, public authService: AuthService) {
    if (this.authService.isLoggedIn()) { 
      this.navCtrl.push(Dashboard);
    } else {
      console.log("nt auth");
      
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup');
  }

  showLoader(){
     this.loading = this.loadingCtrl.create({
      content: "Creating Account..."
    });
    this.loading.present();
  }


  showAlert(msg){
     this.alert = this.alertCtrl.create({
      title: 'Signup Successful',
      message: msg,
      buttons: [
        {
          text: 'Login',
          handler: () => {
            this.navCtrl.push(Login);
          }
        }
      ]
    });
    this.alert.present();

  }
  toDB(){
    this.navCtrl.push(Dashboard);
  }

  doSignUp(){
    // show loading message
    this.showLoader();

  	let details: UserDetails = {
  		'email': this.account.email,
  		'password': this.account.password,
  		'name': this.account.name,
      'custom' : {
        'age': '19',
        'sex': 'male'
      }
  	};
  	console.log('details: ', details);

    this.authService.signUp(details).then((resp) => {
      this.loading.dismiss();
      console.log(resp);

      if (resp.status === 'error') {
        this.messages = resp.messages;
        throw new Error("error");

      }

      if (resp.status === 'success') {
        // to do send ntification email
        // attempt to login user
        return this.authService.login(details);
      }

    })
    .then((resp) => {
      if (resp.status === 'error') {
        this.messages = resp.messages;
      }

      if (resp.status === 'success') {
        // navigate to dashboard
        this.navCtrl.push(Dashboard);
      }
    })
    .catch((error) => {
      console.log(error);
    })



  }
}
