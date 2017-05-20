import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupportChannels } from './support-channels';

@NgModule({
  declarations: [
    SupportChannels,
  ],
  imports: [
    IonicPageModule.forChild(SupportChannels),
  ],
  exports: [
    SupportChannels
  ]
})
export class SupportChannelsModule {}
