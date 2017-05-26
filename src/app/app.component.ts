import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Welcome } from '../pages/welcome/welcome';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Lapi } from '../providers/lapi';
import { ContactService } from '../providers/contact-service';

@Component({
  templateUrl: 'app.html'
})
export class Lumania {
  rootPage:any = Welcome;

  constructor(translate: TranslateService, platform: Platform, 
    statusBar: StatusBar, splashScreen: SplashScreen, public lapi: Lapi, 
    public contactService: ContactService) {
    // Set the default language for translation strings, and the current language.
    translate.setDefaultLang('en');
    translate.use('en')

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.lapi.getRates()
        .then((resp)=>{
        // this.loadingService.hideLoader();
        console.log(resp);
        // this.rates = resp;
        // this.getBalance();

        // this.calculateBalances();
      })
      .catch((err) => {
          // this.loadingService.hideLoader();
          // to do add toast
          console.log("error",err);
  
      });

    this.contactService.findAll().then((contacts)=>{

    })
    .catch((err) => {
        // this.loadingService.hideLoader();
        // to do add toast
        console.log("error",err);

    });
  }
}
