import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {NotificationsPage} from "../notifications/notifications";
import {UserData} from "../../providers/user-data";
import {WalletService} from "../../providers/services/wallet-service";
import {Common} from "../../app/app.common";
import { WalletTypeEnum } from '../../enum/WalletTypeEnum';
import { WalletBalanceModel, WalletHistoryModel } from '../../models/wallet-model';
import { PaymentTypeEnum } from '../../enum/PaymentTypeEnum';


/**
 * Generated class for the WalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
  transactionHistory: WalletHistoryModel[];
  walletBalance: WalletBalanceModel;
  hintText: string;
  loading: boolean;
  pageNumber: number = 0;
  perPage: number = 15;
  totalData: number;
  totalPage: number;
  walletId: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private _userData: UserData, private _walletService: WalletService,
              public _common: Common) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletPage');
    this.updateOfflineWalletBalance();
    this.getOfflineTransactionHistory();
  }

  goToNotifications($event) {
    console.log($event);
    this.navCtrl.push(NotificationsPage);
  }

  getPaymentTypeValue(paymentType: number): string {
    switch (paymentType) {
      case PaymentTypeEnum.charges:
        return 'charges';
      case PaymentTypeEnum.deposit:
        return 'deposit';
      case PaymentTypeEnum.income:
        return 'income';
      case PaymentTypeEnum.withdrawal:
        return 'withdrawal';
    }
  }

  updateOfflineWalletBalance() {
    this.loading = true;
    this._userData.getWalletBalance().then((result) => {
        if (result) {
          if (result == null) {
            this.getWallet();
          }
          else {
            this.loading = false;
            this.walletBalance = result;
          }
        }
        this.getWallet();
      });
  }

  getWallet() {
    this._userData.getUserId().then((userId)=> {
      this._walletService.getBalance(userId, WalletTypeEnum.provider).subscribe(
        (result) => {
          if (result == null) {
            console.log('Could Not Fetch Wallet Balance');
          }
          else {
            this.walletBalance = result;
            this._userData.setWalletBalance(this.walletBalance);
            this.getTransactionHistory(this.walletBalance.id);
          }
        },
        error => {
          console.log('Error Fetching Wallet Balance: ', error);
        },
        () => {
          // observer.next(success);
          // observer.complete();
        });
    });
  }

  getOfflineTransactionHistory() {
    this._userData.getOfflineWalletHistoryData().then((result) => {
        this.transactionHistory = result;
    });
  }

  getTransactionHistory(walletId) {
    this.loading = true;
    this.pageNumber = 0;
    this.walletId = walletId;
    this._walletService.getTransactionHistory(walletId, this.pageNumber, this.perPage).subscribe(
      (result) => {
        this.loading = false;
        if (result == null) {
          console.log('No transaction Data');
        }
        else {
          this.totalData = result.totalCount;
          this.totalPage = result.totalPages;
          this.transactionHistory = [];
          this.transactionHistory = result.items;
          this._userData.setOfflineWalletHistoryData(this.transactionHistory);
        }
      },
      error => {
        this.loading = false;
        console.log(error);
        this._common.showToast('Wallet Balance Shown Here Might Be Inconsistent');
      },
      () => {
        // observer.next(success);
        // observer.complete();
      });
  }

  doInfinite(infiniteScroll) {
    this.pageNumber = this.pageNumber + 1;
    if(this.pageNumber < this.totalPage) {
      infiniteScroll.enable(true);
    }
    setTimeout(() => {
      this._walletService.getTransactionHistory(this.walletId, this.pageNumber, this.perPage).subscribe(
        (result) => {
          if (result == null || result.items.length == 0) {
            this.hintText = 'No More Transaction History To Show';
            this._common.showToast(this.hintText);
            
          }
          else {
            this.totalData = result.totalCount;
            this.totalPage = result.totalPages;
            for(let i = 0; i < result.items.length; i++) {
              this.transactionHistory.push(result.items[i]);
            }
            if(this.pageNumber >= this.totalPage) {
              infiniteScroll.enable(false);
            }
          }
        },
        error => {
          this.hintText = 'Network Error';
          this._common.showToast(this.hintText);
          console.log('Error: ', error);
        });
      infiniteScroll.complete();
    }, 1000);
  }

}
