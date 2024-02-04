import {CustomError} from "./customError";

/**
 * HTTP status code: 500
 */
class InternalServerError extends CustomError {
    constructor(additionalInfo: any = {}, message: string = "Internal Server Error") {
        super(message, 500, additionalInfo);
    }
}

/**
 * HTTP status code: 501
 */
class NotImplementedError extends CustomError {
    constructor(additionalInfo: any = {}, message: string = "Not Implemented") {
        super(message, 501, additionalInfo);
    }
}

/**
 * HTTP status code: 502
 */
class BadGatewayError extends CustomError {
    constructor(additionalInfo: any = {}, message: string = "Bad Gateway") {
        super(message, 502, additionalInfo);
    }
}

/**
 * HTTP status code: 503
 */
class ServiceUnavailableError extends CustomError {
    constructor( additionalInfo: any = {}, message: string = "Service Unavailable") {
        super(message, 503, additionalInfo);
    }
}

export {
    InternalServerError,
    NotImplementedError,
    BadGatewayError,
    ServiceUnavailableError
}