import {UserModel} from "./user-model";
import { PersonModel } from "./person-model";
import { ServiceCategoryModel } from "./service-category-model";
import { AvailabilityEnum } from "../enum/AvailabilityEnum";
import { AccountStatusEnum } from "../enum/AccountStatusEnum";

export class ServiceProviderModel extends PersonModel {
    public userId: number;
    public user: UserModel;
    public categories : any[];
    public serviceCategoryId: number;
    public serviceCategory: ServiceCategoryModel;
    public averageBillPerHour: number;
    public biography: string;
    public dateOfBirth: Date;
    public mobileNumber2: string;
    public mobileNumber3: string;
    public homeAddress1: string;
    public homeAddress2: string;
    public homeLgaid: string;
    public homeStateId: string;
    public workLocation: string;
    public city: string;
    public state: string;
    public country: string;
    public latitude: number;
    public longitude: number;
    public effectiveDate: Date;
    public availability: AvailabilityEnum;
    public accountStatus: AccountStatusEnum;
    public isActive: boolean;
    public maxRating: number;
    public photograph: string;
    public approvedById: number;
    public approvedBy: UserModel;
    public approvedDate: Date;
}
