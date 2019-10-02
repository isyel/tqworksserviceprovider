import {PersonModel} from "./person-model";
import { UserModel } from "./user-model";
import { AccountStatusEnum } from "../enum/AccountStatusEnum";

export class MerchantModel extends PersonModel {
    public userId: number;
    public user: UserModel;
    public businessName: string;
    public businessAddress: string;
    public businessPhoneNumber: string;
    public mobileNumber2: string;
    public mobileNumber3: string;
    public businessEmail: string;
    public logo: string;
    public city: string;
    public lgaId: number;
    public stateId: number;
    public state: string;
    public country: string;
    public latitude: number;
    public longitude: number;
    public effectiveDate: Date;
    public accountStatus: AccountStatusEnum;
    public isActive: boolean;
    public maxRating: number;
    public pendingUpdateApproval: boolean;
    public approvedById: number;
    public approvedBy: UserModel;
    public approvedDate: Date;
    public categories : any[];
    public serviceCategoryIds: number[];
}
