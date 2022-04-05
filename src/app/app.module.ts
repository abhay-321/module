import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MdTwilioVideoModule } from '../../projects/md-twilio-video/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MdTwilioVideoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
