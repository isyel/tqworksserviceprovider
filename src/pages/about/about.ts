import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import { UserService } from '../../providers/services/user-service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  urlLink: string;

  constructor(public navCtrl: NavController, public _userService: UserService) { }

  goToSupport() {
    //window.open("http://tqworksng.com/help" , 'location=yes');
    // this.navCtrl.push(SupportPage);
  }

  getURL(settingsKey) {
    this._userService.getSettingsByKey(settingsKey).subscribe(
      (result) => {
        this.urlLink = result.value;
        this.goToLink(this.urlLink);
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
