import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { MerchantModel } from '../../models/merchantModel';
import { UserData } from '../../providers/user-data';
import { UserModel } from '../../models/user-model';
import { MerchantsItemsListModalPage } from '../merchants-items-list-modal/merchants-items-list-modal';
import { Common } from '../../app/app.common';
import { ServiceRequestQuoteModel } from '../../models/service-request-quote-model';
import { MerchantsServiceProvider } from '../../providers/services/merchants-service';
import { ServiceRequestModel } from '../../models/service-request-model';
import { ServiceRequestService } from '../../providers/services/service-request-service';
import { ItemModel } from '../../models/item-model';
import { AccountStatusEnum } from '../../enum/AccountStatusEnum';

/**
 * Generated class for the MerchantsListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-merchants-list',
  templateUrl: 'merchants-list.html',
})
export class MerchantsListPage {
  quote: ServiceRequestQuoteModel;
  userDetails: UserModel;
  merchantsList: MerchantModel[];
  serviceRequest: ServiceRequestModel;
  loading: boolean;
  pageNumber: number = 0;
  perPage: number = 20;
  itemQuantity: number;
  item: ItemModel;
  searchKeyword: string;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public _merchantsService: MerchantsServiceProvider, public _userData: UserData,
    public modalCtrl: ModalController, public _serviceRequest: ServiceRequestService,
    public _common: Common) {
  }

  ngOnInit() {
    
    console.log('navParams.data: ', this.navParams.data);
    this.item = this.navParams.data.item.itemDetails;
    this.itemQuantity = this.navParams.data.item.itemQuantity;
    this.quote = this.navParams.data.quote;
    this.quote.serviceRequest == null ? this.getServiceRequest() : this.getMerchantsList();
  }

  ionViewDidLoad() {
    this._userData.getUserData().then((userData) => {
      this.userDetails = userData;
    });
    console.log('ionViewDidLoad MerchantsListPage');
  }

  getServiceRequest() {
    this.loading = true;
    this._serviceRequest.getOne(this.quote.serviceRequestId).subscribe((result) => {
        this.serviceRequest = result;
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
        this.merchantsList = result.items;
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.log(error);
      },
      () => {
      });
  }

  purchaseProduct(merchant) {
    let purchaseProductsOptions = {merchantId: merchant.id, itemId: this.item.id};
    this._merchantsService.purchaseProdoucts(purchaseProductsOptions).subscribe((result) => {
      this.serviceRequest = result;
      this.loading = false;
    },
    error => {
      this.loading = false;
      console.log(error);
    },
    () => {
    });
  }

}
