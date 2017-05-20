import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { Lapi } from '../../providers/lapi';
import { LoadingService } from '../../providers/loading-service';
import { AlertService } from '../../providers/alert-service';


@IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class News {
	newsList = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  	public loadingService: LoadingService, public lapi: Lapi, public alertService: AlertService,
  	public authService: AuthService) {
  	  let opts = {
        "token": this.authService.getLapiToken(),
        "uuid":  this.authService.getUuid(),

      };

  	this.lapi.getNews(opts)
  	      .map(res => res.json())
          .subscribe((resp) => {
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





}
