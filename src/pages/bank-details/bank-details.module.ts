import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BankDetails } from './bank-details';

@NgModule({
  declarations: [
    BankDetails,
  ],
  imports: [
    IonicPageModule.forChild(BankDetails),
  ],
  exports: [
    BankDetails
  ]
})
export class BankDetailsModule {}
