import { BaseModel } from "./BaseModel";
import { ServiceCategoryModel } from "./service-category-model";


export class SubCategoryModel extends BaseModel {
    public categoryId: number;
    public category: ServiceCategoryModel;
    public name: string;
}