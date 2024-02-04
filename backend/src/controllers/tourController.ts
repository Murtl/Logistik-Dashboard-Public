import {Response, Request, NextFunction} from "express";
import {getTours} from "../services/tourService";
import {Tour} from "../models/tourModel";
import {BadRequestError} from "../middleware/errors/clientErrors";

export async function getToursHandler(req : Request, res : Response, next : NextFunction) {
    const shippingCompanyId : string = req.params.shippingCompanyId;
    const date : string = req.body.date as string;

    getTours(shippingCompanyId, date)
        .then((tours : Tour[]) => {
            res.status(200).send(tours);
        })
        .catch((error : any) => {
            next(new BadRequestError(error, "Tours could not be fetched!"));
        });
}