import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import {
  CameraComponent
} from '../camera/camera.component';
import {
  connect,
  ConnectOptions,
  Room,
  VideoTrack
} from 'twilio-video';
import {
  HttpClient
} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'lib-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.css']
})
export class WaitingRoomComponent implements OnInit {

  @ViewChild('camera', { static: false }) camera: CameraComponent;


  isCameraEnabled: boolean = false;
  isCameraBlocked: boolean = false;
  providerName: string;
  response: any;
  participants: any;
  roomResponse: any;
  isAdmitOrDeny: boolean = false;
  isWatingRoom: boolean = true;
  participantsNames: [];
  participantsNamesLength: number;
  participantsInitials: string[] = [];
  initial: string;
  loader: boolean = true;
  testData: any;

  LocalVideoTrack: VideoTrack;
  constructor(private readonly http: HttpClient, private router: Router) {
  }

  ngOnInit() {
  }

  async enableCamera() {
    this.isCameraEnabled = true;
    this.testData = await this.createRoom();
    console.log("TestDataaa ", this.testData);
    this.showLoader();
  }

  joinAppointment() {
    this.isCameraEnabled = true;
    this.isWatingRoom = false;
  }

  getDeviceInitResult(event) {
    this.isCameraBlocked = !event;
  }

  async onSettingsChanged(deviceInfo: MediaDeviceInfo) {
    await this.camera.initializePreview(deviceInfo);
  }


  async createRoom(){

    let room: Room = null;
    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzM2NTU0M2IwMzIyYmJlZWVjZGIzOGI5ZWQyMDZlNTBiLTE2NDkxNDcwMDUiLCJncmFudHMiOnsiaWRlbnRpdHkiOiItYWFhIiwidmlkZW8iOnsicm9vbSI6ImNvb2wifX0sImlhdCI6MTY0OTE0NzAwNSwiZXhwIjoxNjQ5MTUwNjA1LCJpc3MiOiJTSzM2NTU0M2IwMzIyYmJlZWVjZGIzOGI5ZWQyMDZlNTBiIiwic3ViIjoiQUNiZmYwYjk5MWNlN2FlZmQyZWIwMGFiMTRiZGI1MGI2ZCJ9.n1rpV8qz4vgmrui5fqOXs-rEA1xFXbtUFjhD_UT9mjk';
      room = await connect(token, {
        // tracks,
        name:'cool',
        networkQuality: {
          local: 2,
          remote: 1
        },
        audio: true,
        video: { width: 640 },
        preferredVideoCodecs: ['H264', 'VP8']
      } as ConnectOptions);
      console.log("Room participants", room.participants);  
    } catch (error) {
      console.error(`Unable to connect to Room: ${error.message}`);
    }
    

    //return room;
    // this.http.post(`Http://localhost:8099/mock/Room`, '{"UniqueName":"TestUniqueName"}').subscribe(res => {
    //   this.roomResponse = JSON.stringify(res);
    //   this.roomResponse = JSON.parse(this.roomResponse);
    try{
      this.getParticipant(room.participants);
    }catch(e){
      console.error(`Unable to get participants: ${e.message}`);

    }
    // })
    return room;
  }



  getParticipant(active_participants:any) {

    // this.http.get(`http://localhost:8099/mock/Participants?value=3&unique_name=` + unique_name).subscribe(res => {
    this.participants = JSON.stringify(active_participants);
    this.participants = JSON.parse(this.participants);
    this.participantsNames = this.getParticipantDetails(this.participants);
    this.getParticipantInitials();
    //   return this.response;
    // })
  }

  getParticipantInitials() {
    if (this.participantsNames) {
      this.participantsNamesLength = this.participantsNames.length;
      for (let i = 0; i < this.participantsNamesLength; i++) {
        if (i > 2 && this.participantsNamesLength != 4) {
          this.initial = '+' + (this.participantsNamesLength - i).toString();
          this.participantsInitials.push(this.initial);
          break;
        }
        this.initial = this.participantsNames[i];
        if (!this.initial && i == 0) {
          this.participantsNamesLength = 0;
          return;
        }
        this.initial = this.initial.charAt(0).toUpperCase();
        this.participantsInitials.push(this.initial);
      }
    }
  }

  getParticipantDetails(participants: any) {
    const participantsNames = participants.map(person => person.identity);
    return participantsNames;
  }
  showLoader() {
    setTimeout(() => this.offLoader(), 1500);
  }

  offLoader() {
    this.loader = false;
  }

  getLoader() {
    return this.loader;
  }

}
