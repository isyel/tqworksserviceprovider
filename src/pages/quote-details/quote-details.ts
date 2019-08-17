import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Refresher } from 'ionic-angular';
import {ServiceRequestQuoteModel} from "../../models/service-request-quote-model";
import { SendQuoteModal } from '../send-quote-modal.ts/send-quote-modal';
import { QuotesService } from '../../providers/services/quotes-service';
import { ProjectStatusEnum } from '../../enum/ProjectStatusEnum';
import { MerchantsListPage } from '../merchants-list/merchants-list';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
              public _quotesService: QuotesService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuoteDetailsPage');
    this.quote = this.navParams.data.quoteData;
    console.log('Quote: ', this.quote);
    this.jobStatus = this.navParams.data.jobStatus;
    this.getProjectQuote(this.quote.serviceRequestId);
    if(this.quote != undefined && this.quote.quoteItems != null) {
      this.totalItemsCost = this.quote.quoteItems.reduce((sum, item) => sum + item.totalAmount, 0);
      this.subTotal = this.totalItemsCost + this.quote.transportation + this.quote.labourCost;
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
          if(this.quote.quoteItems != null) {
            this.totalItemsCost = this.quote.quoteItems.reduce((sum, item) => sum + item.totalAmount, 0);
          }
          this.subTotal = this.totalItemsCost + this.quote.transportation + this.quote.labourCost;
        }
      },
      error => {
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
