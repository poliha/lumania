import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Config } from 'ionic-angular';
import { PaymentService } from '../../providers/payment-service';
import { Utility } from '../../providers/utility';
import { Lapi } from '../../providers/lapi';
import { LoadingService } from '../../providers/loading-service';
import { Storage } from '@ionic/storage';
import { AuthService } from '../../providers/auth-service';
import { ChangePin } from '../change-pin/change-pin';

@IonicPage()
@Component({
  selector: 'page-card-payment',
  templateUrl: 'card-payment.html',
})
export class CardPayment {
	amount: any;
  pin: any = "";
	currency: string;
  currencyList = [];
  rates: any = {};
  lumens_amount = 0.00;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage,
    public utility: Utility,  public lapi: Lapi, public alertCtrl: AlertController,
    public paymentService: PaymentService, public loadingService: LoadingService,
    public config: Config, public authService: AuthService) {

    this.currencyList = this.config.get('currencyList');

    // this.currentRate = this.navParams.get('sellRate') || 1.00;
    // this.recvCurreny = this.navParams.get('currency') || 'NGN';
    this.currency = this.navParams.get('currency') || this.config.get('defaultCurrency');
    // this.getRates();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardPayment');

  }
  ionViewWillEnter(){
    console.log('getting balance');
    this.getRates();
    this.checkPin();
  }

  checkPin(){
    if (this.authService.getData('pin')) {
      return true;
    } else {
        let alert = this.alertCtrl.create({
        title: 'Set Pin',
        message: 'You have not set a PIN yet. Please set Pin',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.navCtrl.push(ChangePin);
            }
          }
        ]
      });
      alert.present();
    }
  }

  pay(){
  	this.paymentService.raveCheckout(this.amount, this.currency, this.lumens_amount, this.pin);
  }

  getRates(){
    this.loadingService.showLoader("Getting best rates...");
    this.lapi.getRates()
      .then((resp)=>{
        this.loadingService.hideLoader();
        console.log(resp);
        // this.rates = resp;
        return this.storage.get('rates');
      })
      .catch((err) => {
          this.loadingService.hideLoader();
          // to do add toast
          console.log("error",err.json());
      })
      .then((val) => {
          this.rates = val;
          // this.calculateBalances();
      });
  }

  calculateXLM(){
    console.log("calculateXLM");

    if (!this.amount) { 
      this.lumens_amount = 0.00;
    } else {
      if (this.currency === 'USD') { 
        this.lumens_amount = this.utility.round((this.amount*this.rates.USDXLM),7);
      } else {
        let target = this.currency+'XLM';
        this.lumens_amount = this.utility.round(( (this.amount/this.rates[target])*this.rates.USDXLM), 7);
      }
    }


  }

  onInput(value){

    if (!this.amount) { 
      this.lumens_amount = 0.00;
    } else {

      if (this.currency === 'USD') { 
        let temp = ( parseFloat(this.amount)*parseFloat(this.rates.USDXLM));
        console.log("temp", temp);
        this.lumens_amount = this.utility.round(temp,7);
        console.log("calculateinput", value, this.currency, this.amount, this.lumens_amount, this.rates.USDXLM);
      } else {
        let target = this.currency+'XLM';
        let temp = (parseFloat(this.amount)/parseFloat(this.rates[target]))*parseFloat(this.rates.USDXLM);
        console.log("temp", temp);
        this.lumens_amount = this.utility.round(temp, 7);
        console.log("calculateinput", value, this.currency, this.amount, this.lumens_amount, this.rates.USDXLM, this.rates[target]);
      }
    }

  }

}
