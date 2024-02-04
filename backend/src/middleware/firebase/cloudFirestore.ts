import {firestore} from "firebase-admin";
import {USERS_COLLECTION} from "../../utils/consts";
import {NextFunction, Request, Response} from "express";
import {BadRequestError} from "../errors/clientErrors";

/**
 * Überprüft ob der Admin auch zu der Shipping Company gehört.
 *
 * @param req
 * @param res
 * @param next
 */
export async function checkIfAdminBelongsToThisShippingCompany(req: Request, res : Response, next : NextFunction) {
    const adminUserId = req.body.uid;
    const shippingCompanyId = req.params.shippingCompanyId;
    const userDoc = await firestore()
        .collection(USERS_COLLECTION)
        .doc(adminUserId)
        .get();
    if(userDoc.exists){
        if(shippingCompanyId === userDoc.get("shippingCompanyId")){
            next();
        } else {
            next(new BadRequestError("The admin does not belong to this shipping company."));
        }
    } else {
        next(new BadRequestError("The admin with this id does not exist."));
    }
}