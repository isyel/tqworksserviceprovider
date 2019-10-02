import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, PopoverController, AlertController} from 'ionic-angular';
import {QuoteOptions} from "../../interfaces/quote-options";
import {Common} from "../../app/app.common";
import {NgForm} from "@angular/forms";
import {ServiceProviderModel} from "../../models/service-provider-model";
import {UserData} from "../../providers/user-data";
import {QuotesService} from "../../providers/services/quotes-service";
import { ItemModel } from '../../models/item-model';
import { ServiceQuoteItemOptions, ServiceRequestQuoteNewItemModel } from '../../interfaces/service-quote-item-options';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AddItemPopoverPage } from '../add-item-popover/add-item-popover';
import { RecentActivitiesModel } from '../../models/recent-activities-model';


@Component({
  selector: 'page-send-quote-modal',
  templateUrl: 'send-quote-modal.html',
})
export class SendQuoteModal {
  quote: QuoteOptions =
    {id: 0, serviceProviderId : 0, serviceRequestId: 0, totalAmount: 0, labourCost: null, transportation: 0, 
      itemsTotalAmount: 0, processingFee: 0, differential: 0, note: '', items : [], providerPayableBalance: 0,
      isActive: true, newItems: [], createdDate: new Date()};
  hintText: string;
  providerData: ServiceProviderModel;
  items: ItemModel[];
  @ViewChild('itemComponent') itemComponent: IonicSelectableComponent;


  constructor(public viewCtrl: ViewController, public _common: Common,
              public navCtrl: NavController, public navParams: NavParams, 
              private _userData: UserData, public _quotesService: QuotesService, public modalCtrl: ModalController,
              public popoverCtrl: PopoverController, private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.getAllItems();
    this._userData.getProviderData().then((providerData) => {
      this.providerData = providerData;
      this.quote.serviceProviderId = this.providerData.id;
    });
    if (this.navParams.data.quote != null) {
      this.quote = this.navParams.data.quote;
      this.quote.totalAmount = this.quote.itemsTotalAmount + this.quote.transportation + this.quote.labourCost;
      //Use foreach cos, model structure of quote.items is different from received quote, when quote is to be edited
      this.quote.items = [];
      this.quote.newItems = [];
      this.navParams.data.quote.quoteItems.forEach((quoteItem) => {
        this.quote.items.push({name: quoteItem.item.name, requestQuoteId: quoteItem.requestQuoteId, itemId: quoteItem.itemId, 
                              quantity: quoteItem.quantity, unitCost: quoteItem.unitCost, totalAmount: quoteItem.totalAmount})
      });
    }
    else
      this.quote.serviceRequestId = this.navParams.data.requestId;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  calculateCost() {
    this.quote.totalAmount = +this.quote.labourCost + +this.quote.transportation + this.quote.itemsTotalAmount;
    this.quote.totalAmount = (isNaN(this.quote.totalAmount)) ? 0 : this.quote.totalAmount;
  }

  getAllItems() {
    this._quotesService.getAllItems().subscribe((result) => {
        if (result) {
          this.items = result.items;
        }
      },
      error => {
        this._common.showToast('Error Fetching Existing Items');
        console.log("Error: ", error);
      },
      () => {
        // observer.next(success);
        // observer.complete();
      });
  }

  showItemPopover($event) {
    const popover = this.popoverCtrl.create(AddItemPopoverPage, {quote: this.quote, items: this.items});
    popover.present();
    popover.onDidDismiss(data => {
      if(data != null) {
        this.quote = data;
        this.quote.itemsTotalAmount = this.quote.items.reduce((sum, item) => sum + item.totalAmount, 0) +
                              this.quote.newItems.reduce((sum, item) => sum + item.totalAmount, 0)
      }
    });
  }

  submitQuote(form: NgForm) {
    if (form.valid) {
      //parse Int Proper Usage
      //this.quote.totalAmount = parseInt(this.quote.totalAmount, 10) + parseInt(this.quote.labourCost, 10);
      
      this._common.showLoading('Submitting Quote...');
      this._quotesService.sendQuote(this.quote, this.quote.id).subscribe((result) => {
          this._common.hideLoading();
          if (!result.status) {
            this._common.showToast(result.message);
          }
          else {
            this._common.showPopup('Quote Sent SuccessFully', 'Wait for acceptance notification from client');
            let recentActivities: RecentActivitiesModel = {projectId: this.quote.serviceRequestId, type: 'quote',
              description: 'You Sent a Quote to the Client', location: this.providerData.workLocation, createdDate: new Date}
            this._userData.setRecentActivities(recentActivities);
            this.dismiss();
          }
        },
        error => {
          this._common.hideLoading();
          this._common.handleError(error);
          console.log('Error: ', error);
        },
        () => {
          // observer.next(success);
          // observer.complete();
        });
    }
  }

  removeItem(itemToRemove: ServiceQuoteItemOptions) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Are you sure you want to delete this Item');
    alert.addButton('No');
    alert.addButton({
      text: 'Yes',
      handler: () => {
        this.quote.items.forEach( (item, index) => {
          if(item === itemToRemove) this.quote.items.splice(index,1);
        });
        this.quote.itemsTotalAmount -= itemToRemove.totalAmount;
        this.quote.totalAmount -= itemToRemove.totalAmount;
      }
    });

    alert.present();
  }

  removeNewItem(itemToRemove: ServiceRequestQuoteNewItemModel) {
    let alert = this.alertCtrl.create();
    alert.setTitle('Are you sure you want to delete this Item');
    alert.addButton('No');
    alert.addButton({
      text: 'Yes',
      handler: () => {
        this.quote.newItems.forEach( (item, index) => {
          if(item === itemToRemove) this.quote.newItems.splice(index,1);
        });
        this.quote.itemsTotalAmount -= itemToRemove.totalAmount;
        this.quote.totalAmount -= itemToRemove.totalAmount;  
      }
    });

    alert.present();
  }
}
