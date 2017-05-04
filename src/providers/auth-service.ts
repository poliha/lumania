import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';


@Injectable()
export class AuthService {

	details: UserDetails;

  constructor(public http: Http, public user: User, public auth: Auth) {
    console.log('Hello AuthService Provider');
  }

  signUp(details){
		return	this.auth.signup(details).then(() => {
			  // hide loading message
	      // this.loading.dismiss();
	      // this.showAlert('Login to  access your account');

			  // console.log("user: ",this.user);
			  return {"status": "success",
	  					"messages": []
	  				};

			}, (err: IDetailedError<string[]>) => {
			  let message = [];
	      for (let e of err.details) {

	      	console.log(e);


			    if (e === 'conflict_email') {
			      message.push('Email already exists.');
			    }
			    else if(e === 'required_email'){
	                message.push('Email is required.');
	        }
	        else if(e === 'required_password'){
	                message.push('Password is required.');
	        }
	        else if (e === 'conflict_username'){
	                message.push('Username already exists');
	        }
	        else if (e === ' invalid_email'){
	                message.push('Email not valid.');
	        }
	        else{
	          message.push('Error: User not registered.');
	        }
			  }
			  return {"status": "error",
	  					"messages": message
	  				};

	      // this.loading.dismiss();
	      // this.showAlert(message);

			});
  }

  login(details){
  	console.log(details);
		let req =	this.auth.login('basic', details).then(() => {
			return {"status": "success",
  					"messages": ["login success"]
  				};
    }, (err) => {
        return {"status": "error",
  					"messages": ["login error"]
  				};
 
    });

  	return req;
  }

  logout(){
  	return this.auth.logout();
  }

  isLoggedIn(){
  	return this.auth.isAuthenticated();
  }

}
