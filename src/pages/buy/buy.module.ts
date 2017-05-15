import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Buy } from './buy';

@NgModule({
  declarations: [
    Buy,
  ],
  imports: [
    IonicPageModule.forChild(Buy),
  ],
  exports: [
    Buy
  ]
})
export class BuyModule {}
