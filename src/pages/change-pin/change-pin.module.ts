import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangePin } from './change-pin';

@NgModule({
  declarations: [
    ChangePin,
  ],
  imports: [
    IonicPageModule.forChild(ChangePin),
  ],
  exports: [
    ChangePin
  ]
})
export class ChangePinModule {}
