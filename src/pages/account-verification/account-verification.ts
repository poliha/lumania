import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { AlertService } from '../../providers/alert-service';
import { Lapi } from '../../providers/lapi';



@IonicPage()
@Component({
  selector: 'page-account-verification',
  templateUrl: 'account-verification.html',
})
export class AccountVerification {

	verifyObj: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public lapi: Lapi,
  public authService: AuthService, public alertService: AlertService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountVerification');
  }

  ionViewWillEnter(){
  	this.getUserData();
  }

  getUserData(){

		let obj =	this.authService.getData('verifyObj');

  	console.log(obj);
  	if (obj) {
  		
  		this.verifyObj = obj;
  	} else {
  		

			let nameSplit =  this.authService.user.details.name.split(" ");
			this.verifyObj.firstname = nameSplit[0];
			this.verifyObj.surname = nameSplit[1];
			this.verifyObj.email = this.authService.user.details.email;

  	}


  }
}
