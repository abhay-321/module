import { TestBed } from '@angular/core/testing';

import { MdTwilioVideoService } from './md-twilio-video.service';

describe('MdTwilioVideoService', () => {
  let service: MdTwilioVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MdTwilioVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
