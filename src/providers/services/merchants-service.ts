import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MerchantModel } from '../../models/merchantModel';
import { ApiService } from '../../app/app.service';

/*
  Generated class for the MerchantsServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MerchantsServiceProvider {
  _actionUrl: string = 'Merchants/';

  constructor(public http: HttpClient, public _service: ApiService) {
    console.log('Hello ProvidersServicesMerchantsServiceProvider Provider');
  }

  
  public getMerchantsList(categoryId: number, longitude: number, latitude: number, status: any,
    seacrhKeyword: string, pageNumber: number, pageSize: number = 10) {
      this._service.actionUrl = this._actionUrl + '?CategoryId=' + categoryId + "&Longitude=" + 
      longitude + "&Latitude=" + latitude + "&Status=" + status + "&SearchKeyword=" + 
      seacrhKeyword + "&PageNumber=" + pageNumber + "&PageSize=" + pageSize;
      return this._service.getAll<MerchantModel[]>();
  }

}
