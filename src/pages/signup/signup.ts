import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, App } from 'ionic-angular';
import { UserDetails} from '@ionic/cloud-angular';
import { Login } from '../login/login';
import { Dashboard } from '../dashboard/dashboard';
import { Welcome } from '../welcome/welcome';
import { AuthService } from '../../providers/auth-service';
import { Utility } from '../../providers/utility';
import { Lapi } from '../../providers/lapi';
import { AlertService } from '../../providers/alert-service';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class Signup {
	account = {
		'email': "",
  	'password': "",
  	'firstname': "",
    'surname': "",
    'country': "",
    'phone': "",
  };
  loading: any;
  alert: any;
  messages: any = [];
  auth_code: any;
  countries: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public alertCtrl: AlertController, public alertService: AlertService,
    public loadingCtrl: LoadingController, public authService: AuthService, 
    public utility: Utility, public lapi: Lapi, public appCtrl: App ) {

    this.auth_code = this.utility.randomString(6);
    if (this.authService.isLoggedIn()) {
      this.navCtrl.push(Dashboard);
    }
    // load countries array
    this.countries = this.utility.getCountries();

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

  /**
   * Two step signup process
   * signs up user via ionic and Lapi
   *
   */
  doSignUp(){
    this.showLoader();

  	let details: UserDetails = {
  		'email': this.account.email,
  		'password': this.account.password,
  		'name': this.account.firstname+" "+this.account.surname,
      'custom' : {
        'accounts': false,
        'country': this.account.country,
        'phone': this.account.phone,
        'email_auth_code': this.auth_code,
        'email_verified': false,
        'pin': false,
        'kyc_tier': 0
      }
  	};

    // sign up via ionic auth
    this.authService.signUp(details)
    .then((resp) => {

      if (resp.status === 'error') {
        this.messages = resp.messages;
        throw new Error("error");
      }

      if (resp.status === 'success') {
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
          acctInfo.firstname = this.account.firstname;
          acctInfo.surname = this.account.surname;
          acctInfo.email = this.account.email;
          acctInfo.auth_code = this.auth_code;
          acctInfo.password  = this.account.password;
          acctInfo.country = this.account.country;
          acctInfo.phone = this.account.phone;

          this.lapi.signUp(acctInfo)
            .map(res => res.json())
            .subscribe((resp) => {
              console.log(resp);

              //store token in ionic auth user object
              return this.authService.lapiToken(resp.content.data.token);

            }, (err) => {
              // to do maybe delete user from backend if error occured
              console.log(err);
              alert(err);
            });
      }
    })
    .then(() => {
        // hide loading
        this.loading.dismiss();

        // navigate to dashboard
        this.navCtrl.push(Dashboard).catch(err => {
          this.alertService.basicAlert("Error", "Please Login" ,"Ok");
          this.authService.logout();
          this.appCtrl.getRootNav().setRoot(Welcome);
        });

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
