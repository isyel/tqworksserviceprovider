import { BaseModel } from "./BaseModel";

export class PersonModel extends BaseModel {
  public firstName: string;
  public lastName: string;
  public email: string;
  public phoneNumber: string;
}