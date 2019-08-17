﻿﻿

import {RatingModel} from "./rating-model";

export class RatingDetailModel {
    public ratingId: number;
    public rating: RatingModel;
    public ratingOptionId: number;
    public ratingOption: string;
    public ratingValue: number;
    public id: number;
    public createdDate:	string;
    public updatedDate:	string;
    public softDelete:	boolean;
    public deletedTime: string;
}
