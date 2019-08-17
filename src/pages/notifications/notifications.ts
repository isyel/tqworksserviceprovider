import {Component} from '@angular/core';
import { NavController, NavParams, Refresher} from 'ionic-angular';
import {UserData} from "../../providers/user-data";
import {NotificationService} from "../../providers/services/notification-service";
import {Common} from "../../app/app.common";
import {ProfilePerformancePage} from "../profile-performance/profile-performance";
import {WalletPage} from "../wallet/wallet";
import {NotificationModel} from "../../models/notification-model";
import { NotificationTypeEnum } from '../../enum/NotificationTypeEnum';
import { JobDetailPage } from '../job-detail/job-detail';
import { JobsPage } from '../jobs/jobs';

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage{
  data = { title:'', description:'', date:'', time:'' };
  hintText: string;
  public notifications: NotificationModel[] = [];
  pageNumber: number = 0;
  perPage: number = 15;
  totalData: number;
  totalPage: number;
  tempResult: any = [];
  userId: number;


  constructor(public navCtrl: NavController, public navParams: NavParams, public _userData: UserData,
              private _notificationService: NotificationService, public _common: Common) {
  }

  ngOnInit() {
    this.updateOfflineNotifications();
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad NotificationsPage');
    this.getNotifications();
  }

  getTypeImage(notificationType) {
    switch (notificationType) {
      case NotificationTypeEnum.project:
        return 'construct';
      case NotificationTypeEnum.account:
        return 'person';
      case NotificationTypeEnum.wallet:
        return 'cash';
      case NotificationTypeEnum.rating:
        return 'star-half';
      default:
        return 'notifications';
    }
  }

  updateOfflineNotifications() {
    this._userData.getSavedNotifications().then((result) => {
        if (result != null) {
          this.notifications = result;
          this.tempResult = this.notifications;
        }
        this.getNotifications();
      });
  }

  getNotifications()
  {
    this._userData.getUserId().then((userId)=> {
      this.userId = userId;
      this.pageNumber = 0;
      this._notificationService.getByUserId(userId, this.pageNumber, this.perPage).subscribe((result) => {
          if (result == null) {
            console.log('Notifications is null');
          }
          else {
            this.totalData = result.totalCount;
            this.totalPage = result.totalPages;
            this.pageNumber = result.pageIndex;
            this.notifications = result.items;
            this.setNotificationCount(this.notifications);
            this._userData.saveNotifications(this.notifications);
          }
          console.log('first pageNumber : ', this.pageNumber);
        },
        error => {
          console.log('Notifications Error: ', error.error);
        },
        () => {
          // observer.next(success);
          // observer.complete();
        });
    });
  }

  doInfinite(infiniteScroll) {
    this.pageNumber = this.pageNumber + 1;
    if(this.pageNumber < this.totalPage) {
      infiniteScroll.enable(true);
    }
    console.log('pageNumber : ', this.pageNumber);
    this._notificationService.getByUserId(this.userId, this.pageNumber, this.perPage).subscribe((result) => {
      
      infiniteScroll.complete();
      console.log('result : ', result);
      if (result == null) {
        this.hintText = 'No More Notifications';
        this._common.showToast(this.hintText);
      }
      else {
        this.totalData = result.totalCount;
        this.totalPage = result.totalPages;
        this.pageNumber = result.pageIndex;
        for(let i = 0; i < result.items.length; i++) {
          this.notifications.push(result.items[i]);
        }
        if(this.pageNumber >= this.totalPage) {
          infiniteScroll.enable(false);
        }
      }
    },
    error => {
      this.hintText = 'Network or Server Error!';
      this._common.showToast(this.hintText);
    });
  }

  goToNotificationDetails(notificationType, notificationId, jsonData) {
    this._notificationService.markAsSeen(notificationId).subscribe((result) => {
        console.log('Notification Marked As Seen', result);
      },
      error => {
        console.error('Notification Could Not Be Marked As Seen', error.message);
      },
      () => {
        // observer.next(success);
        // observer.complete();
    });
    let jobDetails = JSON.parse(jsonData);
    switch (notificationType) {
      case NotificationTypeEnum.project:
        this.navCtrl.push(JobDetailPage, { jobDetails: jobDetails, fromNotifications: true});
        return;
      case NotificationTypeEnum.jobAlert:
        this.navCtrl.push(JobsPage, { jobAlert: jobDetails, fromNotifications: true});
        return;
      case NotificationTypeEnum.account:
        this.navCtrl.push(ProfilePerformancePage);
        return;
      case NotificationTypeEnum.wallet:
        this.navCtrl.push(WalletPage);
        return;
      case NotificationTypeEnum.rating:
        this.navCtrl.push(ProfilePerformancePage, { segmentValue: 'two' });
        return;
    }
  }

  setNotificationCount(notifications) {
    let notificationCount = 0;
    notifications.forEach( (item, index) => {
      if(!item.seen) {
        notificationCount++;
      }
    });
    this._userData.addNotificationCount(notificationCount);
  }

  doRefresh(refresher: Refresher) {
    this.getNotifications();
    refresher.complete();
  }

}
