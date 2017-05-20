import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { Welcome } from '../welcome/welcome';
import { Rates } from '../rates/rates';
import { Contacts } from '../contacts/contacts';
import { Wallet } from '../wallet/wallet';
import { News } from '../news/news';
import { Profile } from '../profile/profile';


/**
 * Generated class for the Dashboard page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class Dashboard {

  tab1Root = Rates;
  tab2Root = Contacts;
  tab3Root = Wallet;
  tab4Root = News;
  tab5Root = Profile;
  
  constructor(private appCtrl: App, public navCtrl: NavController, public navParams: NavParams, 
    public authService: AuthService) {

    // if (this.authService.isLoggedIn()) { 
    //   console.log("user: ",this.authService.user);
    // } else {
    //   console.log("nt auth");
    //   this.authService.logout();
    //   this.appCtrl.getRootNav().setRoot(Welcome);
    // }
  }

  ionViewCanEnter(){
    console.log("can enter");
    return this.authService.isLoggedIn();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad Dashboard');
  }

}
