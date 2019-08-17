﻿import { RatingModel } from "../models/rating-model";

export class RatingDetailOptions {
    public ratingId: number;
    public rating: RatingModel;
    public ratingOptionId: number;
    public ratingOption: {title: string};
    public ratingValue: number;
}
