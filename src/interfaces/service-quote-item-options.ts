import { ServiceCategoryModel } from "../models/service-category-model";
import { SubCategoryModel } from "../models/SubCategoryModel";

export class ServiceQuoteItemOptions{
  name: string;
  requestQuoteId: number;
  itemId: number;
  quantity: number;
  unitCost: number;
  totalAmount: number;
}

export class ServiceRequestQuoteNewItemModel {
  categoryId: number;
  category: ServiceCategoryModel
  subCategoryId: number;
  subCategory: SubCategoryModel;
  name: string;
  description: string;
  creatorUserId: number;
  requiredApproval: boolean;
  requestQuoteId: number;
  quantity: number;
  unitCost: number;
  totalAmount: number;
}