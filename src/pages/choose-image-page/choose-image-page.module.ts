import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseImagePage } from './choose-image-page';

@NgModule({
  declarations: [
    ChooseImagePage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseImagePage),
  ],
  exports: [
    ChooseImagePage
  ]
})
export class ChooseImagePageModule {}
