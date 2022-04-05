import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-webcam-blocked-steps',
  templateUrl: './webcam-blocked-steps.component.html',
  styleUrls: ['./webcam-blocked-steps.component.css']
})
export class WebcamBlockedStepsComponent implements OnInit {


  browser: string;

  constructor() { }

  ngOnInit() {
    this.detectBrowser();
  }

  detectBrowser() {
    const agent = window.navigator.userAgent.toLowerCase()
    if (agent.indexOf('chrome') > -1 && !!(<any>window).chrome) {
      this.browser = 'chrome';
    } else if (agent.indexOf('firefox') > -1) {
      this.browser = 'firefox';
    } else if (agent.indexOf('safari') > -1) {
      this.browser = 'safari';
    } else {
      this.browser = 'NA';
    }
  }

}
