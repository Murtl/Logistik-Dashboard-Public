import {CustomError} from "./customError";

/**
 * HTTP status code: 400
 */
class BadRequestError extends CustomError {
    constructor(additionalInfo: any = {}, message: string = "Bad Request") {
        super(message, 400, additionalInfo);
    }
}

/**
 * HTTP status code: 401
 */
class UnauthorizedError extends CustomError {
    constructor(additionalInfo: any = {}, message: string = "Unauthorized") {
        super(message, 401, additionalInfo);
    }
}

/**
 * HTTP status code: 403
 */
class ForbiddenError extends CustomError {
    constructor(additionalInfo: any = {}, message: string = "Forbidden") {
        super(message, 403, additionalInfo);
    }
}

/**
 * HTTP status code: 404
 */
class NotFoundError extends CustomError {
    constructor(additionalInfo: any = {}, message: string = "Not Found") {
        super(message, 404, additionalInfo);
    }
}

/**
 * HTTP status code: 409
 */
class ConflictError extends CustomError {
    constructor(additionalInfo: any = {}, message: string = "Conflict") {
        super(message, 409, additionalInfo);
    }
}

export {  BadRequestError
    , UnauthorizedError
    , ForbiddenError
    , NotFoundError
    , ConflictError
};