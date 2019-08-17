import {PersonModel} from "./person-model";
import { MerchantModel } from "./merchantModel";

export class MerchantContactPersonModel extends PersonModel {
    public merchantId: number;
    public merchant: MerchantModel;
    public phoneNumber2 : string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public phoneNumber: string;
}
