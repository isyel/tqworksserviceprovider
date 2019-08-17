﻿﻿import { ServiceRequestQuoteModel } from "./service-request-quote-model";
import { ItemModel } from "./item-model";

export class ServiceRequestQuoteItemModel {
  public requestQuoteId: number;
  public requestQuote: ServiceRequestQuoteModel;
  public itemId: number;
  public item: ItemModel;
  public quantity: number;
  public unitCost: number;
  public totalAmount: number;
}