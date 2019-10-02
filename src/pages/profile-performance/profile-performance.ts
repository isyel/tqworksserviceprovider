import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {NotificationsPage} from "../notifications/notifications";
import {UserData} from "../../providers/user-data";
import {ServiceProviderModel} from "../../models/service-provider-model";
import {RatingModel} from "../../models/rating-model";
import {ReviewsService} from "../../providers/services/reviews-service";
import {RatingTypeEnum} from "../../enum/RatingTypeEnum";
import {Common} from "../../app/app.common";
import { UserService } from '../../providers/services/user-service';

/**
 * Generated class for the ProfilePerformancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile-performance',
  templateUrl: 'profile-performance.html',
})
export class ProfilePerformancePage {

  segmentView: string = "one";
  overallRating: number;
  providerData: ServiceProviderModel;
  userEmail: string;
  username: string;
  ratings: RatingModel[] = [];
  hintText: string;
  loading: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private _userData: UserData, public _reviewsService: ReviewsService,
              private _common: Common, public _userService: UserService) {
  }

  ngOnInit() {
    this.segmentView = (this.navParams.data.segmentValue) ? this.navParams.data.segmentValue : 'one';
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePerformancePage');
    this.overallRating = 0;
    this.getuserData();
    this._userData.getProviderData().then((providerData) => {
      this.providerData = providerData;
      this.setServiceProviderDetails();
      if(this.segmentView == 'two') {
        this.updateOfflineReviews();
      }
    });
  }

  setServiceProviderDetails() {
    this._userData.getUserId().then((userId) => {
      this._userService.getProvider(userId).subscribe((result) => {
          this.providerData = result;
          this._userData.saveProvider(this.providerData).then(() => {
            console.log('Provider Data Updated');
          });
        },
        error => {
          this.hintText = 'Network or Server Error, Try Again!';
          console.log('error: ', error);
        },
        () => {
          this._common.hideLoading();
          // observer.next(success);
          // observer.complete();
        });
    });
  }

  getuserData() {
    this._userData.getUserData().then((userDetails) => {
      this.userEmail = userDetails.email;
    });
  }

  updateOfflineReviews() {
    this.loading = true;
    this._userData.getSavedReviews().then((reviews) => {
      console.log('Reviews : ', reviews);
        if (reviews != null && reviews.length > 0) {
          console.log('Reviews exist');
          this.ratings = reviews;
        } 
        //this.getReviews();
      });
  }

  getReviews() {
    this.loading = true;
    this._reviewsService.getAll(this.providerData.id, RatingTypeEnum.serviceProvider).subscribe(
      (result) => {
        if (result) {
          this.loading = false;
          this.ratings = result.items;
        }
        this._userData.saveReviews(this.ratings);
        this.calculateAverageRating(this.ratings);
      },
      error => {
        this.loading = false;
        this.hintText = 'Network Error, Try Again!';
        this._common.showToast(this.hintText);
      },
      () => {
        // observer.next(success);
        // observer.complete();
      });
  }

  calculateAverageRating(ratings: RatingModel[]){
    let totalRatings = ratings.reduce((sum, item) => sum + item.avgRating, 0);
    this.overallRating = totalRatings/ ratings.length;
    if(this.overallRating < 1) {
      this.overallRating = 0;
    }
  }

  goToNotifications($event) {
    this.navCtrl.push(NotificationsPage);
  }

}
