﻿﻿
import {RatingDetailModel} from "./rating-detail-model";
import {UserModel} from "./user-model";
import { RatingTypeEnum } from "../enum/RatingTypeEnum";
import { BaseModel } from "./BaseModel";

export class RatingModel extends BaseModel  {
    public userId: number;
    public ratingType: RatingTypeEnum;
    public avgRating: number;
    public comment: string;
    public ratedByUserId: number;
    public ratedByUser: UserModel;
    public showIdentity: boolean;
    public isApproved: boolean;
    public isActive: boolean;
    public ratingDetails: RatingDetailModel[];
}
