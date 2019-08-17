﻿﻿

import {ServiceRequestModel} from "./service-request-model";
import {ServiceProviderModel} from "./service-provider-model";
import {ServiceRequestQuoteItemModel} from "./service-request-quote-item-model";
import { BaseModel } from "./BaseModel";

export class ServiceRequestQuoteModel extends BaseModel {
    public serviceRequestId: number;
    public serviceRequest: ServiceRequestModel;
    public serviceProviderId: number;
    public serviceProvider: ServiceProviderModel;
    public labourCost: number;
    public transportation: number;
    public processingFee: number;
    public itemTotalAmount: number;
    public totalAmount: number;
    public differential: number;
    public commitmentFee: number;
    public payableBalance: number;
    public note: string;
    public isApproved: boolean;
    public approvedDate: Date;
    public isRejected: boolean;
    public rejectedReason: string;
    public isPaid: boolean;
    public amountPaid: number;
    public paymentDate: Date;
    public isActive: boolean;
    public quoteItems: ServiceRequestQuoteItemModel[];
}
