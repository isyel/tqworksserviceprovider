

import { ServiceQuoteItemOptions, ServiceRequestQuoteNewItemModel } from "./service-quote-item-options";

export interface QuoteOptions {
  id: number;
  serviceRequestId: number;
  serviceProviderId: number;
  labourCost: number;
  transportation: number;
  itemsTotalAmount: number;
  processingFee: number;
  providerPayableBalance: number;
  totalAmount: number;
  differential: number;
  note: string;
  isActive: boolean;
  createdDate: Date;
  items: ServiceQuoteItemOptions[];
  newItems: ServiceRequestQuoteNewItemModel[];
}
