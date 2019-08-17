import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../../app/app.service";
import {Observable} from "rxjs/Rx";
import { PaginateModel } from '../../models/paginate-model';

/*
  Generated class for the NotificationServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationService {
  _actionUrl: string = 'Notifications/';
  data: PaginateModel;

  constructor(public http: HttpClient, public _service: ApiService) {
    console.log('Hello NotificationServiceProvider Provider');
    _service.actionUrl = this._actionUrl;
  }

  public getByUserId(userId, pageNumber = 0, perPage = 0) {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      this._service.actionUrl = this._actionUrl + 'GetbyUserId/' + userId + '?userType=Provider&pageIndex=' + pageNumber +'&PageSize=' + perPage;;
      return this._service.getAll<PaginateModel>();
      // .map(this.processData, this);
    }
  }

  public getOne(id: number) {
    if (!id) {
      return this._service.handleError("Invalid Request");
    } else {
      return this._service.getOne<any>(id);
    }
  }

  public markAsSeen(id: number) {
    if (!id) {
      return this._service.handleError("Invalid Request");
    } else {
      this._service.actionUrl = this._actionUrl + 'Seen/' + id;
      return this._service.post<any>(id);
    }
  }

  public pauseNotifications(credentials: any) {
    if (!credentials) {
      return this._service.handleError("Invalid Request");
    } else {
      this._service.actionUrl = 'DeviceToken/PushNotification/';
      return this._service.post<any>(credentials);
    }
  }

}
