import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {ApiService} from "../../app/app.service";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {ServiceRequestModel} from "../../models/service-request-model";
import { PaginateModel } from '../../models/paginate-model';
import * as signalR from "@aspnet/signalr";

/*
  Generated class for the WalletServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceRequestService {

  _actionUrl: string = 'ServiceRequests/';
  data: ServiceRequestModel[];
  private hubConnection: signalR.HubConnection
  // advert: Advert;

  constructor(public http: HttpClient, public _service: ApiService) {
    console.log('Hello ServiceRequestServiceProvider Provider');
    _service.actionUrl = this._actionUrl;
  }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl('https://signalr.tqworksng.com/hubs/ServiceHub')
                            .build();
 
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addRecieveProjectUpdateListener = () => {
    this.hubConnection.on('RecieveProjectUpdate', (data) => {
      console.log("RecieveProjectUpdate: ", data);
    });
  }

  public getAll() {
    this._service.actionUrl = 'ServiceRequests/';
    if (this.data) {
      return Observable.of(this.data);
    } else {
      return this._service.getAll<ServiceRequestModel[]>();
      // .map(this.processData, this);
    }
  }

  public acceptJob(credentials) {
    if (!credentials) {
      return Observable.throw({ message: "Please enter valid Bid Details" });
    } else {
      this._service.actionUrl = 'ServiceRequests/AcceptProject';
      return this._service.post<any>(credentials);
    }
  }

  public rejectJob(credentials) {
    if (!credentials) {
      return Observable.throw({ message: "Please enter valid Bid Details" });
    } else {
      this._service.actionUrl = 'ServiceRequests/RejectProject';
      return this._service.post<any>(credentials);
    }
  }

  public cancelJob(credentials) {
    if (!credentials) {
      return Observable.throw({ message: "Please enter valid Bid Details" });
    } else {
      this._service.actionUrl = 'ServiceRequests/CancelProject';
      return this._service.post<any>(credentials);
    }
  }

  public completedJob(credentials) {
    if (!credentials) {
      return Observable.throw({ message: "Please enter valid request details"});
    } else {
      this._service.actionUrl = 'ServiceRequests/ProviderFinishedProject';
      return this._service.post<any>(credentials);
    }
  }

  public getOne(id: number) {
    if (!id) {
      return this._service.handleError("Invalid Request");
    } else {
      this._service.actionUrl = 'ServiceRequests/';
      return this._service.getOne<any>(id);
    }
  }

  public getJobAlert(providerId: number) {
    if (!providerId) {
      return this._service.handleError("Invalid Request");
    } else {
      this._service.actionUrl = 'JobAlerts/GetActiveJob/';
      return this._service.getOne<any>(providerId);
    }
  }

  public getByProvider(parameters, SearchKeyword = '', pageNumber = 0 , perPage = 20) {
    this._service.actionUrl = this._actionUrl + 'GetByProvider/' + parameters + '?SearchKeyword=' + SearchKeyword + '&PageNumber=' + pageNumber +'&PageSize=' + perPage;;
    return this._service.getAll<PaginateModel>();
  }

  public delete(id: number) {
    if (!id) {
      return Observable.throw({ status: false, message: "Invalid Request Data" });
    } else {
      return this._service.delete<any>(id);
    }
  }

}
