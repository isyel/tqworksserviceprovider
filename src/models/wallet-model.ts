


import { BaseModel } from './BaseModel';
import { WalletTypeEnum } from '../enum/WalletTypeEnum';
import { UserModel } from './user-model';
import { PaymentTypeEnum } from '../enum/PaymentTypeEnum';

export class UserWalletModel extends BaseModel {
    public userId: number;
    public user: UserModel;
    public walletType: WalletTypeEnum;
    public referenceNumber: string;
    public balance: number;
    public amountLien: number;
    public isActive: boolean;
    public walletHistory: WalletHistoryModel[];
}

export class WalletBalanceModel{
    public id: number;
    public userId: number;
    public walletType: WalletTypeEnum;
    public balance: number;
    public amountLien: number;
    public isActive: boolean;
    public totalIncome: number;
    public totalWithdrawal: number;
    public totalPaidout: number;
}

export class WalletHistoryModel extends BaseModel {
    public walletId: number;
    public transactionReference: string;
    public paymentType: PaymentTypeEnum;
    public amount: number;
    public paymentDate: Date;
    public naration: string;
    public isApproved: boolean;
    public approvedDate: Date;
}