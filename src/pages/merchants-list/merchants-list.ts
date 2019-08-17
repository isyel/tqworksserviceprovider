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
import { AccountStatusEnum } from '../../enum/AccountStatusEnum';
import { ServiceRequestService } from '../../providers/services/service-request-service';

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
  searchKeyword: string;
  loading: boolean;
  pageNumber: number = 0;
  perPage: number = 20;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public _merchantsService: MerchantsServiceProvider, public _userData: UserData,
    public modalCtrl: ModalController, public _serviceRequest: ServiceRequestService,
    public _common: Common) {
  }

  ngOnInit() {
    this.quote = this.navParams.data.quote;
    if(this.quote.serviceRequest != null) {
      this.serviceRequest = this.quote.serviceRequest;
      this.getMerchantsList();
    } else {
      this.getServiceRequest();
    }
  }

  ionViewDidLoad() {
    
    this._userData.getUserData().then((userData) => {
      this.userDetails = userData;
    });
    
    console.log('ionViewDidLoad MerchantsListPage');
  }

  getMerchantsList() {
    this.loading = true;
    this._merchantsService.getMerchantsList(this.serviceRequest.serviceCategoryId, this.serviceRequest.longitude, 
      this.serviceRequest.latitude, AccountStatusEnum.active, this.searchKeyword, this.pageNumber).subscribe((result) => {
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

  presentProductListModal(merchantId) {
    let merchantsItemsList = this.modalCtrl.create(MerchantsItemsListModalPage, { merchantId: merchantId }, 
      { cssClass: 'inset-modal' });
    merchantsItemsList.present();
    merchantsItemsList.onDidDismiss(() => {
    });
  }

}
