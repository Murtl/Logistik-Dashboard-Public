import {NextFunction, Response, Request} from "express";
import {
    deleteAdminUserInFirebase,
    deleteCompanyWithAllRelatedDataAndUsersInFirestore,
    getAllAdminUsersFromFirestore,
    initAdminAndShippingCompany, updateAdminUserInFirebase,
    updateAdminUserInFirestore
} from "../services/superAdminService";
import {BadRequestError} from "../middleware/errors/clientErrors";
import {CreateAdminUserRequest, UpdateAdminUserRequest} from "../models/adminModel";

export function initAdminAndShippingCompanyHandler(req: Request, res : Response, next : NextFunction){
    const model : CreateAdminUserRequest = req.body;
    initAdminAndShippingCompany(model)
        .then(adminUserResponse => {
            res.status(201).send(adminUserResponse);
        })
        .catch((error : any) => {
           next(new BadRequestError(error));
        });
}

export async function getAllAdminUsersHandler(req: Request, res : Response, next : NextFunction){
    getAllAdminUsersFromFirestore()
        .then(adminUserResponseList => {
            res.status(200).send(adminUserResponseList);
        })
        .catch((error : any) => {
            next(new BadRequestError(error));
        });
}

export async function updateAdminUserHandler(req: Request, res : Response, next : NextFunction){
    const adminUserRequest : UpdateAdminUserRequest = req.body;
    try {
        await updateAdminUserInFirebase(adminUserRequest, req.params.adminId);
        await updateAdminUserInFirestore(adminUserRequest, req.params.adminId);
        res.status(200).send({msg : "Successfully updated."});
    } catch (error) {
        next(new BadRequestError(error));
    }
}

export async function deleteAdminUserHandler(req: Request, res : Response, next : NextFunction){
    const adminId : string = req.params.adminId;
    const shippingCompanyId : string = req.params.shippingCompanyId;
    try {
        const userIDs: string[] = await deleteCompanyWithAllRelatedDataAndUsersInFirestore(adminId, shippingCompanyId);
        await deleteAdminUserInFirebase(userIDs);
        res.status(200).send({msg : "Successfully deleted."});
    } catch (error) {
        next(new BadRequestError(error));
    }
}

