import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { Login } from '../login/login';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
    public auth: Auth, public user: User, public loadingCtrl: LoadingController) {
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
    showLoader();

  	let details: UserDetails = {
  		'email': this.account.email,
  		'password': this.account.password,
  		'name': this.account.name
  	};
  	console.log('details: ', details);

  	this.auth.signup(details).then(() => {
		  // hide loading message
      this.loading.dismiss();
      showAlert('Login to  access your account');
      
		  console.log("user: ",this.user);
		}, (err: IDetailedError<string[]>) => {
		  let message = "";
      for (let e of err.details) {
		    
      	console.log(e);

        
		    if (e === 'conflict_email') {
		      message += 'Email already exists.\n';
		    }
		    else if(e === 'required_email'){
                message += 'Email is required.\n';
        }
        else if(e === 'required_password'){
                message += 'Password is required.\n';
        }
        else if (e === 'conflict_username'){
                message += 'Username already exists.\n';
        }
        else if (error === ' invalid_email'){
                message += 'Email not valid.\n';
        }
        else{
          message += 'Error: User not registered.\n';
        }
		  }
      this.loading.dismiss();
      showAlert(message);

		});

  }
}
