import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardPayment } from './card-payment';

@NgModule({
  declarations: [
    CardPayment,
  ],
  imports: [
    IonicPageModule.forChild(CardPayment),
  ],
  exports: [
    CardPayment
  ]
})
export class CardPaymentModule {}
