import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MdTwilioVideoComponent } from './md-twilio-video.component';
import { TwilioVideoModule } from './visit/twilio-video/twilio-video.module';


@NgModule({
  declarations: [
    MdTwilioVideoComponent
  ],
  imports: [
    TwilioVideoModule,
    HttpClientModule
  ],
  exports: [
    MdTwilioVideoComponent
  ]
})
export class MdTwilioVideoModule { }
