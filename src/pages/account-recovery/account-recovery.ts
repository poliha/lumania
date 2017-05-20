import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { Lapi } from '../../providers/lapi';
import { AlertService } from '../../providers/alert-service';
import { StellarService } from '../../providers/stellar-sdk';


@IonicPage()
@Component({
  selector: 'page-account-recovery',
  templateUrl: 'account-recovery.html',
})
export class AccountRecovery {
	key1 = "";
	key2 = "";
	key3 = "";
	key4 = "";
	key5 = "";
	key6 = "";
  accounts: any = [];
  account: any;
  selectedAccount: any = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, public lapi: Lapi,
  	public alertCtrl: AlertController, public authService: AuthService,
    public alertService: AlertService,  public stellarService: StellarService ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountRecovery');
  }

  ionViewWillEnter(){

    this.loadAccounts();
  }

  loadAccounts(){
    let options = {

        'token': this.authService.getLapiToken(),
        'uuid': this.authService.getUuid()
      };

      this.lapi.recoverAccount(options)
        .map(res => res.json())
        .subscribe((resp) => {
              console.log(resp);
              this.accounts =  resp.content.data;
              // this.alertService.basicAlert("Success", resp.content.message.join('. ') ,"Ok");

         },
         (err:any)=>{
          // to do add toast
              console.log(err.json());
              let errorObj = err.json();
              this.alertService.basicAlert("Error", errorObj.content.message.join('. ') ,"Ok");

        });
  }

  recover(){

  	// recover on lapi
  	// encrypt of device
  	// store on device
  	let recoveryKey = this.key1+" "+this.key2+" "+this.key3+" "+this.key4+" "+this.key5+" "+this.key6;

    if (this.selectedAccount) { 
      this.stellarService.linkRecoveredAccount(this.selectedAccount, recoveryKey).then((account)=>{
        console.log("account", account);

        if (!account) { 
          this.alertService.basicAlert("Oops!", "Invalid Keys" ,"Ok");
        } else {
          this.account = account;
          this.alertService.basicAlert("Congrats!", "Account linked successfully" ,"Ok");
        }
        
      })
      .catch((err) => {
        this.alertService.basicAlert("Oops!", "Invalid Keys" ,"Ok");
        console.log('I get called:', err.message); // I get called: 'Something awful happened'
      });
    } else {
      // code...
    }

  }

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Continue Recovery',
      message: "This will remove any current account on this device. Continue?",
      buttons: [
        {
          text: 'No',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: data => {
            this.recover()
          }
        }
      ]
    });
    prompt.present();
  }

}
