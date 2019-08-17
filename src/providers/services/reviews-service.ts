import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {ApiService} from "../../app/app.service";
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import { RatingOptions } from '../../interfaces/rating-options';
import { PaginateModel } from '../../models/paginate-model';

/*
  Generated class for the ReviewsServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ReviewsService {

  _actionUrl: string = 'Ratings/';
  data: PaginateModel;
  
  // advert: Advert;

  constructor(public http: HttpClient, public _service: ApiService) {
    console.log('Hello ReviewsServiceProvider Provider');
    _service.actionUrl = this._actionUrl;
  }

  public getAll(userId, ratingType) {
    if (this.data) {
      return Observable.of(this.data);
    } else {
      this._service.actionUrl = this._actionUrl + 'GetUserRatings?userId=' + userId + '6&ratingType=' + ratingType;
      return this._service.getAll<PaginateModel>();
      // .map(this.processData, this);
    }
  }

  public getRatingDetails() {
    this._service.actionUrl = 'RatingDetails/';
    return this._service.getAll<any>();
  }

  public sendClientReview(credentials: RatingOptions) {
    if (!credentials) {
      return  Observable.throw({ message: "Please enter valid Review Details" });
    } else {
      this._service.actionUrl = 'Ratings/';
      return this._service.post<any>(credentials);
    }
  }

}
