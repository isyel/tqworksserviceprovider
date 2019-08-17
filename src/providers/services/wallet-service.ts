import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {ApiService} from "../../app/app.service";
import {HttpClient} from "@angular/common/http";
import { PaginateModel } from '../../models/paginate-model';
import { WalletBalanceModel } from '../../models/wallet-model';

/*
  Generated class for the WalletServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WalletService {

  _actionUrl: string = 'Wallets/';

  constructor(public http: HttpClient, public _service: ApiService) {
  }

  ngOnInit() {
    console.log('Hello WalletServiceProvider Provider');
    this._service.actionUrl = this._actionUrl;
  }

  public getBalance(userId: number, walletType) {
    if (!userId) {
      return this._service.handleError("Invalid Request");
    } else {
      this._service.actionUrl = this._actionUrl + 'GetWalletBalance/';
      let paramName = '?walletType=';
      return this._service.getOneWithParam<WalletBalanceModel>(userId, paramName, walletType);
    }
  }

  public getTransactionHistory(walletId: number, pageNumber, perPage) {
    this._service.actionUrl = this._actionUrl + 'GetWalletHistory/' + walletId + '?PageNumber=' + pageNumber +'&PageSize=' + perPage;
    return this._service.getAll<PaginateModel>();
  }

}
