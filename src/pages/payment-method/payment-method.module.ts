import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentMethod } from './payment-method';

@NgModule({
  declarations: [
    PaymentMethod,
  ],
  imports: [
    IonicPageModule.forChild(PaymentMethod),
  ],
  exports: [
    PaymentMethod
  ]
})
export class PaymentMethodModule {}
