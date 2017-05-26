import { Component } from '@angular/core';
import { ActionSheetController, Platform, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { AlertService } from '../../providers/alert-service';
import { Lapi } from '../../providers/lapi';
import { LoadingService } from '../../providers/loading-service';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Config } from 'ionic-angular';

declare var cordova: any;


@IonicPage()
@Component({
  selector: 'page-account-verification',
  templateUrl: 'account-verification.html',
})
export class AccountVerification {

	verifyObj: any = {};
  lastImage: string = null;
  lastImage2: string = null;
  selectedImage = 0;
  url: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private camera: Camera, private transfer: Transfer,  public toastCtrl: ToastController,
    private file: File, private filePath: FilePath,  public loadingService: LoadingService,
    public actionSheetCtrl: ActionSheetController, public lapi: Lapi,
    public platform: Platform, public alertService: AlertService,
    public authService: AuthService, public config: Config) {
    this.verifyObj.holding_passport = 'assets/img/NoImage.png';
    this.verifyObj.passport_page = 'assets/img/NoImage.png';
    console.log(this.verifyObj);
    this.url = this.config.get('production') ? this.config.get('apiLiveUrl') : this.config.get('apiTestUrl');
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
      this.verifyObj.phone = this.authService.getData('phone') || '';
      this.verifyObj.country = this.authService.getData('country') || '';

  	}
  }

  public presentActionSheet(x) {
    this.selectedImage = x;
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }
   
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName)
    .then(success => {
      if (this.selectedImage == 1) {
        this.lastImage = newFileName;
      }
      if (this.selectedImage == 2) {
        this.lastImage2 = newFileName;
      }
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }
   
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
   
  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage(xImage, uploadType) {
    // Destination URL
    var url =  this.url+"/upload/image";
   
    // File for Upload
    var targetPath = this.pathForImage(xImage);
   
    // File name only
    var filename = xImage;
   
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename,
                'address': this.verifyObj.address,
                'passport_no': this.verifyObj.passport_no,
                'uploadType': uploadType, //upload type: 1,2 or 3.. profile, passport, passportHolding
                'token': this.authService.getLapiToken(),
                'uuid': this.authService.getUuid() }, 
      headers : {'Authorization': 'Bearer ' + this.authService.getLapiToken()}
    };
   
    const fileTransfer: TransferObject = this.transfer.create();
   
    this.loadingService.showLoader('Uploading...');
    
   
    // Use the FileTransfer to upload the image
    return fileTransfer.upload(targetPath, url, options)
    // .then(data => {
    //   this.loadingService.hideAll();
    //   this.presentToast('Image succesful uploaded.');
    // }, err => {
    //   this.loadingService.hideAll();
    //   this.presentToast('Error while uploading file.');
    // });
  }


  save(){
    if (this.lastImage || this.lastImage2 ) { 

        this.uploadImage(this.lastImage,2).then(
          data => {
            return this.uploadImage(this.lastImage,3);
            // this.loadingService.hideAll();
          },
          err =>{
            console.log(err);
          }
        )
        .then(
          data => {
            this.presentToast('Data saved.');
            this.loadingService.hideAll();
          },
          err =>{
            this.loadingService.hideAll();
            console.log(err);
          }
        );

    } else {
      this.loadingService.hideAll();

      this.presentToast('Please upload both images');

    }
  }


}
