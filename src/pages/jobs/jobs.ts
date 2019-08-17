import {Component, ElementRef, ViewChild} from '@angular/core';
import { ActionSheetController, ActionSheetOptions, Config, IonicPage, ModalController, NavController, NavParams,
  Platform,
  AlertController,
} from 'ionic-angular';
import {JobDetailPage} from "../job-detail/job-detail";
import {JobOwnerDetailPage} from "../job-owner-detail/job-owner-detail";
import {NotificationsPage} from "../notifications/notifications";
import {ServiceRequestService} from "../../providers/services/service-request-service";
import {Common} from "../../app/app.common";
import {ServiceRequestModel} from "../../models/service-request-model";
import {UserService} from "../../providers/services/user-service";
import {UserModel} from "../../models/user-model";
import {UserData} from "../../providers/user-data";
import {ServiceProviderModel} from "../../models/service-provider-model";
import {AcceptProjectOptions} from "../../interfaces/accept-project-options";
import {ServiceCategoryModel} from "../../models/service-category-model";
import {
  GoogleMap,
  GoogleMapOptions, GoogleMaps, LocationService, Marker, MyLocation,
  MyLocationOptions
} from "@ionic-native/google-maps";
import { AvailabilityEnum } from '../../enum/AvailabilityEnum';
import { ProjectStatusEnum } from '../../enum/ProjectStatusEnum';
import { RecentActivitiesModel } from '../../models/recent-activities-model';
import { DashboardPage } from '../dashboard/dashboard';
import { JobAlertStatusEnum } from '../../enum/JobAlertStatusEnum';

