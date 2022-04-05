import {
  AfterViewInit, Component, ElementRef, EventEmitter,
  OnInit,
  Output, Renderer2, ViewChild
} from "@angular/core";
import {
  createLocalTracks,
  LocalTrack,
  LocalVideoTrack,
  Room
} from "twilio-video";
import { DeviceService } from "../service/device.service";

@Component({
  selector: 'lib-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit, AfterViewInit {

  @ViewChild("preview", { static: false }) previewElement: ElementRef;
  @Output("deviceInitialized") deviceInitialized = new EventEmitter<boolean>();

  isVideoMuted = false;
  isAudioMuted = false;
  showTooltip: boolean;
  private activeRoom: Room;

  get tracks(): LocalTrack[] {
    return this.localTracks;
  }

  isInitializing: boolean;

  private videoTrack: LocalVideoTrack;
  private localTracks: LocalTrack[] = [];

  constructor(
    private readonly renderer: Renderer2,
    private deviceService: DeviceService,
  ) { }

  ngOnInit() {
    this.showTooltip = false;
    this.isInitializing = true;
  }

  async ngAfterViewInit() {
    if (this.previewElement && this.previewElement.nativeElement) {
      this.deviceService.deviceGrantedStatus.subscribe((res) => {
        if (res === "granted") { this.showTooltip = false; }
        else { this.showTooltip = true; }
      });
      await this.initializeDevice();
    }
  }

  initializePreview(deviceInfo?: MediaDeviceInfo) {
    if (deviceInfo) {
      this.initializeDevice(deviceInfo.kind, deviceInfo.deviceId);
    } else {
      this.initializeDevice();
    }
  }

  finalizePreview() {
    try {
      if (this.videoTrack) {
        this.videoTrack.detach().forEach((element) => element.remove());
      }
    } catch (e) {
      console.error(e);
    }
  }

  private async initializeDevice(kind?: MediaDeviceKind, deviceId?: string) {
    try {
      this.isInitializing = true;

      this.finalizePreview();

      if (kind && deviceId) {
        this.initializeTracks(kind, deviceId).then(
          (res) => {
            this.renderLocalTracks(res);
            this.deviceInitialized.emit(true);
          },
          (err) => {
            this.deviceInitialized.emit(false);
          }
        );
      } else {
        this.initializeTracks().then(
          (res) => {
            this.renderLocalTracks(res);
            this.deviceInitialized.emit(true);
          },
          (err) => {
            this.deviceInitialized.emit(false);
          }
        );
      }
    } finally {
      //this.isInitializing = false;
    }
  }

  private initializeTracks(kind?: MediaDeviceKind, deviceId?: string) {
    if (kind) {
      switch (kind) {
        case "audioinput":
          return createLocalTracks({
            audio: {
              deviceId,
            },
            video: true,
          });

        case "videoinput":
          return createLocalTracks({
            audio: true,
            video: {
              deviceId,
            },
          });
      }
    }

    return createLocalTracks({
      audio: true,
      video: {
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
      },
    });
  }

  private renderLocalTracks(localTracks) {
    this.localTracks = localTracks;
    this.videoTrack = this.localTracks.find(
      (t) => t.kind === "video"
    ) as LocalVideoTrack;
    const videoElement = this.videoTrack.attach();
    this.renderer.setStyle(videoElement, "width", "100%");
    this.renderer.appendChild(this.previewElement.nativeElement, videoElement);
    this.isInitializing = false;
  }

}
