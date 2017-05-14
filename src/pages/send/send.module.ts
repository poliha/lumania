import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Send } from './send';

@NgModule({
  declarations: [
    Send,
  ],
  imports: [
    IonicPageModule.forChild(Send),
  ],
  exports: [
    Send
  ]
})
export class SendModule {}
