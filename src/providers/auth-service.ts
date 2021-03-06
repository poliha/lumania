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
  					"messages": ["Login error. Please verify details"]
  				};
 
    });

  	return req;
  }

  logout(){
  	return this.auth.logout();
  }

  resetPasswordRequest(email){
  	// email = 'p@l.cim';
  	let message = [];
  	let req = this.auth.requestPasswordReset(email).then((d) => {

        // success
        console.log("rtn", d);
        return {"status": "success",
	  					"messages": message
	  				};

    }, (err) => {

   	    // problem logging in
        console.log(err);

        message.push("Invalid input");
        return {"status": "error",
	  					"messages": message
	  				};

    });
  	return req;
  }

  changePassword(code, password){
  	// code = '2';
  	let message = [];
  	let req = this.auth.confirmPasswordReset(code, password).then((d) => {

		        // success
		        console.log("rtn", d);
		        return {"status": "success",
			  					"messages": message
			  				};

		    }, (err: IDetailedError<string[]>) => {

		   	    // problem logging in
		        console.log(err);
		        console.log(err.details);

		        message.push("Invalid input");
		        return {"status": "error",
			  					"messages": message
			  				};

		    });
  	return req;
  }

  isLoggedIn(){
  	return this.auth.isAuthenticated();
  }

  lapiToken(token){
  	this.user.set('lapi_token', token);
  	let req = this.user.save().then(() => {
			// return {"status": "success",
  	// 				"messages": ["save success"]
  	// 			};
    }, (err) => {
      //   return {"status": "error",
  				// 	"messages": ["save error. Please verify details"]
  				// };
    });

  	return req;
  }

  getLapiToken(){
    return this.user.get('lapi_token',false);
    
  }

  getUuid(){
    return this.user.id;

  }

  getAccountId(){
    let acct = this.user.get('account', false);
    if (acct) {
      return  acct.account_id;
    } else {
      return false;
    }
  }

  getAccount(){
    let acct = this.user.get('account', false);
    if (acct) {
      return  acct;
    } else {
      return false;
    }
  }

  verifyEmail(code)
  {

  	if (code === this.user.get('email_auth_code', 1)) {
      return true;
    }else{
      return false;
    }

  }

  saveData(key, value){
    let req: any;
    this.user.set(key, value);
    req = this.user.save().then(() => {

    }, (err) => {

    });

    return req;
  }

  setData(key, value){
    this.user.set(key, value);
  }

  saveProfileData(name, email){
    let req: any;
    this.user.details.name = name;
    this.user.details.email = email;
    req = this.user.save().then(() => {

    }, (err) => {

    });

    return req;
  }

  saveUser(){
    let req: any;
    req = this.user.save();

    return req;
  }


  getData(key){
    return this.user.get(key, false);
  }

}
