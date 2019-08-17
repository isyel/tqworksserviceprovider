import {UserModel} from "./user-model";

export class TransactionLogModel {
  userId: number;
  user: UserModel;
  transactionType: string;
  refNumber: string;
  paymentChannel: string;
  amount: number;
  paymentDate: string;
  status: boolean;
  statusMessage: string;
  id: number;
  createdDate: string;
  updatedDate: string;
  softDelete: boolean;
  deletedTime: string
}
