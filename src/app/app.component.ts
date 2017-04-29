import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Welcome } from '../pages/welcome/welcome';
import { TranslateService } from 'ng2-translate/ng2-translate';


@Component({
  templateUrl: 'app.html'
})
export class Lumania {
  rootPage:any = Welcome;

  constructor(translate: TranslateService, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    // Set the default language for translation strings, and the current language.
    translate.setDefaultLang('en');
    translate.use('en')

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
