import {checkSchema} from "express-validator";

export const kpiSchema = checkSchema({
    shippingCompanyId: {
        in: ['params'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid shippingCompanyId!"
        },
        escape: true,
        isString: true,
    },
    year: {
        in: ['body'],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid year!"
        },
        escape: true,
        isNumeric: true,
    },
    from : {
        in: ['body'],
        exists : {
            options : { values : "undefined" },
            errorMessage : `Invalid 'from' date!`
        },
        escape : true,
        isString : true,
    },
    to : {
        in: ['body'],
        exists : {
            options : { values : "undefined" },
            errorMessage : `Invalid 'to' date!`
        },
        escape : true,
        isString : true,
    },
    "kpiFilter.*" : {
        in: ['body'],
        exists: {
            options: {values: "undefined"},
            errorMessage: `Invalid "kpiFilter"!`
        },
        escape: true,
        isString: true,
    }
});