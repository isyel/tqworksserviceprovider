import { Component } from '@angular/core';
import {
  ActionSheetButton, ActionSheetController, ActionSheetOptions, Config, ModalController, NavController,
  NavParams,
  AlertController,
  Refresher
} from 'ionic-angular';
import {ServiceRequestModel} from "../../models/service-request-model";
import {Common} from "../../app/app.common";
import {UserModel} from "../../models/user-model";
import {JobsPage} from "../jobs/jobs";
import {ServiceRequestQuoteModel} from "../../models/service-request-quote-model";
import {QuotesService} from "../../providers/services/quotes-service";
import {JobOwnerDetailPage} from "../job-owner-detail/job-owner-detail";
import {QuoteDetailsPage} from "../quote-details/quote-details";
import {CancelJobPage} from "../cancel-job/cancel-job";
import {SendQuoteModal} from "../send-quote-modal.ts/send-quote-modal";
import { RateUserModalPage } from '../rate-user-modal/rate-user-modal';
import { CompleteJobOptions } from '../../interfaces/complete-job-options';
import { ServiceRequestService } from '../../providers/services/service-request-service';
import { UserService } from '../../providers/services/user-service';
import { UserData } from '../../providers/user-data';
import { ProjectStatusEnum } from '../../enum/ProjectStatusEnum';
import { RecentActivitiesModel } from '../../models/recent-activities-model';
import { ServiceProviderModel } from '../../models/service-provider-model';

@Component({
  selector: 'page-job-detail',
  templateUrl: 'job-detail.html'
})
export class JobDetailPage {
  toUser : {toUserId: string, toUserName: string};
  job: ServiceRequestModel;
  jobAlertUser: UserModel;
  hintText: string = 'Please Wait...';
  TEST: boolean;
  projectQuotes: ServiceRequestQuoteModel;
  loading: boolean;
  totalItemsCost: number;
  providerData: ServiceProviderModel;

  constructor( public navCtrl: NavController, public navParams: NavParams,
               public modalCtrl: ModalController, public _serviceRequestService: ServiceRequestService,
               public _common: Common, public config: Config, public actionSheetCtrl: ActionSheetController,
               private _userService: UserService,  public _quotesService: QuotesService, 
               private _userData: UserData, private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.loading = true;
    this.TEST = true;
    this._userData.getProviderData().then((providerData) => {
      this.providerData = providerData;
    });
  }

  ionViewWillEnter() {
    this.job = this.navParams.data.jobDetails;
    this.jobAlertUser = this.job.user;
    this.getServiceRequest(this.navParams.data.jobDetails.id);
  }

  getServiceRequest(currentJobAlertId) {
    this.loading = true;
    this._serviceRequestService.getOne(currentJobAlertId).subscribe(
      (result) => {
        this.job = result;
        if (this.job.serviceCategory == null)
          this.getServiceCategoryDetails(this.job.serviceCategoryId);
        this.getProjectQuote(this.job.id);
        if (this.job.user == null) {
          this.getServiceRequestUser(this.job.userId);
        } else {
          this.jobAlertUser = this.job.user;
        }
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

  openJobLocation(job) {
    this.navCtrl.push(JobsPage, { jobAlert: job });
  }

  getProjectQuote(projectId) {
    this.loading = true;
    this._quotesService.getByProject(projectId).subscribe((result) => {
        this.loading = false;
        if (result == null) {
          this.hintText = 'No Quote found for this Service Request.';
          console.log(this.hintText);
        }
        else {
          this.projectQuotes = result;
          this.totalItemsCost = this.projectQuotes.quoteItems.reduce((sum, item) => sum + item.totalAmount, 0)
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
        this.job.serviceCategory = result;
      },
      error => {  
        console.log(error);
      },
      () => {
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

  goToUserDetail(user) {
    this.navCtrl.push(JobOwnerDetailPage, { jobOwnerDetails: user });
  }

  goToQuoteDetail(quote: any) {
    this.navCtrl.push(QuoteDetailsPage, { quoteData: quote, jobStatus: this.job.status});
  }

  manageProject(project) {
    let mode = this.config.get('mode');
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Manage This Project',
    } as ActionSheetOptions);
    if (this.projectQuotes && this.projectQuotes.isApproved) {
      actionSheet.addButton({
        text: `Mark as Completed`,
        icon: mode !== 'ios' ? 'done-all' : null,
        handler: () => {
            this.markJobCompleted(project.id); 
        }
      } as ActionSheetButton);
    }
    
    actionSheet.addButton(
      {
        text: `Cancel Project`,
        icon: mode !== 'ios' ? 'close' : null,
        color: 'danger',
        handler: () => {
          if (this.job.accepted) {
            this.cancelJob(project);
          } 
        }
      } as ActionSheetButton);

    actionSheet.present();
    this.job.fullPaymentDebited
  }

  presentQuoteModal(jobToBidId) {
    if (!this.job.accepted) {
      this.hintText = 'Job Has Not Been Accepted Yet';
      this._common.showToast(this.hintText);
      return;
    }
    let QuoteModal = this.modalCtrl.create(SendQuoteModal, { requestId: jobToBidId });
    QuoteModal.present();
    QuoteModal.onDidDismiss(() => {
      this.getProjectQuote(this.job.id);
    });
  }

  markJobCompleted(projectId) {
    if (!this.job.fullPaymentDebited) {
      this._common.showToast('Error marking Job as completed, Payment not complete');
      return;
    }
    let alert = this.alertCtrl.create();
    alert.setTitle('Are you sure you want to mark this Job as Completed');
    alert.addButton('No');
    alert.addButton({
      text: 'Yes',
      handler: () => {
        this._common.showLoading('Marking Job as Completed, Please Wait ...');
        let completeJobData: CompleteJobOptions = { requestId: projectId, providerId: this.job.serviceProviderId, userId: this.jobAlertUser.id, override: true};
        this._serviceRequestService.completedJob(completeJobData).subscribe((result) => {
          if (result) {
            this._common.hideLoading();
            this._common.showToast('Job Marked As Completed');
            let recentActivities: RecentActivitiesModel = {projectId: projectId, type: 'project',
                description: 'You Marked A Job As Completed', location: this.job.location, 
                createdDate: new Date}
            this._userData.setRecentActivities(recentActivities);
            let rateUserModal = this.modalCtrl.create(RateUserModalPage, { job: this.job }, { cssClass: 'inset-modal' });
            rateUserModal.present();
            rateUserModal.onDidDismiss(() => {
              this.getServiceRequest(projectId);
            });
          }
        },
        error => {
          this._common.hideLoading();
          this._common.showToast('Could not mark job as completed');
          this._common.handleError(error);
        },
        () => {
          // observer.next(success);
          // observer.complete();
        });
      }
    });

    alert.present();
  }

  isJobCompleted(jobStatus) {
    if (jobStatus == ProjectStatusEnum.completed) {
      return true;
    }
    else {
      return false;
    }
  }

  cancelJob(project) {
    let cancelJobModal = this.modalCtrl.create(CancelJobPage, 
      { request: project, userId: this.providerData.userId }, 
      { cssClass: 'inset-modal' });
    cancelJobModal.present();
    cancelJobModal.onDidDismiss(() => {
      this.getServiceRequest(project.id);
    });
  }

  callClient(phoneNumber) {
    window.open('tel://' + phoneNumber);
  }

  goToMail(email) {
    window.open('mailto://' + email);
  }

  goToChatPage(phoneNumber) {
    window.open('sms://' + phoneNumber);
  }

  doRefresh(refresher: Refresher) {
    this.getServiceRequest(this.job.id);

    refresher.complete();
  }


}
