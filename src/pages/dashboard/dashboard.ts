import { Component } from '@angular/core';
import {AlertController, NavController, NavParams, Refresher} from 'ionic-angular';
import {JobsPage} from "../jobs/jobs";
import {ProjectsPage} from "../projects/projects";
import {NotificationsPage} from "../notifications/notifications";
import {UserData} from "../../providers/user-data";
import {ServiceProviderModel} from "../../models/service-provider-model";
import {UserModel} from "../../models/user-model";
import {JobDetailPage} from "../job-detail/job-detail";
import {Common} from "../../app/app.common";
import {AvailabilityEnum} from "../../enum/AvailabilityEnum";
import {ServiceRequestService} from "../../providers/services/service-request-service";
import { ProfilePerformancePage } from '../profile-performance/profile-performance';
import { UserService } from '../../providers/services/user-service';
import { ServiceRequestModel } from '../../models/service-request-model';
import { ProjectStatusEnum } from '../../enum/ProjectStatusEnum';
import { NotificationService } from '../../providers/services/notification-service';
import { QuoteDetailsPage } from '../quote-details/quote-details';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  profileImage: any;
  activeJob: ServiceRequestModel;
  jobAlert: boolean;
  recentActivities: any[];
  providerData: ServiceProviderModel;
  userData: UserModel;
  availabilityText: string;
  loading: boolean;
  currentJobAlert: ServiceRequestModel;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private _userData: UserData, public _common: Common, private alertCtrl: AlertController,
              private _serviceRequest: ServiceRequestService, public _userService: UserService,
              private _notificationService: NotificationService) {
  }

  ngOnInit() {
    this.loading = true;
    this.recentActivities = [];
    this.getNotifications();
  }

  ionViewDidEnter() {
    this._userData.getProviderData().then((providerData) => {
      this.providerData = providerData;
      this.updateProviderDetails(this.providerData.id);
      this.availabilityText = this.showAvailability(this.providerData.availability);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
    this.getRecentActivities();
  }

  updateProviderDetails(userId) {
    this._userService.getProviderById(userId).subscribe((result) => {
        this.providerData = result;
        this.availabilityText = this.showAvailability(this.providerData.availability);
        this._userData.saveProvider(this.providerData).then(() => {
          this.getJobAlert();
        });
      },
      error => {
        console.log('error: ', error);
      },
      () => {
        this._common.hideLoading();
      });
  }

  getNotifications()
  {
    this._userData.getUserId().then((userId)=> {
      this._notificationService.getByUserId(userId, 0, 15).subscribe((result) => {
          if (result == null) {
            console.log('Notifications is null');
          }
          else {
            this.setNotificationCount(result.items);
            this._userData.saveNotifications(result.items);
          }
        },
        error => {
          console.log('Notifications Error: ', error.error);
        },
        () => {
        });
    });
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


  showAvailability(availabilityNumber: number): string {
    switch (availabilityNumber) {
      case AvailabilityEnum.available:
        return 'Available';
      case AvailabilityEnum.busy:
        return 'Busy';
      case AvailabilityEnum.onAJob:
        return 'On a Job';
      case AvailabilityEnum.notAvailable:
        return 'Not Available'
      case AvailabilityEnum.unknown:
        return 'Not Activated'
    }
  }

  goToNotifications($event) {
    this.navCtrl.push(NotificationsPage);
  }

  getJobAlert() {
    /*
      TODO: Seperate job alert from active job
    */
    if (this.providerData.availability == AvailabilityEnum.available) {
      
      this._serviceRequest.getJobAlert(this.providerData.id).subscribe(
        (result) => {
          if (!result || result.data == null) {
            this.jobAlert = false;
          }
          else if (result.data.serviceRequest.status == ProjectStatusEnum.cancelled || 
            result.data.serviceRequest.accepted) {
            this.jobAlert = false;
          } else {
            this.jobAlert = true;
            this.currentJobAlert = result.data.serviceRequest;
          }
        },
        error => {
          console.log('Error Data: ', error);
        });
    } else if (this.providerData.availability == AvailabilityEnum.onAJob || 
                this.providerData.availability == AvailabilityEnum.busy){
      this.jobAlert = false;
      this.getActiveJob();
    } else {
      this.jobAlert = false;
    }
    
  }

  getActiveJob() {
    this.loading = true;
    this._serviceRequest.getByProvider(this.providerData.id).subscribe((result) => {
      if (result != null) {
        this.activeJob = result.items.find((project) => 
          project.accepted && 
          (project.status == ProjectStatusEnum.ongoing || project.status == ProjectStatusEnum.awaitingCompletion || 
            project.status == ProjectStatusEnum.pending)
        );
        this.loading = false;
      }
    },
    error => {
      this.loading = false;
      console.log('Error Fetching Active Job ', error.error);
    });
  }

  showProjectStatus(statusNumber: number): string {
    switch (statusNumber) {
      case ProjectStatusEnum.ongoing:
        return 'On Going';
      case ProjectStatusEnum.awaitingCompletion:
        return 'Awaiting Completion';
      case ProjectStatusEnum.cancelled:
        return 'Cancelled';
      case ProjectStatusEnum.closed:
        return 'Closed'
      case ProjectStatusEnum.completed:
        return 'Completed'
      case ProjectStatusEnum.pending:
        return 'Pending'
    }
  }

  goToJobsPage() {
    // go to the jobs page
    this.navCtrl.push(JobsPage, { jobAlert: this.currentJobAlert });
  }

  goToProjectsPage() {
    this.navCtrl.push(ProjectsPage, { segmentValue: 'all' });
  }

  goToPerformancePage() {
    this.navCtrl.push(ProfilePerformancePage);
  }

  changeStatus() {
    if(this.providerData.availability == AvailabilityEnum.onAJob) {
      this._common.showToast('You Cannot Change Your Status When On A Job')
    }
    else if(this.providerData.availability == AvailabilityEnum.unknown) {
      this._common.showToast('You Account Is Not Yet Activated')
    }
    else {
      
      let alert = this.alertCtrl.create();
      let activeStatus = this.providerData.availability;
      let options = [AvailabilityEnum.available, AvailabilityEnum.busy, AvailabilityEnum.notAvailable];
      alert.setTitle('Change Status');

      for (let i = 0; i < options.length; i++) {
        alert.addInput({
          type: 'radio',
          label: this.showAvailability(options[i]),
          value: String(options[i]),
          checked: (options[i] === activeStatus)
        });
      }

      alert.addButton('Cancel');
      alert.addButton({
        text: 'Change',
        handler: (newStatus: string) => {
          this.availabilityText = this.showAvailability(parseInt(newStatus));
          this.providerData.availability = parseInt(newStatus);
          this._userData.saveProvider(this.providerData);
          this.saveStatusChange(newStatus);
        }
      });

      alert.present();
    }
  }

  saveStatusChange(newStatus) {
    let saveStatusCredentials = {providerId: this.providerData.id, status: newStatus}
    this._userService.setProviderStatus(saveStatusCredentials).subscribe((result) => {
      if (!result.status) {
        this._common.showToast('Could Not Change Status');
      }
    },
    error => {
      console.log('Error Saving status Change to server: ', error);
    },
    () => {
    });
  }

  goToDetailsPage(job) {
    this.navCtrl.push(JobDetailPage, { jobDetails: job});
  }

  getRecentActivities() {
    this._userData.getRecentActivities().then((result) => {
        if (result != null) {
          this.recentActivities = result;
        }
        else {
          console.log('No Recent Activities');
        }
      });
  }

  goToActivityDetails(notificationType, projectId) {
    switch (notificationType) {
      case 'project':
        let jobDetails = {id: projectId};
        this.navCtrl.push(JobDetailPage, { jobDetails: jobDetails, fromNotifications: true});
        return;
      case 'quote':
        let quoteDetails = {serviceRequestId: projectId};
        this.navCtrl.push(QuoteDetailsPage, { quoteData: quoteDetails, fromNotifications: true});
        return;
    }
  }

  getServiceRequest(jobId) {
    this._serviceRequest.getOne(jobId).subscribe(
      (result) => {
        this.activeJob = result;
      },
      error => {
        console.log(error);
      },
      () => {
      });
  }

  getProviderDetails(providerId) {
    this._userService.getProviderById(providerId).subscribe(
      (result) => {
        this.providerData = result;
      },
      error => {
        console.log(error);
      },
      () => {
      });
  }

  doRefresh(refresher: Refresher) {
    this.updateProviderDetails(this.userData.id);

    refresher.complete();
  }

}
