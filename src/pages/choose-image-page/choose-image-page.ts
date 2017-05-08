import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import {Camera} from 'ionic-native';
/**
 * Generated class for the ChooseImagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-choose-image-page',
  templateUrl: 'choose-image-page.html',
})
export class ChooseImagePage {

	selectedImage: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseImagePage');
  }

  imageFromCamera(){
  	Camera.getPicture({
  			quality: 80,
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 400,
        targetHeight: 400,
        encodingType: Camera.EncodingType.JPEG,
  			mediaType: Camera.MediaType.PICTURE
    }).then((imageData) => {
      // imageData is a base64 encoded string
        let encodedImage = "data:image/jpeg;base64," + imageData;
        this.setSelectedImage(encodedImage);
    }, (err) => {
        console.log(err);
        // To do add toast service to show error
    });

  }

  imageFromGallery(){
  	Camera.getPicture({
  			quality: 80,
        destinationType: Camera.DestinationType.DATA_URL,
        encodingType: Camera.EncodingType.JPEG,
  			mediaType: Camera.MediaType.PICTURE,
  			sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
    }).then((imageData) => {
      // imageData is a base64 encoded string
        let encodedImage = "data:image/jpeg;base64," + imageData;
        this.setSelectedImage(encodedImage);
    }, (err) => {
        console.log(err);
        // To do add toast service to show error
    });

  }

  setSelectedImage(selectedItem) {
    this.selectedImage = selectedItem;
    this.viewCtrl.dismiss(this.selectedImage);
  }

}
