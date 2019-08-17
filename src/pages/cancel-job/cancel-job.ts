import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {CancelProjectOptions} from "../../interfaces/cancel-project-options";
import {ServiceRequestService} from "../../providers/services/service-request-service";
import {Common} from "../../app/app.common";
import {NgForm} from "@angular/forms";
import { AvailabilityEnum } from '../../enum/AvailabilityEnum';
import { UserData } from '../../providers/user-data';
import { RecentActivitiesModel } from '../../models/recent-activities-model';
import { PlatformEnum } from '../../enum/PlatformEnum';

/**
 * Generated class for the CancelJobPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-cancel-job',
  templateUrl: 'cancel-job.html',
})
export class CancelJobPage {
  hintText: string = 'Cancelling Job...';
  rejectJobData: CancelProjectOptions = {userId: 0, platform: PlatformEnum.Mobile, requestId : 0, cancellationReason : ''};
  cancellationReason: any = '';
  otherReasonsChecked: boolean;
  location: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private _serviceRequest: ServiceRequestService, public _common: Common,
              public viewCtrl: ViewController, private _userData: UserData) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CancelJobPage');
    this.rejectJobData.requestId = this.navParams.data.request.id;
    this.rejectJobData.userId = this.navParams.data.userId;
    this.location = this.navParams.data.request.location;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  changeOption(value) {
    if(value == 'others') {
      this.otherReasonsChecked = true;
    } else {
      this.otherReasonsChecked = false;
    }
  }

  submitCancelReason(form: NgForm) {
    this._common.showLoading(this.hintText);
    if (this.cancellationReason != 'others') {
      this.rejectJobData.cancellationReason = this.cancellationReason;
    }
    if (form.valid) {
      this._serviceRequest.cancelJob(this.rejectJobData).subscribe((result) => {
          this._common.hideLoading();
          if (!result.status) {
            this.hintText = 'Project Could Not Be Cancelled.';
            this._common.showPopup('Cancelling Project',this.hintText);
          }
          else {
            this._common.showToast('Project Cancellation Successful');
            let recentActivities: RecentActivitiesModel = {projectId: this.rejectJobData.requestId, type: 'project',
              description: 'You Cancelled A Job', location: this.location, 
              createdDate: new Date}
            this._userData.setRecentActivities(recentActivities);
            this._userData.getProviderData().then((providerData)=> {
              providerData.availability = AvailabilityEnum.available;
              this._userData.saveProvider(providerData);
            });
            this.dismiss();
          }
        },
        error => {
          this._common.hideLoading();
          this._common.handleError(error);
          this.hintText = 'Network Error, Try Again!';
        },
        () => {
          // observer.next(success);
          // observer.complete();
        });
    }
  }

}
