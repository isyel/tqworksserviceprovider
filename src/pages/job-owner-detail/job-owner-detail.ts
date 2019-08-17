import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {UserModel} from "../../models/user-model";

@Component({
  selector: 'page-job-owner-detail',
  templateUrl: 'job-owner-detail.html'
})
export class JobOwnerDetailPage {
  jobOwner: UserModel;
  TEST: boolean;
  toUser : {toUserId: string, toUserName: string};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.TEST = true;
  }

  ionViewWillEnter() {
    this.jobOwner = this.navParams.data.jobOwnerDetails;
  }

  goToSessionDetail(session: any) {
    this.navCtrl.push('SessionDetailPage', { sessionId: session.id });
  }

  goToChatPage(phoneNumber) {
    window.open('sms:' + phoneNumber);
  }

  callClient(phoneNumber) {
    window.open('tel:' + phoneNumber);
  }

  goToMail(email) {
    window.open('mailto:' + email);
  }
}
