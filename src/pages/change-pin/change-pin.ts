import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Lapi } from '../../providers/lapi';
import { AuthService } from '../../providers/auth-service';
import { AlertService } from '../../providers/alert-service';

@IonicPage()
@Component({
  selector: 'page-change-pin',
  templateUrl: 'change-pin.html',
})
export class ChangePin {

	isset_pin: any = false;
	changeObj: {old_pin: string, pin: string, confirm_pin: string} = {
		'old_pin': "",
  	'pin': "",
  	'confirm_pin': ""
  };
  setObj: {pin: string, confirm_pin: string} = {
  	'pin': "",
  	'confirm_pin': ""
  };
  messages = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public lapi: Lapi,
  public authService: AuthService, public alertService: AlertService ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePin');
  }

  ionViewWillEnter(){
  	this.isset_pin = this.authService.getData('pin');
  }

  changePin(){
    this.messages = [];
  	if (this.changeObj.pin !== this.changeObj.confirm_pin) {
  		this.messages.push('PIN Mismatch')
  	} else {
  		let options = {
  			'old_pin': this.changeObj.old_pin,
  			'pin': this.changeObj.pin,
  			'confirm_pin': this.changeObj.confirm_pin,
  			'token': this.authService.getLapiToken(),
  			'uuid': this.authService.getUuid()
  		};

  		this.lapi.changePin(options)
  			.map(res => res.json())
  			.subscribe((resp) => {
              console.log(resp);
              this.alertService.basicAlert("Success", resp.content.message.join('. ') ,"Ok");
              this.authService.saveData('pin', true);

         },
         (err:any)=>{
        	// to do add toast
              console.log(err.json());
              let errorObj = err.json();
              this.alertService.basicAlert("Error", errorObj.content.message.join('. ') ,"Ok");

        });



  	}
  }

  setPin(){
    this.messages = [];
  	if (this.setObj.pin !== this.setObj.confirm_pin) {
  		this.messages.push('PIN Mismatch')
  	} else {
  		let options = {
  			'pin': this.setObj.pin,
  			'confirm_pin': this.setObj.confirm_pin,
  			'token': this.authService.getLapiToken(),
  			'uuid': this.authService.getUuid()
  		};

  		this.lapi.setPin(options)
  			.map(res => res.json())
  			.subscribe((resp) => {
              console.log(resp);
              this.alertService.basicAlert("Success", resp.content.message.join('. ') ,"Ok");
              this.authService.saveData('pin', true);

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
