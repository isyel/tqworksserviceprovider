import { ServiceCategoryModel } from "./service-category-model";
import { BaseModel } from "./BaseModel";
import { SubCategoryModel } from "./SubCategoryModel";

export class ItemModel extends BaseModel {
  public name: string;
  public description: string;
  public categoryId: number;
  public category: ServiceCategoryModel;
  public subCategoryId: number;
  public subCategory: SubCategoryModel;
  public unitCost: number;
  public creatorUserId: number;
  public requiredApproval: boolean;
  public added: boolean = false;
}
