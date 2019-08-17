import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {ApiService} from "../../app/app.service";
import {HttpClient} from "@angular/common/http";
import {UserModel} from "../../models/user-model";
import {ServiceProviderModel} from "../../models/service-provider-model";
import {ServiceCategoryModel} from "../../models/service-category-model";
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the WalletServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserService {

  _actionUrl: string = 'Users/';
  data: UserModel[];
  paramName: string;
  param: number;
  // advert: Advert;

  constructor(public http: HttpClient, public _service: ApiService) {
    console.log('Hello UserServiceProvider Provider');
    _service.actionUrl = this._actionUrl;
  }

  public getOne(id: number) {
    this._service.actionUrl = this._actionUrl;
    if (!id) {
      return this._service.handleError("Invalid Request");
    } else {
      return this._service.getOne<UserModel>(id);
    }
  }

  public getProvider(id: number) {
    this._service.actionUrl = 'ServiceProviders/GetByUser/';
    if (!id) {
      return this._service.handleError("Invalid Request");
    } else {
      return this._service.getOne<ServiceProviderModel>(id);
    }
  }

  public getProviderById(id: number) {
    this._service.actionUrl = 'ServiceProviders/';
    if (!id) {
      return this._service.handleError("Invalid Request");
    } else {
      return this._service.getOne<ServiceProviderModel>(id);
    }
  }

  public setProviderStatus(credentials) {
    if (!credentials) {
      return Observable.throw({ message: "Status Change Details Error" });
    } else {
      this._service.actionUrl = 'ServiceProviders/ChangeStatus/';
      return this._service.post<any>(credentials);
    }
  }

  public getServiceCategory(id: number) {
    if (!id) {
      return this._service.handleError("Invalid Request");
    } else {
      this._service.actionUrl = 'ServiceCategories/';
      return this._service.getOne<ServiceCategoryModel>(id);
    }
  }

  public getProfilePics(id: number) {
    if (!id) {
      return this._service.handleError("Invalid Request");
    } else {
      this._service.actionUrl = this._actionUrl + 'GetProfilePhoto/';
      return this._service.getOne<any>(id);
    }
  }

  public getSettingsByKey(key: string) {
    this._service.actionUrl = 'Settings/GetByKey?key='+key;
    return this._service.getAll<any>();
  }

}
