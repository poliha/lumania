import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';

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
		'email': "this.account.email",
  	'password': "",
  	'name': ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: Auth, public user: User) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Signup');
  }

  doSignUp(){
  	let details: UserDetails = {
  		'email': this.account.email,
  		'password': this.account.password,
  		'name': this.account.name
  	};
  	console.log('details: ', details);

  	this.auth.signup(details).then(() => {
		  alert("user sign up successful");
		  console.log("user: ",this.user);
		}, (err: IDetailedError<string[]>) => {
		  for (let e of err.details) {
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
