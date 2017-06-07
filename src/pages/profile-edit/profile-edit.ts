import { Component } from '@angular/core';
import { ActionSheetController, Platform, IonicPage, ToastController, NavController, NavParams, PopoverController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { LoadingService } from '../../providers/loading-service';
import { ChooseImagePage } from '../choose-image-page/choose-image-page'
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Lapi } from '../../providers/lapi';
import { AlertService } from '../../providers/alert-service';
import { Config } from 'ionic-angular';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEdit {
	account: {firstname: string, surname: string, email: string,  image: string} = {
		'email': "",
  	'image': "",
  	'firstname': "",
    'surname' : ""
  };
  selectedImage: string;
   lastImage: string = null;
   url: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private camera: Camera, private transfer: Transfer,  public toastCtrl: ToastController,
    private file: File, private filePath: FilePath,  public loadingService: LoadingService,
    public actionSheetCtrl: ActionSheetController, public lapi: Lapi,
    public platform: Platform, public alertService: AlertService, public config: Config,
  	public chooseImageCtrl: PopoverController, public authService: AuthService) {
     this.getDetails();
     this.url = this.config.get('production') ? this.config.get('apiLiveUrl') : this.config.get('apiTestUrl');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileEdit');
  }

  getDetails(){
    let nameSplit =  this.authService.user.details.name.split(" ");
    this.account.firstname = nameSplit[0];
    this.account.surname = nameSplit[1];
    this.account.image = this.authService.user.details.image;
    this.account.email = this.authService.user.details.email;
  }

  public presentActionSheet() {
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
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
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

  public uploadImage() {
    // Destination URL
    var url =  this.url+"/upload/image";

    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);

    // File name only
    var filename = this.lastImage;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename,
                'uploadType': 1, //upload type: 1,2 or 3.. profile, passport, passportHolding
                'token': this.authService.getLapiToken(),
                'uuid': this.authService.getUuid() },
      headers : {'Authorization': 'Bearer ' + this.authService.getLapiToken()}
    };

    const fileTransfer: TransferObject = this.transfer.create();

    this.loadingService.showLoader('Uploading...');


    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {

      console.log(data);
      let userObj = JSON.parse(data.response);
      console.log(userObj);
      // save image url to ionic
      this.authService.user.details.image = userObj.content.data.profile_image;
      return this.authService.saveUser();
    }, err => {

      console.log(err);
      this.loadingService.hideAll();
      this.presentToast('Error while uploading file.');

    })
    .then(data => {
      this.loadingService.hideAll();
      console.log(data);
      this.presentToast('Image succesful uploaded.');
      this.navCtrl.pop();
    }, err => {
      console.log(err);
      this.loadingService.hideAll();
      this.presentToast('Error while uploading file.');
    });

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

  doEdit(){

    if (this.lastImage) {
      this.uploadImage();
    } else {
      this.alertService.basicAlert("Success", "Data Saved" ,"Ok");
      this.navCtrl.pop();
    }

    // let name = this.account.firstname+" "+this.account.surname;
    // let options = {
    //     'firstname': this.account.firstname,
    //     'surname': this.account.surname,
    //     'email': this.account.email,
    //     'token': this.authService.getLapiToken(),
    //     'uuid': this.authService.getUuid()
    // };

    // this.authService.saveProfileData(name, this.account.email)
    //     .then(()=>{

    //       this.lapi.saveProfileData(options)
    //         .map(res => res.json())
    //         .subscribe((resp) => {
    //               console.log(resp);
    //               this.alertService.basicAlert("Success", resp.content.message.join('. ') ,"Ok");

    //          },
    //          (err:any)=>{
    //           // to do add toast
    //               console.log(err.json());
    //               let errorObj = err.json();
    //               this.alertService.basicAlert("Error", errorObj.content.message.join('. ') ,"Ok");

    //         });


    //     })

  }
}
