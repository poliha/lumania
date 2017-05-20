import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountVerification } from './account-verification';

@NgModule({
  declarations: [
    AccountVerification,
  ],
  imports: [
    IonicPageModule.forChild(AccountVerification),
  ],
  exports: [
    AccountVerification
  ]
})
export class AccountVerificationModule {}
