import {NextFunction, Request, Response} from "express";
import logger from "../../utils/logger";
import {CustomError} from "./customError";
import {InternalServerError} from "./serverErrors";

export function errorResponder(err : TypeError | CustomError, req : Request, res : Response, next : NextFunction) {
    let customError = err;
    if(!(err instanceof CustomError)){
        customError = new InternalServerError(err, "Something went terribly wrong!");
    }
    res.status((customError as CustomError).status).send(customError);
}

export function errorLogger(err : TypeError | CustomError, req : Request, res : Response, next : NextFunction) {
    logger.error(err);
    next(err);
}