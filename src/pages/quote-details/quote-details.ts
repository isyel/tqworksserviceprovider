import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Refresher } from 'ionic-angular';
import {ServiceRequestQuoteModel} from "../../models/service-request-quote-model";
import { SendQuoteModal } from '../send-quote-modal.ts/send-quote-modal';
import { QuotesService } from '../../providers/services/quotes-service';
import { ProjectStatusEnum } from '../../enum/ProjectStatusEnum';
import { MerchantsListPage } from '../merchants-list/merchants-list';
import { MerchantsServiceProvider } from '../../providers/services/merchants-service';
import { AccountStatusEnum } from '../../enum/AccountStatusEnum';
import { MerchantModel } from '../../models/merchantModel';
import { ServiceRequestService } from '../../providers/services/service-request-service';

/**
 * Generated class for the QuoteDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-quote-details',
  templateUrl: 'quote-details.html',
})
export class QuoteDetailsPage {
  quote: ServiceRequestQuoteModel;
  totalItemsCost: number = 0;
  subTotal: number = 0;
  jobStatus: number;
  projectStatus = ProjectStatusEnum;
  loading: boolean;
  searchKeyword: string;
  merchantsList: MerchantModel[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
              public _quotesService: QuotesService, public _merchantsService: MerchantsServiceProvider,
              public _serviceRequest: ServiceRequestService) {
  }

  ngOnInit() {
    this.loading = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuoteDetailsPage');
    this.quote = this.navParams.data.quoteData;
    console.log('Quote: ', this.quote);
    this.jobStatus = this.navParams.data.jobStatus;
    if(this.quote != undefined && this.quote.quoteItems != null) {
      this.totalItemsCost = this.quote.quoteItems.reduce((sum, item) => sum + item.totalAmount, 0);
      this.subTotal = this.totalItemsCost + this.quote.transportation + this.quote.labourCost;
      this.quote.serviceRequest == null ? this.getServiceRequest() : this.getMerchantsList();
    } else {
      this.getProjectQuote(this.quote.serviceRequestId);
    }
  }

  presentQuoteModal(jobToBidId) {
    let QuoteModal = this.modalCtrl.create(SendQuoteModal, { requestId: jobToBidId, quote: this.quote });
    QuoteModal.present();
    QuoteModal.onDidDismiss(() => {
      this.getProjectQuote(this.quote.serviceRequestId);
    });
  }

  getProjectQuote(quoteId) {
    this._quotesService.getByProject(quoteId).subscribe((result) => {
        if (result == null) {
          console.log('No Quote found for this Service Request.');
        }
        else {
          this.quote = result;
          this.quote.serviceRequest == null ? this.getServiceRequest() : this.getMerchantsList();
          if(this.quote.quoteItems != null) {
            this.totalItemsCost = this.quote.quoteItems.reduce((sum, item) => sum + item.totalAmount, 0);
          }
          this.subTotal = this.totalItemsCost + this.quote.transportation + this.quote.labourCost;
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.log(error);
      },
      () => {
      });
  }

  getServiceRequest() {
    this.loading = true;
    this._serviceRequest.getOne(this.quote.serviceRequestId).subscribe((result) => {
        this.quote.serviceRequest = result;
        this.getMerchantsList();
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.log(error);
      },
      () => {
      });
  }

  getMerchantsList() {
    this.loading = true;
    this._merchantsService.getMerchantsList(this.quote.serviceRequest.serviceCategoryId, this.quote.serviceRequest.longitude, 
      this.quote.serviceRequest.latitude, AccountStatusEnum.active, this.searchKeyword).subscribe((result) => {
        this.merchantsList = result;
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.log(error);
      },
      () => {
      });
  }

  goToMerchantsPage() {
    this.navCtrl.push(MerchantsListPage, { quote: this.quote});
  }

  doRefresh(refresher: Refresher) {
    this.getProjectQuote(this.quote.serviceRequestId);

    refresher.complete();
  }
}
