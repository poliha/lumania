import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { ChooseImagePage } from '../choose-image-page/choose-image-page'
/**
 * Generated class for the ProfileEdit page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEdit {
	account: {name: string, email: string, image: string} = {
		'email': "",
  	'image': "",
  	'name': ""
  };
  selectedImage: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
  	public chooseImageCtrl: PopoverController, public authService: AuthService) {
  	this.account.name = this.authService.user.details.name;
  	this.account.image = this.authService.user.details.image;
  	this.account.email = this.authService.user.details.email;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileEdit');
  }

  chooseImage(imgEvent){
  	let popover = this.chooseImageCtrl.create(ChooseImagePage);
    popover.present({
      ev: imgEvent
    });

    popover.onDidDismiss((popoverData) => {
      this.selectedImage = popoverData;
      this.account.image = this.selectedImage;
    })
  }
}
