import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountDetails } from './account-details';

@NgModule({
  declarations: [
    AccountDetails,
  ],
  imports: [
    IonicPageModule.forChild(AccountDetails),
  ],
  exports: [
    AccountDetails
  ]
})
export class AccountDetailsModule {}
