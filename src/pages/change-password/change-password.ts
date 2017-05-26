import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Lapi } from '../../providers/lapi';
import { AuthService } from '../../providers/auth-service';
import { AlertService } from '../../providers/alert-service';


@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePassword {
	account: {old_password: string, password: string, confirm_password: string} = {
		'old_password': "",
  	'password': "",
  	'confirm_password': ""
  };
  messages = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public lapi: Lapi,
  public authService: AuthService, public alertService: AlertService  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePassword');
  }

  changePassword(){
    this.messages = [];
  	if (this.account.password !== this.account.confirm_password) { 
  		this.messages.push('Password Mismatch')
  	} else {
  		let options = {
  			'old_password': this.account.old_password,
  			'password': this.account.password,
  			'confirm_password': this.account.confirm_password,
  			'token': this.authService.getLapiToken(),
  			'uuid': this.authService.getUuid()
  		};

  		this.lapi.changePassword(options)
        .map(res => res.json())
        .subscribe((resp) => {
              console.log(resp);
              this.alertService.basicAlert("Success", resp.content.message.join('. ') ,"Ok");
              this.navCtrl.pop();

         },
         (err:any)=>{
          // to do add toast
              console.log(err.json());
              let errorObj = err.json();
              this.alertService.basicAlert("Error", errorObj.content.message.join('. ') ,"Ok");

        });



  	}

  }

}
