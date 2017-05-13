import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Sell } from './sell';

@NgModule({
  declarations: [
    Sell,
  ],
  imports: [
    IonicPageModule.forChild(Sell),
  ],
  exports: [
    Sell
  ]
})
export class SellModule {}
