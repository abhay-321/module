import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxTimerModule } from "ngx-timer";
import { TwilioVideoRoutingModule } from './twilio-video-routing.module';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { CameraComponent } from './camera/camera.component';
import { UserGuidelinesComponent } from './camera/user-guidelines/user-guidelines.component';
import { WebcamBlockedStepsComponent } from './camera/user-guidelines/webcam-blocked-steps/webcam-blocked-steps.component';
import { ParticipantsComponent } from './participants/participants.component';
import { EndVisitScreenComponent } from './end-visit-screen/end-visit-screen.component';


@NgModule({
  declarations: [
    WaitingRoomComponent,
    CameraComponent,
    UserGuidelinesComponent,
    WebcamBlockedStepsComponent,
    ParticipantsComponent,
    EndVisitScreenComponent
  ],
  imports: [
    CommonModule,
    NgxTimerModule,
    TwilioVideoRoutingModule
  ],
  exports: [WaitingRoomComponent, ParticipantsComponent, EndVisitScreenComponent]
})
export class TwilioVideoModule { }
