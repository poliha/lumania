import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Rates } from './rates';

@NgModule({
  declarations: [
    Rates,
  ],
  imports: [
    IonicPageModule.forChild(Rates),
  ],
  exports: [
    Rates
  ]
})
export class RatesModule {}
