import {NextFunction, Request, Response} from "express";
import {writeDataToFirestore} from "../services/importService";
import {BadRequestError} from "../middleware/errors/clientErrors";


export function uploadFileHandler(req: Request, res : Response, next : NextFunction) {
    const shippingCompanyId : string = req.params.shippingCompanyId;
    let file = req.file;
    if (!file) {
        next(new BadRequestError(`Error while uploading!`))
    } else {
        writeDataToFirestore(file, shippingCompanyId)
            .then(value => {
                res.status(200).send({msg : "Successfully uploaded"});
            })
            .catch((error : any) => {
                next(new BadRequestError(error, "An error occurred while writing to Firestore."));
            });
    }
}