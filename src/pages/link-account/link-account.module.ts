import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LinkAccount } from './link-account';

@NgModule({
  declarations: [
    LinkAccount,
  ],
  imports: [
    IonicPageModule.forChild(LinkAccount),
  ],
  exports: [
    LinkAccount
  ]
})
export class LinkAccountModule {}
