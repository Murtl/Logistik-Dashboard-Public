import {NextFunction, Request, Response} from "express";
import {MasterDataModel} from "../models/masterDataModel";
import {createMasterData, getMasterData, updateMasterData} from "../services/masterDataService";
import {BadRequestError} from "../middleware/errors/clientErrors";

export async function createMasterDataHandler(req : Request, res : Response, next : NextFunction) {
    const shippingCompanyId : string = req.params.shippingCompanyId;
    const masterData : MasterDataModel = req.body as MasterDataModel;
    createMasterData(masterData, shippingCompanyId)
        .then(() => {
            res.status(201).send({msg : "Successfully created."})
        })
        .catch((error : any) => {
            next(new BadRequestError(error, "MasterData could not be created!"));
        });
}

export async function getMasterDataHandler(req : Request, res : Response, next : NextFunction) {
    const shippingCompanyId : string = req.params.shippingCompanyId;
    getMasterData(shippingCompanyId)
        .then((masterData : MasterDataModel) => {
            if (!masterData.dispatcherSalary) {
                res.status(204).send();
            } else {
                const result : MasterDataModel = {
                    shippingCompanyName : masterData.shippingCompanyName,
                    regularPlanningTime : masterData.regularPlanningTime,
                    dispatcherSalary : masterData.dispatcherSalary,
                    resources : masterData.resources
                }
                res.status(200).send(result);
            }
        })
        .catch((error : any) => {
            next(new BadRequestError(error, "MasterData could not be fetched!"));
        });
}

export async function updateMasterDataHandler(req : Request, res : Response, next : NextFunction) {
    const shippingCompanyId : string = req.params.shippingCompanyId;
    const masterData : MasterDataModel = req.body as MasterDataModel;
    updateMasterData(masterData, shippingCompanyId)
        .then(() => {
            res.status(200).send({msg : "Successfully updated."});
        }).catch((error : any) => {
            next(new BadRequestError(error, "MasterData could not be updated!"));
        });
}
