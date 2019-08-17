import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {ApiService} from "../../app/app.service";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {ServiceRequestQuoteModel} from "../../models/service-request-quote-model";
import { PaginateModel } from '../../models/paginate-model';

/*
  Generated class for the WalletServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class QuotesService {

  _actionUrl: string = 'ServiceRequestQuotes/';
  quoteData: ServiceRequestQuoteModel[];
  itemData: any;

  constructor(public http: HttpClient, public _service: ApiService) {
    console.log('Hello QuotesServiceProvider Provider');
    _service.actionUrl = this._actionUrl;
  }

  public getAll() {
    if (this.quoteData) {
      return Observable.of(this.quoteData);
    } else {
      return this._service.getAll<ServiceRequestQuoteModel[]>();
      // .map(this.processData, this);
    }
  }

  public getOne(id: number) {
    if (!id) {
      return this._service.handleError("Invalid Request");
    } else {
      this._service.actionUrl = this._actionUrl;
      return this._service.getOne<any>(id);
    }
  }

  public getByProject(projectId: number) {
    this._service.actionUrl = this._actionUrl + 'GetByProject/';
    return this._service.getOne<any>(projectId);
  }

  public getByServiceProvider(providerId: number) {
    this._service.actionUrl = this._actionUrl + 'GetByProvider/' + providerId;
    return this._service.getAll<ServiceRequestQuoteModel[]>();
  }

  public sendQuote(credentials, id) {
    if (!credentials) {
      return  Observable.throw({ message: "Please enter valid Bid Details" });
    } else {
      if (id == 0) {
        this._service.actionUrl = 'ServiceRequestQuotes/';
        return this._service.post<any>(credentials);
      }
      else {
        this._service.actionUrl = 'ServiceRequestQuotes/';
        return this._service.update<any>(id, credentials);
      }
      
    }
  }

  public getAllItems() {
    if (this.itemData) {
      return Observable.of(this.itemData);
    } else {
      this._service.actionUrl = 'Items/';
      return this._service.getAll<PaginateModel>();
      // .map(this.processData, this);
    }
  }

  public getAllMerchantItems(merchantId) {
    if (!merchantId) {
      return  Observable.throw({ status: false, message: "Invalid Request Data" });
    } else {
      this._service.actionUrl = 'Items/?merchantId=' + merchantId;
      return this._service.getAll<PaginateModel>();
      // .map(this.processData, this);
    }
  }

  public delete(id: number) {
    if (!id) {
      return  Observable.throw({ status: false, message: "Invalid Request Data" });
    } else {
      return this._service.delete<any>(id);
    }
  }

}
