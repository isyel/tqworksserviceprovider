import { Component } from '@angular/core';
import {NavController, NavParams, Refresher} from 'ionic-angular';
import {NotificationsPage} from "../notifications/notifications";
import {ServiceRequestQuoteModel} from "../../models/service-request-quote-model";
import {QuotesService} from "../../providers/services/quotes-service";
import {QuoteDetailsPage} from "../quote-details/quote-details";
import {UserData} from "../../providers/user-data";
import {UserModel} from "../../models/user-model";
import { Storage } from '@ionic/storage';
import { ProjectsPage } from '../projects/projects';


/**
 * Generated class for the EnquiriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-quotes-and-invoices',
  templateUrl: 'quotes-and-invoices.html',
})
export class QuotesAndInvoicesPage {
  segmentView: string = "one";
  allQuotes: ServiceRequestQuoteModel[] = [];
  pendingQuotes: ServiceRequestQuoteModel[] = [];
  approvedQuotes: ServiceRequestQuoteModel[] = [];
  providerDataId: number;
  jobAlertUser: UserModel;
  hintText: string;
  loading: boolean;
  perPage = 20;
  dataIndex = 0;
  tempResult: any = [];
  public backgroundImage: any = "./assets/img/tq_background.png";

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              public _quotesService: QuotesService, private _userData: UserData,
              public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnquiriesPage');
    this._userData.getProviderId().then((providerDataId) => {
      this.providerDataId = providerDataId;
      this.getAllOfflineQuote();
    });
  }

  getAllOfflineQuote() {
    this.loading = true;
    this._userData.getOfflineQuoteData().then((result) => {
        if (result != null && result.length > 0) {
          this.loading = false;
          this.tempResult = result;
          for(let i = 0; i < this.perPage; i++) {
            if(i < this.tempResult.length) {
              this.allQuotes.push(this.tempResult[i]);
              this.processData(this.tempResult[i]);
              this.dataIndex++;
            }
          }
        }
        this.getAllQuote();
      });
  }

  getAllQuote() {
    this.loading = true;
    this._quotesService.getByServiceProvider(this.providerDataId).subscribe((result) => {
        if (result) {
          this.allQuotes = [];
          this.approvedQuotes = [];
          this.pendingQuotes = [];
          this.loading = false;
          this.tempResult = result;
          for(let i = 0; i < this.perPage; i++) {
            if(i < this.tempResult.length) {
              this.allQuotes.push(this.tempResult[i]);
              this.processData(this.tempResult[i]);
              this.dataIndex++;
            }
          }
          this._userData.setOfflineQuoteData(this.tempResult);
        }
      },
      error => {
        this.loading = false;
        console.log(error);
      },
      () => {
      });
  }

  doInfinite(infiniteScroll) {
    if(this.allQuotes.length < this.tempResult.length) {
      infiniteScroll.enable(true);
    } 
    setTimeout(() => {
      let index = this.dataIndex;
      this.allQuotes.push.apply(this.allQuotes, this.tempResult);
      for(let i = index; i < index + this.perPage; i++) {
        if(i < this.tempResult.length) {
          this.processData(this.tempResult[i]);
          this.dataIndex++;
        }
      }
      infiniteScroll.complete();
    } , 1000);
  }

  processData(quote) {
    if (quote.isApproved && !quote.isRejected) {
      this.approvedQuotes.push(quote);
    }
    else {
      this.pendingQuotes.push(quote);
    }
  }

  findJobs() {
    this.navCtrl.push(ProjectsPage);
  }

  goToQuoteDetail(quote: any) {
    this.navCtrl.push(QuoteDetailsPage, { quoteData: quote});
  }

  doRefresh(refresher: Refresher) {
    this.dataIndex = 0;
    this.getAllQuote();
    refresher.complete();
  }

  goToNotifications($event) {
    this.navCtrl.push(NotificationsPage);
  }
}
