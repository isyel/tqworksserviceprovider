import { BaseModel } from "./BaseModel";

export class ServiceCategoryModel extends BaseModel{
  public name: string;
  public featured: boolean;
  public isActive: boolean;
  public icon: string;
}
