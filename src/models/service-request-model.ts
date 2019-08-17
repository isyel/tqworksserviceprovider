﻿﻿import { UserModel } from "./user-model";
import { BaseModel } from "./BaseModel";
import { ServiceCategoryModel } from "./service-category-model";
import { ProjectStatusEnum } from "../enum/ProjectStatusEnum";
import { ServiceProviderModel } from "./service-provider-model";

export class ServiceRequestModel extends BaseModel {
    public userId: number;
    public user: UserModel;
    public serviceCategoryId: number;
    public serviceCategory: ServiceCategoryModel;
    public description: string;
    public budget: number;
    public location: string;
    public city: string;
    public state: string;
    public country: string;
    public latitude: number;
    public longitude: number;
    public status: ProjectStatusEnum;
    public serviceProviderId: number;
    public serviceProvider: ServiceProviderModel;
    public accepted: boolean;
    public acceptedDate: Date;
    public isApproved: boolean;
    public approvedDate: Date;
    public commitmentFeeDebited: boolean;
    public fullPaymentDebited: boolean;
    public fundReleased: boolean;
    public isActive: boolean;
    public cancellationReason: string;
    public quoteSummary: number
}
