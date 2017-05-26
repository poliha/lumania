import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { Lapi } from '../../providers/lapi';
import { LoadingService } from '../../providers/loading-service';
import { AlertService } from '../../providers/alert-service';
import { InAppBrowser } from '@ionic-native/in-app-browser';


@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class News {
	newsList = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public loadingService: LoadingService, public lapi: Lapi, public alertService: AlertService,
  	public authService: AuthService, private iab: InAppBrowser) {
  	  let opts = {
        "token": this.authService.getLapiToken(),
        "uuid":  this.authService.getUuid(),

      };
      this.loadingService.showLoader("Loading News...");

  	this.lapi.getNews(opts)
  	      .map(res => res.json())
          .subscribe((resp) => {
            this.loadingService.hideLoader();
                console.log(resp);
                this.newsList = resp.content.data;

              },
              (err) => {
                // to do add toast
                console.log(err.json());
                // let errorObj = err.json();
                // messages.push(errorObj.content.message[0]);
                // throw new Error("not saved");
                // this.alertService.basicAlert("Error", errorObj.content.message[0] ,"Ok");

              });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad News');
  }

  load(url){
    this.iab.create(url,"_self");
  }





}
