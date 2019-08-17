﻿import { UserModel } from "../models/user-model";
import { RatingTypeEnum } from "../enum/RatingTypeEnum";
import { RatingDetailOptions } from "./rating-detail-options";

export class RatingOptions  {
    public userId: number;
    public ratingType: RatingTypeEnum;
    public avgRating: number;
    public comment: string;
    public ratedByUserId: number;
    public ratedByUser: UserModel;
    public showIdentity: boolean;
    public isApproved: boolean;
    public isActive: boolean;
    public ratingDetails: RatingDetailOptions[];
}
