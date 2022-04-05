import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { connect, ConnectOptions, createLocalTracks, LocalAudioTrack, LocalTrack, LocalVideoTrack, Room } from 'twilio-video';
import { CountupTimerService, countUpTimerConfigModel, timerTexts } from 'ngx-timer';
import Swal from 'sweetalert2';
import { DeviceService } from "../service/device.service"; import { CommonService } from '../service/common.service';

@Component({
  selector: 'lib-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {
  @ViewChild('localParticipant', { static: true }) localParticipant: any;
  testConfig;
  @Input('parentData') public activeRoom: Room;

  testCHeck: any;
  constructor(private readonly renderer: Renderer2,
    private countupTimerService: CountupTimerService,
    public _common: CommonService, private changeDetector: ChangeDetectorRef) {

    this.testConfig = new countUpTimerConfigModel();

    //custom class
    this.testConfig.timerClass = 'test_Timer_class';

    //timer text values  
    this.testConfig.timerTexts = new timerTexts();
    this.testConfig.timerTexts.hourText = ":"; //default - hh
    this.testConfig.timerTexts.minuteText = ":"; //default - mm
    this.testConfig.timerTexts.secondsText = " "; //default - ss 
    this.countupTimerService.startTimer();
  }

  private videoTrack: LocalVideoTrack;
  private audioTrack: LocalAudioTrack;
  private localTracks: LocalTrack[] = [];
  isAudioMuted = false;
  isVideoMuted = false;
  isVisitConcluded = false;
  isHost = false;
  isShowleaveMeet = false;
  isDisplay = false;
  view: string = 'max';
  isOffline: boolean = false;


  async ngOnInit() {

    this.createLocalTracks1();
    this.getTracks();
    this.initializeParticipant();
  }


  createLocalTracks1() {
    return createLocalTracks({
      audio: true,
      video: {
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
      },
    });
  }

  getTracks() {
    this.createLocalTracks1().then(
      (res) => {
        this.renderLocalTracks(res);
      }
    );
  }

  private renderLocalTracks(localTracks) {
    this.localTracks = localTracks;
    this.videoTrack = this.localTracks.find(
      (t) => t.kind === "video"
    ) as LocalVideoTrack;

    this.audioTrack = this.localTracks.find(
      (t) => t.kind === 'audio'
    ) as LocalAudioTrack;

    const videoElement = this.videoTrack.attach();
    this.renderer.setStyle(videoElement, 'width', '100%');
    this.renderer.setAttribute(videoElement, 'id', 'local-preview')
    this.renderer.appendChild(this.localParticipant.nativeElement, videoElement);
  }

  toggleVideo() {
    this.isVideoMuted = !this.isVideoMuted;
    if (this.isVideoMuted == false) {
      const videoElement = this.videoTrack.enable();
    }
    else {
      const videoElement = this.videoTrack.disable();
    }
  }

  toggleAudio() {
    this.isAudioMuted = !this.isAudioMuted;
    if (this.isAudioMuted == false) {
      this.audioTrack.enable();
    }
    else {
      this.audioTrack.disable();
    }
  }

  endVisit() {
    this.isVisitConcluded = true;
    if (this.isVisitConcluded && this.isHost) {
      this.isShowleaveMeet = true;
    }
    if (this.isShowleaveMeet == true && this.isHost == false) {
    }
    this.finalizePreview();
  }

  finalizePreview() {
    try {
      if (this.videoTrack) {
        this.videoTrack.mediaStreamTrack.stop();
        const videoElement = this.videoTrack.detach().forEach(element => element.remove());
        this.localTracks = [];
      }
    } catch (e) {
      console.error(e);
    }
  }

  displayEndVisit() {
    this.isDisplay = !this.isDisplay;
  }

  display() {
    Swal.fire({
      title: 'Do you want to save the changes?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Leave Meet',
      denyButtonText: 'End Meet for all',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1 right-gap',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.endVisit();
      } else if (result.isDenied) {
        this.endVisit();
      }
    })
  }

  inviteLink() {
    Swal.fire('URL copied to clipboard');
  }

  private initializeParticipant() {
    var that = this;
    that.activeRoom.localParticipant.setNetworkQualityConfiguration({
      local: 2,
      remote: 1
    })
    // Print the initial Network Quality Level and statistics
    that.printNetworkQualityStats(that.activeRoom.localParticipant.networkQualityLevel);
    console.log("n/w", that.activeRoom.localParticipant.networkQualityLevel);

    // Print changes to Network Quality Level and statistics
    that.activeRoom.localParticipant.on('networkQualityLevelChanged', networkQualityLevel => that.printNetworkQualityStats(networkQualityLevel));
  }


  printNetworkQualityStats(networkQualityLevel) {
    if (networkQualityLevel) {
      if (networkQualityLevel == 1 || networkQualityLevel == 0 || this.isOffline) {
        this._common.setInternetConnectionFlag(true);
      } else {
        this._common.setInternetConnectionFlag(false);
      }
    }
    window.addEventListener('online', () => {
      var that = this;
      that.isOffline = false;
      that._common.setInternetConnectionFlag(false);
    });
    window.addEventListener('offline', () => {
      var that = this;
      that.isOffline = true;
      that._common.setInternetConnectionFlag(true);
    });
  }



}
