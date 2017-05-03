import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';


import { Http } from '@angular/http';

import { Lumania } from './app.component';
import { Welcome } from '../pages/welcome/welcome';
import { Login } from '../pages/login/login';
import { Signup } from '../pages/signup/signup';
import { PasswordReset } from '../pages/password-reset/password-reset';
import { Dashboard } from '../pages/dashboard/dashboard';
import { Rates } from '../pages/rates/rates';
import { Contacts } from '../pages/contacts/contacts';
import { Wallet } from '../pages/wallet/wallet';
import { News } from '../pages/news/news';
import { Profile } from '../pages/profile/profile';


import {AuthService} from '../providers/auth-service';
import {Utility} from '../providers/utility';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '76eb94b4'
  }
};

let pages = [
    Lumania,
    Welcome,
    Signup,
    Login,
    PasswordReset,
    Dashboard,
    Rates,
    Contacts,
    Wallet,
    News,
    Profile
  ];

@NgModule({
  declarations: pages,
  imports: [
    BrowserModule,
    IonicModule.forRoot(Lumania),
    CloudModule.forRoot(cloudSettings),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: pages,
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    Utility
  ]
})
export class AppModule {}
