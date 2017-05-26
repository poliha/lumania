import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClaimLumensPage } from './claim-lumens';

@NgModule({
  declarations: [
    ClaimLumensPage,
  ],
  imports: [
    IonicPageModule.forChild(ClaimLumensPage),
  ],
  exports: [
    ClaimLumensPage
  ]
})
export class ClaimLumensPageModule {}
