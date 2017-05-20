import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

/*
  Generated class for the LoadingService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LoadingService {
	loading: any;
  constructor(public loadingCtrl: LoadingController) {
    console.log('Hello LoadingService Provider');
  }

  showLoader(message, duration?: number){
     this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.present();

    if (duration) {
    	setTimeout(() => {
		    this.loading.dismiss();
		  }, duration);
    }
  }

  hideLoader(){
  	this.loading.dismiss();
  }

  hideAll(){
    this.loading.dismissAll();
  }
}
