import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileMenu } from './profile-menu';

@NgModule({
  declarations: [
    ProfileMenu,
  ],
  imports: [
    IonicPageModule.forChild(ProfileMenu),
  ],
  exports: [
    ProfileMenu
  ]
})
export class ProfileMenuModule {}
