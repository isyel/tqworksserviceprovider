﻿﻿
import {UserModel} from "./user-model";
import {NotificationTypeEnum} from "../enum/NotificationTypeEnum";
import { BaseModel } from "./BaseModel";

export class NotificationModel extends BaseModel {
  public userId: number;
  public user: UserModel;
  public type: NotificationTypeEnum;
  public title: string;
  public message: string;
  public jsonData: string;
  public seen: boolean;
}
