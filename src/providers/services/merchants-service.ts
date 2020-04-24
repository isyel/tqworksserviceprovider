import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../../app/app.service';

/*
  Generated class for the MerchantsServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MerchantsServiceProvider {
  _actionUrl: string = 'Merchants';

  constructor(public http: HttpClient, public _service: ApiService) {
    console.log('Hello MerchantsServiceProvider Provider');
  }

  
  public getMerchantsList(categoryId: number, longitude: number, latitude: number, status: any,
    seacrhKeyword: string): any{
      this._service.actionUrl = this._actionUrl + '?CategoryId=' + categoryId + "&Longitude=" + 
      longitude + "&Latitude=" + latitude + "&Status=" + status + "&SearchKeyword=" + 
      seacrhKeyword;
      return this._service.getAll<any>();
  }

  public purchaseProdoucts(credentials: any): any{
      this._service.actionUrl = this._actionUrl + '/PurchaseProducts'
      return this._service.getAll<any>();
  }

}
