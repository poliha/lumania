import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { Utility } from '../../providers/utility';
import { Storage } from '@ionic/storage';
import { ToastService } from '../../providers/toast-service';
import * as Clipboard from 'clipboard/dist/clipboard.min.js';



@IonicPage()
@Component({
  selector: 'page-account-details',
  templateUrl: 'account-details.html',
})
export class AccountDetails {
	account:any = {};
	skey: any = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXX';
	hideSkey = true;
  clipboard: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public authService: AuthService, public toastService: ToastService,
    public utility: Utility, public storage: Storage) {
    this.clipboard = new Clipboard('#cpyBtn');
    this.clipboard.on('success', () => this.toastService.showToast("Copied!"));
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

  // copy(text){
  //   this.clipboard.copy('Hello world')
  //   .then((data)=>{
  //     console.log("copied:", data);
  //     this.toastService.showToast("Copied "+text+"!");
  //   })

    
  // }

}
