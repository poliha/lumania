import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Wallet } from './wallet';

@NgModule({
  declarations: [
    Wallet,
  ],
  imports: [
    IonicPageModule.forChild(Wallet),
  ],
  exports: [
    Wallet
  ]
})
export class WalletModule {}
