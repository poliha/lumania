import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, App } from 'ionic-angular';
import { ProfileMenu } from '../profile-menu/profile-menu';
import { ProfileEdit } from '../profile-edit/profile-edit';
import { AuthService } from '../../providers/auth-service';
import { Welcome } from '../welcome/welcome';
import { ChangePassword } from '../change-password/change-password';
import { ChangePin } from '../change-pin/change-pin';
import { AccountRecovery } from '../account-recovery/account-recovery';
import { SupportChannels } from '../support-channels/support-channels';
import { AccountVerification } from '../account-verification/account-verification';
import { BankDetails } from '../bank-details/bank-details';
import { AccountDetails } from '../account-details/account-details';
import { ClaimLumensPage } from '../claim-lumens/claim-lumens';


/**
 * Generated class for the Profile page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class Profile {

  constructor(private appCtrl: App, public navCtrl: NavController, public navParams: NavParams,
  	public popoverCtrl: PopoverController, public authService: AuthService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Profile');
  }

  showMenu(openMenuEvent) {
    let popover = this.popoverCtrl.create(ProfileMenu);
    popover.present({
    	ev: openMenuEvent
    });
  }
  editProfile(){
    this.navCtrl.push(ProfileEdit);
  }

  changePassword(){
    this.navCtrl.push(ChangePassword);
  }

  changePin(){
    this.navCtrl.push(ChangePin);
  }

  accountRecovery(){
    this.navCtrl.push(AccountRecovery);
  }

  supportChannels(){
    this.navCtrl.push(SupportChannels);
  }

  bankDetails(){
    this.navCtrl.push(BankDetails);
  }

  accountDetails(){
    this.navCtrl.push(AccountDetails);
  }

  claimLumens(){
    this.navCtrl.push(ClaimLumensPage);
  }

  verifyAccount(){
    this.navCtrl.push(AccountVerification);
  }

  logout(){

    this.authService.logout();
    this.appCtrl.getRootNav().setRoot(Welcome);
  }

}
