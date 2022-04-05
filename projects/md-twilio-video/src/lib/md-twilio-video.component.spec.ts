import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdTwilioVideoComponent } from './md-twilio-video.component';

describe('MdTwilioVideoComponent', () => {
  let component: MdTwilioVideoComponent;
  let fixture: ComponentFixture<MdTwilioVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdTwilioVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MdTwilioVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
