import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { Utility } from '../../providers/utility';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-account-details',
  templateUrl: 'account-details.html',
})
export class AccountDetails {
	account:any = {};
	skey: any = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXX';
	hideSkey = true;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public authService: AuthService, public utility: Utility, public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountDetails');
  }

  ionViewWillEnter(){

    this.getAccountDetails();
  }


  getAccountDetails(){
    this.storage.get('account_details_'+this.authService.getUuid())
    .then((account)=>{
      this.account = account;
    },
      (err)=>{

    })
  	
  }

  showSecretKey(){
  	this.hideSkey = false;
  	this.skey = this.utility.decrypt(this.account.seed_obj, this.authService.getUuid());
  }

  hideSecretKey(){
  	this.hideSkey = true;
  	this.skey = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXX';
  }

  sendPublicKeyAsEmail(){

  }

}
