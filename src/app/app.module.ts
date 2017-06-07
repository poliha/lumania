import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { Contacts} from '@ionic-native/contacts';
import { Http } from '@angular/http';

// Import pages
import { Lumania } from './app.component';
import { Welcome } from '../pages/welcome/welcome';
import { Login } from '../pages/login/login';
import { Signup } from '../pages/signup/signup';
import { PasswordReset } from '../pages/password-reset/password-reset';
import { Dashboard } from '../pages/dashboard/dashboard';
import { Rates } from '../pages/rates/rates';
import { ContactsPage } from '../pages/contacts/contacts';
import { Wallet } from '../pages/wallet/wallet';
import { News } from '../pages/news/news';
import { Profile } from '../pages/profile/profile';
import { ProfileMenu } from '../pages/profile-menu/profile-menu';
import { ProfileEdit } from '../pages/profile-edit/profile-edit';
import { VerifyEmail } from '../pages/verify-email/verify-email';
import { ChooseImagePage } from '../pages/choose-image-page/choose-image-page';
import { PaymentMethod } from '../pages/payment-method/payment-method';
import { CardPayment } from '../pages/card-payment/card-payment';
import { Sell } from '../pages/sell/sell';
import { Send } from '../pages/send/send';
import { Buy } from '../pages/buy/buy';
import { AccountDetails } from '../pages/account-details/account-details';
import { LinkAccount } from '../pages/link-account/link-account';
import { ChangePassword } from '../pages/change-password/change-password';
import { ChangePin } from '../pages/change-pin/change-pin';
import { AccountRecovery } from '../pages/account-recovery/account-recovery';
import { SupportChannels } from '../pages/support-channels/support-channels';
import { AccountVerification } from '../pages/account-verification/account-verification';
import { BankDetails } from '../pages/bank-details/bank-details';
import { ContactForm } from '../pages/contact-form/contact-form';
import { ClaimLumensPage } from '../pages/claim-lumens/claim-lumens';
import { ViewContactPage } from '../pages/view-contact/view-contact';
import { EditContactPage } from '../pages/edit-contact/edit-contact';
import { AddContactPage } from '../pages/add-contact/add-contact';
import { TransferLumensPage } from '../pages/transfer-lumens/transfer-lumens';

// Import providers
import { AuthService } from '../providers/auth-service';
import { Utility } from '../providers/utility';
import { Api } from '../providers/api';
import { Lapi } from '../providers/lapi';
import { PaymentService } from '../providers/payment-service';
import { LoadingService } from '../providers/loading-service';
import { AlertService } from '../providers/alert-service';
import { StellarService } from '../providers/stellar-sdk';
import { ContactService } from '../providers/contact-service';
import { ToastService } from '../providers/toast-service';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { InAppBrowser } from '@ionic-native/in-app-browser';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

// cloud settings for ionic cloud
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '76eb94b4'
  }
};

// array of all pages
let pages = [
    Lumania,
    Welcome,
    Signup,
    Login,
    PasswordReset,
    Dashboard,
    Rates,
    ContactsPage,
    Wallet,
    News,
    Profile,
    ProfileMenu,
    VerifyEmail,
    ProfileEdit,
    ChooseImagePage,
    PaymentMethod,
    CardPayment,
    Sell,
    Send,
    Buy,
    LinkAccount,
    AccountDetails,
    ChangePassword,
    ChangePin,
    AccountRecovery,
    SupportChannels,
    AccountVerification,
    BankDetails,
    ContactForm,
    ClaimLumensPage,
    ViewContactPage,
    EditContactPage,
    AddContactPage,
    TransferLumensPage
  ];

// config array
let configOptions = {
  production: true,
  stellarProduction: false,
  defaultCurrency: 'NGN',
  stellarLiveNetwork: 'https://testnet.stellar.org',
  stellarTestNetwork: 'https://horizon-testnet.stellar.org',
  currencyList: ['BTC','NGN','USD','EUR','GBP','ZAR','KES','GHS'],
  apiLiveUrl: 'https://lumania.tech:8888',
  apiTestUrl: 'http://localhost:8888',
}

@NgModule({
  declarations: pages,
  imports: [
    BrowserModule,
    IonicModule.forRoot(Lumania, configOptions),
    CloudModule.forRoot(cloudSettings),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['sqlite', 'websql', 'indexeddb']
    }),
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
    Utility,
    Api,
    Lapi,
    PaymentService,
    LoadingService,
    AlertService,
    StellarService,
    ContactService,
    ToastService,
    File,
    Transfer,
    Camera,
    FilePath,
    InAppBrowser,
    Contacts
  ]
})
export class AppModule {}
