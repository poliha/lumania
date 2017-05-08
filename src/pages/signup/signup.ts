import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UserDetails} from '@ionic/cloud-angular';
import { Login } from '../login/login';
import { Dashboard } from '../dashboard/dashboard';
import { AuthService } from '../../providers/auth-service';
import { Utility } from '../../providers/utility';
import { Lapi } from '../../providers/lapi';

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
  auth_code: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
     public loadingCtrl: LoadingController, public authService: AuthService, public utility: Utility,
     public lapi: Lapi ) {
    this.auth_code = this.utility.randomString(6);
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


  doSignUp(){
    // show loading message
    this.showLoader();

  	let details: UserDetails = {
  		'email': this.account.email,
  		'password': this.account.password,
  		'name': this.account.name,
      'custom' : {
        'age': '19',
        'sex': 'male',
        'email_auth_code': this.auth_code,
        'email_verified': false
      }
  	};
  	console.log('details: ', details);

    this.authService.signUp(details)
    .then((resp) => {

      console.log(resp);

      if (resp.status === 'error') {
        this.messages = resp.messages;
        throw new Error("error");

      }

      if (resp.status === 'success') {
        // to do send ntification email with verification code
        // attempt to login user
        return this.authService.login(details);
      }

    })
    .then((resp) => {
      if (resp.status === 'error') {
        this.messages = resp.messages;
      }

      if (resp.status === 'success') {
        // signup user on lapi
        let acctInfo: any = {};
          acctInfo.id = this.authService.user.id;
          acctInfo.name = this.account.name;
          acctInfo.email = this.account.email;
          acctInfo.auth_code = this.auth_code;

          this.lapi.signUp(acctInfo)
            .map(res => res.json())
            .subscribe((resp) => {
              console.log(resp);

              // To do store token
              return this.authService.lapiToken(resp.content.data.token);

            }, (err) => {
              // to do add toast
              console.log(err);
              alert(err);

            });



      }
    })
    .then(() => {
        // hide loading
        this.loading.dismiss();
        // navigate to dashboard
        this.navCtrl.push(Dashboard);

    },
    (err) => {
        this.messages.push('Signup error, Please try again');
        throw new Error("error");
    }
    )
    .catch((error) => {
      // hide loading
      this.loading.dismiss();
      // to do show toast
      console.log(error);
    })



  }
}
