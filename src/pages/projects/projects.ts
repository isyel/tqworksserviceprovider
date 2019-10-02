import { Component } from '@angular/core';
import { NavController,
  Refresher, NavParams, PopoverController
} from 'ionic-angular';

/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
import { UserData } from '../../providers/user-data';
import { JobDetailPage } from '../job-detail/job-detail';
import {ServiceRequestModel} from "../../models/service-request-model";
import {ServiceRequestService} from "../../providers/services/service-request-service";
import {Common} from "../../app/app.common";
import {ServiceProviderModel} from "../../models/service-provider-model";
import { Storage } from '@ionic/storage';
import { FilterPopoverPage } from '../filter-popover/filter-popover';
import { ProjectStatusEnum } from '../../enum/ProjectStatusEnum';
import { JobsPage } from '../jobs/jobs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html'
})
export class ProjectsPage {

  queryText = '';
  segment: string;
  excludeTracks: any = [];
  checkListNumber: number;
  checkListCompleted: number;
  projectHistory: ServiceRequestModel[] = [];
  tempProjectHistory: ServiceRequestModel[] = [];
  providerData: ServiceProviderModel;
  hintText: string;
  pageNumber: number = 0;
  perPage: number = 20;
  totalData: number;
  totalPage: number;
  loading: boolean;
  searchResults: ServiceRequestModel[] = [];
  filterStatus: any;


  constructor(
    public navCtrl: NavController,
    public _userData: UserData, public navParams: NavParams,
    private _serviceRequest: ServiceRequestService, public _common: Common,
    public storage: Storage, public popoverCtrl: PopoverController,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.checkListCompleted = 2;
    this.checkListNumber = 3;
    this.segment = (this.navParams.data.segmentValue) ? this.navParams.data.segmentValue : 'all';
    this._serviceRequest.startConnection();
    this._serviceRequest.addRecieveProjectUpdateListener();   
    this.startHttpRequest();
  }

  private startHttpRequest = () => {
    this.http.get('https://signalr.tqworksng.com/hubs/ServiceHub')
      .subscribe(res => {
        console.log(res);
      })
  }

  ionViewDidLoad() {
    this._userData.getProviderData().then((providerData) => {
      this.providerData = providerData;
      this.updateOfflineJobsHistory();
    });
  }

  updateOfflineJobsHistory() {
    this.loading = true;
    this._userData.getOfflineProjectData().then((result) => {
      this.loading = false;
      this.projectHistory = result;
      this.tempProjectHistory = this.projectHistory;
      this.updateJobsHistory();
    });
  }

  searchKeyword() {
    if (this.queryText == '') {
      this.segment = 'all';
      return;
    }
    this.searchResults = [];
    this.segment = 'search';
    this.loading = true;
    this.projectHistory.forEach((project) => {
      if (project.description.toLowerCase().indexOf(this.queryText.toLowerCase()) != -1 ||
          project.location.toLowerCase().indexOf(this.queryText.toLowerCase()) != -1 ||
          project.serviceCategory.name.toLowerCase().indexOf(this.queryText.toLowerCase()) != -1) {
        this.searchResults.push(project);
      }
    })
    this.loading = false;
  } 

  updateJobsHistory() {
    this.loading = true;
    this.pageNumber = 0;
    this._serviceRequest.getByProvider(this.providerData.id, this.queryText, this.pageNumber, this.perPage).subscribe((result) => {
        if (result) {
          this.totalData = result.totalCount;
          this.totalPage = result.totalPages;
          this.projectHistory = result.items;
          console.log("Projects from API: ",this.projectHistory);
          this.tempProjectHistory = this.projectHistory;
          this._userData.setOfflineProjectData(this.projectHistory);
          this.loading = false;
        }
      },
      error => {
        this.loading = false;
        this.hintText = 'Network Error, Pull down to Refresh';
        this._common.showToast(this.hintText);
      },
      () => {
        // observer.next(success);
        // observer.complete();
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

  doInfinite(infiniteScroll) {
    this.pageNumber = this.pageNumber + 1;
    if(this.pageNumber < this.totalPage) {
      infiniteScroll.enable(true);
    }
    setTimeout(() => {
      this._serviceRequest.getByProvider(this.providerData.id, this.queryText, this.pageNumber, this.perPage).subscribe((result) => {
        if (result == null) {
          this._common.showToast('No More Projects');
        }
        else {
          this.totalData = result.totalCount;
          this.totalPage = result.totalPages;
          this.projectHistory.push.apply(this.projectHistory, result.items);
          if(this.pageNumber >= this.totalPage) {
            infiniteScroll.enable(false);
          }
        }
      },
      error => {
        this._common.showToast(error);
      });
      infiniteScroll.complete();
    }, 500);
  }

  findJobs() {
    this.navCtrl.push(ProjectsPage);
  }

  presentFilter($event) {
    const popover = this.popoverCtrl.create(FilterPopoverPage);
    popover.present();
    popover.onDidDismiss(data => {
      this.filterStatus = ProjectStatusEnum[data];
      this.loading = true;
      if(data == ProjectStatusEnum.all || (data === null)) {
        this.projectHistory = this.tempProjectHistory;
        this.loading = false;
        return;
      }
      this.projectHistory = [];
      this.tempProjectHistory.forEach((element: ServiceRequestModel) => {
        if(element.status == data) {
          this.projectHistory.push(element);
        }
      });
      this.loading = false;
    });
  }

  goToJobDetail(job: ServiceRequestModel) {
    if(job.accepted) {
      this.navCtrl.push(JobDetailPage, { jobDetails: job});
    }
    else {
      this.navCtrl.push(JobsPage, { jobAlert: job});
    }
  }

  doRefresh(refresher: Refresher) {
    this.updateJobsHistory();

    refresher.complete();
  }
}
