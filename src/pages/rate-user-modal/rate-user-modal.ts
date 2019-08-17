import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { RatingOptions } from '../../interfaces/rating-options';
import { RatingTypeEnum } from '../../enum/RatingTypeEnum';
import { ReviewsService } from '../../providers/services/reviews-service';
import { Common } from '../../app/app.common';
import { RatingDetailOptions } from '../../interfaces/rating-detail-options';
import { UserData } from '../../providers/user-data';
import { ServiceProviderModel } from '../../models/service-provider-model';
import { UserModel } from '../../models/user-model';

/**
 * Generated class for the RateUserModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-rate-user-modal',
  templateUrl: 'rate-user-modal.html',
})
export class RateUserModalPage {
  ratingDetails: RatingDetailOptions[] = [{ratingId: 0, rating: null, ratingOptionId: 0, ratingOption: {title : 'User Performance Rating'}, 
                                        ratingValue: 0}];
  userReview: RatingOptions = { userId: 0, ratingType: RatingTypeEnum.serviceProvider, avgRating: 0, ratedByUserId: 0,
                              ratedByUser: null, showIdentity: true, isApproved: true, isActive: true,
                              ratingDetails: this.ratingDetails, comment: ''};
  hintText: string;
  providerData: ServiceProviderModel;
  client: UserModel;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, public _reviewsService: ReviewsService,
              public _common: Common, public _userData: UserData) {
  }

  ngOnInit() {
    this.client = this.navParams.data.job;
    this.userReview.userId = this.client.id;
    this._userData.getProviderData().then((providerData) => {
      this.providerData = providerData;
      this.userReview.ratedByUser = this.providerData.user;
      this.userReview.ratedByUserId = this.providerData.userId;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RateUserModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  submitUserRatings(form: NgForm) {
    if (form.valid) {
      this._common.showLoading('Submitting Client Review');
      this.userReview.ratingDetails[0].ratingValue = this.userReview.avgRating;
      this._reviewsService.sendClientReview(this.userReview).subscribe((result) => {
          this._common.hideLoading();
          if (!result.status) {
            this.hintText = 'User Review Could Not Be Published, Send Again';
            this._common.showToast(this.hintText);
          }
          else {
            this._common.showToast('Your Review Was Successfully Sent');
            this._common.showPopup('Review Sent', result.message)
            this.dismiss();
          }
        },
        error => {
          this._common.hideLoading();
          console.log(error.message);
          this.hintText = 'Network Error, Try Again!';
          this._common.showToast(this.hintText);
        },
        () => {
          // observer.next(success);
          // observer.complete();
        });
    }
  }

  onModelChange(event){
    console.log("On Modal Change Data", event);
    // this.ratingDetails.rating = event;
  }

}
