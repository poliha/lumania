import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifyEmail } from './verify-email';

@NgModule({
  declarations: [
    VerifyEmail,
  ],
  imports: [
    IonicPageModule.forChild(VerifyEmail),
  ],
  exports: [
    VerifyEmail
  ]
})
export class VerifyEmailModule {}
