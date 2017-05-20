import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountRecovery } from './account-recovery';

@NgModule({
  declarations: [
    AccountRecovery,
  ],
  imports: [
    IonicPageModule.forChild(AccountRecovery),
  ],
  exports: [
    AccountRecovery
  ]
})
export class AccountRecoveryModule {}
