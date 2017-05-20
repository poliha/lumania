import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactForm } from './contact-form';

@NgModule({
  declarations: [
    ContactForm,
  ],
  imports: [
    IonicPageModule.forChild(ContactForm),
  ],
  exports: [
    ContactForm
  ]
})
export class ContactFormModule {}