/**
 * Generated class for the JobsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface ActionSheetButton {
  text?: string;
  role?: string;
  icon?: string;
  cssClass?: string;
  handler?: () => boolean|void;
}

@IonicPage()
@Component({
  selector: 'page-jobs',
  templateUrl: 'jobs.html',
})
export class JobsPage {
  toUser : {toUserId: string, toUserName: string};
  TEST: boolean;
  hintText: string = 'Please Wait...';
  currentJobAlert: ServiceRequestModel;
  jobAlertUser: UserModel;
  acceptJobData: AcceptProjectOptions = {requestId : 0, providerId : 0, userId: 0};
  providerData: ServiceProviderModel;
  categoryDetails: ServiceCategoryModel;
  loading: boolean;
  public backgroundImage: any = "./assets/img/tq_background.png";
  map: GoogleMap;
  projectStatusEnum = ProjectStatusEnum;
  jobStatusEnum = JobAlertStatusEnum;
  serviceRequestId: number;

  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  constructor(public actionSheetCtrl: ActionSheetController,
              public navCtrl: NavController, private _userData: UserData,
              public config: Config, public _common: Common, public navParams: NavParams,
              public platform: Platform, private _userService: UserService,
              public modalCtrl: ModalController, private alertCtrl: AlertController,
              private _serviceRequest: ServiceRequestService) {
    this.TEST = true;
  }

  ionViewDidLoad() {
    this.serviceRequestId = this.navParams.data.jobAlert.id;
    this.getServiceRequest(this.serviceRequestId);
    this._userData.getProviderData().then((providerData) => {
      this.providerData = providerData;
    });
  }

  getServiceRequest(currentJobAlertId) {
    this.loading = true;
    this._serviceRequest.getOne(currentJobAlertId).subscribe(
      (result) => {
        this.currentJobAlert = result;
        console.log('Job alert: ', result);
        if (this.currentJobAlert.user == null) {
          this.getServiceRequestUser(this.currentJobAlert.userId);
        } else {
          this.jobAlertUser = this.currentJobAlert.user;
        }
        if (this.currentJobAlert.user == null) {
          this.getServiceCategoryDetails(this.currentJobAlert.serviceCategoryId);
        } else {
          this.categoryDetails = this.currentJobAlert.serviceCategory;
        }
        this.loading = false;
        if (this.platform.is('cordova')) {
          this.loadMap(this.currentJobAlert.latitude, this.currentJobAlert.longitude, this.currentJobAlert.location);
        } else {
          // Cordova not accessible, add mock data if necessary
          console.log('Cordova Not Available');
        }
      },
      error => {
        this.loading = false;
        console.log(error);
      },
      () => {
      });
  }

  getServiceCategoryDetails(categoryId) {
    this._userService.getServiceCategory(categoryId).subscribe((result) => {
        this.categoryDetails = result;
      },
      error => {
        console.log(error);
      },
      () => {
      });
  }

  getServiceRequestUser(userId) {
    this._userService.getOne(userId).subscribe((result) => {
        this.jobAlertUser = result;
      },
      error => {
        console.log(error);
      },
      () => {
      });
  }

  goToNotifications($event) {
    this.navCtrl.push(NotificationsPage);
  }

  loadMap(jobOwnerLatitude, jobOwnerLongitude, location) {
    let options: GoogleMapOptions = {
      backgroundColor: 'white',
      timeout: 10000,
      enableHighAccuracy: true,
      zoom: 35,
      controls: {
        compass: true,
        myLocationButton: true,
        indoorPicker: true,
        zoom: true
      },
      gestures: {
        scroll: true,
        tilt: true,
        rotate: true,
        zoom: true
      }
    };
    this.map = GoogleMaps.create('map_canvas', options);
    this.addJobMarkerPosition(jobOwnerLatitude, jobOwnerLongitude, location);
  }

  getMyPosition() {
    let option: MyLocationOptions = {
      // true: use GPS as much as possible (use battery usage alot)
      //
      // false: use network location or lastKnownLocation
      // (save battery usage)
      enableHighAccuracy: true
    };
    LocationService.getMyLocation(option).then((myLocation: MyLocation) => {
      let options: GoogleMapOptions = {
        camera: {
          target: myLocation.latLng
        }
      };
      this.map = GoogleMaps.create('map_canvas', options);
    });
  }

  addJobMarkerPosition(jobOwnerLatitude, jobOwnerLongitude, location) {
    this.map.animateCamera({
      target: {lat: jobOwnerLatitude, lng: jobOwnerLongitude},
      zoom: 15,
      tilt: 30,
      bearing: 45,
      duration: 5000
    }).then(() => {
      console.log("Camera target has been changed");
    });

    this.map.addMarker({
      title: location,
      icon: '#222',
      animation: 'DROP',
      position: {
        lat: jobOwnerLatitude,
        lng: jobOwnerLongitude
      }
    }).then((marker: Marker) => {
      marker.showInfoWindow();
    });
  }

  acceptJob(serviceRequestId) {
    this._userData.getProviderData().then((providerData) => {
      if(providerData.availability != AvailabilityEnum.onAJob) {
        this.acceptJobData.requestId = serviceRequestId;
        this.acceptJobData.providerId = providerData.id;
        this.acceptJobData.userId = this.currentJobAlert.userId;
        this._serviceRequest.acceptJob(this.acceptJobData).subscribe((result) => {
            if (!result.status) {
              this.hintText = 'Could Not Accept Job, Server Error, Try Again';
              this._common.showError(this.hintText);
            }
            else {
              this._common.showToast('Project Successfully Accepted');
              this.providerData.availability = AvailabilityEnum.onAJob;
              this.currentJobAlert.status = ProjectStatusEnum.ongoing;
              this.currentJobAlert.accepted = true;
              let recentActivities: RecentActivitiesModel = {projectId: this.currentJobAlert.id, type: 'project',
                description: 'You Accepted A New Project', location: this.currentJobAlert.location, createdDate: new Date}
              this._userData.setRecentActivities(recentActivities);
              this._userData.saveProvider(this.providerData);
              this.navCtrl.push(DashboardPage);
            }
          },
          error => {
            this.hintText = 'Network Error, Try Again!';
            this._common.showError(this.hintText);
          },
          () => {
            // observer.next(success);
            // observer.complete();
          });
      }
      else {
        this._common.showPopup('On a Job','You Cannot Accept this job, You have an Active Project');
      }
    })
  }

  rejectJob(serviceRequestId) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Are you sure you want to reject this job offer?');
    alert.addButton('No');
    alert.addButton({
      text: 'Yes',
      handler: () => {
        this._userData.getProviderData().then((providerData) => {
          if(providerData.availability != AvailabilityEnum.onAJob) {
            let rejectJobData: AcceptProjectOptions = {requestId : serviceRequestId, providerId : this.providerData.id,
                                userId: this.currentJobAlert.userId};
            this._serviceRequest.rejectJob(rejectJobData).subscribe((result) => {
              if (!result.status) {
                this.hintText = 'Network Error, Try Again!';
                this._common.showError(this.hintText);
              }
              else {
                this._common.showToast('Job Rejected');
                this.providerData.availability = AvailabilityEnum.available;
                this.getServiceRequest(this.serviceRequestId);
                let recentActivities: RecentActivitiesModel = {projectId: this.currentJobAlert.id, type: 'project',
                  description: 'You Rejected A Project', location: this.currentJobAlert.location, createdDate: new Date}
                this._userData.setRecentActivities(recentActivities);
                this._userData.saveProvider(this.providerData);
              }
            },
            error => {
              this.hintText = 'Network Error, Try Again!';
              this._common.showError(this.hintText);
            },
            () => {
              // observer.next(success);
              // observer.complete();
            });
          }
          else {
            this._common.showPopup('On a Job','You Already have an Active Project');
          }
        });
      }
    });

    alert.present();
  }

  goToJobDetail(job: ServiceRequestModel) {
    if (this.providerData.id == job.serviceProviderId) {
      this.navCtrl.push(JobDetailPage, { jobDetails: job});
    } else {
      return;
    }
  }

  goToUserDetail(user) {
    this.navCtrl.push(JobOwnerDetailPage, { jobOwnerDetails: user });
  }

  openContact(jobOwner: UserModel) {
    if (this.currentJobAlert.commitmentFeeDebited) {
      let mode = this.config.get('mode');
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Contact ' + jobOwner.firstName,
        buttons: [
          {
            text: `Email ( ${jobOwner.email} )`,
            icon: mode !== 'ios' ? 'mail' : null,
            handler: () => {
              window.open('mailto:' + jobOwner.email);
            }
          } as ActionSheetButton,
          {
            text: `Send an SMS to ( ${jobOwner.firstName} )`,
            icon: mode !== 'ios' ? 'chatbubbles' : null,
            handler: () => {
              this.goToChatPage(jobOwner.phoneNumber);
            }
          } as ActionSheetButton,
          {
            text: `Call ( ${jobOwner.phoneNumber} )`,
            icon: mode !== 'ios' ? 'call' : null,
            handler: () => {
              window.open('tel:' + jobOwner.phoneNumber);
            }
          } as ActionSheetButton
        ]
      } as ActionSheetOptions);

      actionSheet.present();
    } else {
      this._common.showToast('Client Contact Not Available');
    }

  }

  goToChatPage(jobOwnerPhoneNumber) {
    // this.toUser = {
    //   toUserId: this.TEST ? '210000198410281948' : jobOwnerId,
    //   toUserName: this.TEST ? 'Hancock' : jobOwnerFirstName
    // };
    // this.navCtrl.push(ChatPage, this.toUser);
    window.open('sms:' + jobOwnerPhoneNumber);
  }

}
