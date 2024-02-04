import {NextFunction, Request, Response} from "express";
import { validationResult } from "express-validator";
import {BadRequestError} from "../errors/clientErrors";

export function validateRequestSchema(req: Request, res: Response, next : NextFunction) {
    const error = validationResult(req);
    if (!error.isEmpty()){
        next(new BadRequestError(error.array(), "Validation failed!"));
    }
    next();
}