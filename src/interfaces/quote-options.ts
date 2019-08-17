

import { ServiceQuoteItemOptions, ServiceRequestQuoteNewItemModel } from "./service-quote-item-options";

export interface QuoteOptions {
  id: number;
  serviceRequestId: number;
  serviceProviderId: number;
  labourCost: number;
  transportation: number;
  itemTotalAmount: number;
  processingFee: number;
  totalAmount: number;
  differential: number;
  note: string;
  isActive: boolean;
  createdDate: Date;
  items: ServiceQuoteItemOptions[];
  newItems: ServiceRequestQuoteNewItemModel[];
}
