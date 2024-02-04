import {NextFunction, Request, Response} from "express";
import {getKpisByRequest} from "../services/kpiService";
import {KpiRequest} from "../models/kpiModel";
import {BadRequestError} from "../middleware/errors/clientErrors";

export async function getKpisByRequestHandler(req : Request, res : Response, next : NextFunction) {
    const kpiRequest : KpiRequest = req.body;
    kpiRequest.shippingCompanyId = req.params.shippingCompanyId;
    getKpisByRequest(kpiRequest)
        .then(kpiNames => {
            res.status(200).send(kpiNames);
        })
        .catch((error : any) => {
            next(new BadRequestError(error, "Error while getting kpi names"));
        });
}