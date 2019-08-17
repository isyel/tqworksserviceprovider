import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SupportPage} from "../support/support";
import {AboutPage} from "../about/about";
import {UserData} from "../../providers/user-data";
import { NotificationService } from '../../providers/services/notification-service';
import { Device } from '@ionic-native/device';
import { PlatformEnum } from '../../enum/PlatformEnum';
import { ProfilePerformancePage } from '../profile-performance/profile-performance';
import { Common } from '../../app/app.common';
import { UserService } from '../../providers/services/user-service';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public userData: UserData,
              private _notificationsService: NotificationService, private deviceData: Device,
              public _common: Common, public _userService: UserService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  goToAbout() {
    this.navCtrl.push(AboutPage);
  }

  goToHelp() {
    this.navCtrl.push(SupportPage);
  }

  goToEditProfile() {
    this.navCtrl.push(ProfilePerformancePage);
  }

  goToSupport() {
    this.navCtrl.push(SupportPage);
  }


  updatePushNotificationStatus() {
    let credentials = {uuid: this.deviceData.uuid, 
      appType: PlatformEnum.ProviderMobileApp, status: this.userData.PUSH_NOTIFICATION}
    this._notificationsService.pauseNotifications(credentials).subscribe((result) => {
      this._common.showToast(result.message);
    }, 
    error => {
      console.log("Error Changing Push Notifications Status: ", error);
    });
  }

  getURL(settingsKey) {
    this._userService.getSettingsByKey(settingsKey).subscribe(
      (result) => {
        this.goToLink(result.value);
        console.log("Url Value: ", result.value);
      },
      error => {
        console.log(error);
      },
      () => {
      });
  }

  goToLink(url) {
    window.open(url, 'location=yes');
  }


}
