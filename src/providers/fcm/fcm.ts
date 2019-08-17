import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserData } from '../user-data';
import { Platform } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';
import { Device } from '@ionic-native/device';

/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {

  constructor(public http: HttpClient, public platform: Platform,
              private _userData: UserData, public firebaseNative: Firebase,
              private device: Device) {
    console.log('Hello FcmProvider Provider');
  }

  getUserId() {
    this._userData.getUserData().then((userDetails) => {
      return userDetails.id;
    });
  }

  async getToken() {
    let token;

    if(this.platform.is('android')) {
      token = await this.firebaseNative.getToken()
      .then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
      .catch(error => {
        this.firebaseNative.onTokenRefresh()
        .subscribe((token: string) => console.log(`Got a new token ${token}`));
        console.error('Error getting token', error)
      });;
    }

    if(this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    }

    if(!this.platform.is('cordova')) {
      //For web apps
    } 
    return token;
  }

  

  getDeviceData() {
    return this.device;
  }

  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen()
  } 
}
