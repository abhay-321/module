import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  isConnectionEstablished: boolean = false;
  isConnection: boolean = false;

  constructor() { }

  setIsConnectionEstablished(flag) {
    this.isConnectionEstablished = flag;
  }

  getIsConnectionEstablished(): boolean {
    return this.isConnectionEstablished;
  }

  setInternetConnectionFlag(flag) {
    this.isConnection = flag;
  }

  getInternetConnectionFlag(): boolean {
    return this.isConnection;
  }

}
