import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferLumensPage } from './transfer-lumens';

@NgModule({
  declarations: [
    TransferLumensPage,
  ],
  imports: [
    IonicPageModule.forChild(TransferLumensPage),
  ],
  exports: [
    TransferLumensPage
  ]
})
export class TransferLumensPageModule {}
