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


  showAlert(){
     this.alert = this.alertCtrl.create({
      title: 'Signup Successful',
      message: 'Login to  access your account',
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
      showAlert();
      
		  console.log("user: ",this.user);
		}, (err: IDetailedError<string[]>) => {
		  for (let e of err.details) {
		    this.loading.dismiss();
      	console.log(e);
		  	// TO DO handle errors
		    // if (e === 'conflict_email') {
		    //   // alert('Email already exists.');
		    // }
		    // else if(error === 'required_email'){
      //           // email missing
      //   }
      //   else if(error === 'required_password'){
      //           // password missing
      //   }
      //   else if(error === 'conflict_email'){
      //           // email already in use
      //   }
      //   else if (error === 'conflict_username'){
      //           // username alerady in use
      //   }
      //   else if (error === ' invalid_email'){
      //           // email not valid
      //   }
      //   else{

      //   }
		  }
		});

  }
}
