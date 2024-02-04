import {checkSchema} from "express-validator";

export const masterDataSchema = checkSchema({
    shippingCompanyId : {
        in : ["params"],
        exists : true,
        escape : true,
        isString : true
    },
    shippingCompanyName : {
        in : ["body"],
        exists : {
            options : { values : "falsy"},
            errorMessage : "Shipping Company Name missing!"
        },
        escape : true,
        isString : true
    },
    regularPlanningTime : {
        in : ["body"],
        exists : {
            options : { values : "falsy"},
            errorMessage : "Regular Planning Time missing!"
        },
        isNumeric : true,
    },
    dispatcherSalary : {
        in : ["body"],
        exists : {
            options : { values : "falsy"},
            errorMessage : "Dispatcher Salary missing!"
        },
        isNumeric : true,
    },
    "resources.*.type" : {
        in : ["body"],
        exists : {
            options : { values : "falsy"},
            errorMessage : "Resource Type missing!"
        },
        escape : true,
        isString : true
    },
    "resources.*.costType" : {
        in : ["body"],
        exists : {
            options : { values : "falsy"},
            errorMessage : "Resource Cost Type missing!"
        },
        escape : true,
        isString : true
    },
    "resources.*.cost" : {
        in : ["body"],
        exists : {
            options : { values : "falsy"},
            errorMessage : "Resource Cost missing!"
        },
        isNumeric : true,
    },
    "resources.*.co2PerKm" : {
        in : ["body"],
        exists : {
            options : { values : "falsy"},
            errorMessage : "Resource CO2 per km missing!"
        },
        isNumeric : true,
    },
    "resources.*.loadingVolume" : {
        in : ["body"],
        exists : {
            options : { values : "falsy"},
            errorMessage : "Resource Loading Volume missing!"
        },
        isNumeric : true,
    },
    "resources.*.maxStoringPositions" : {
        in : ["body"],
        exists : {
            options : { values : "falsy"},
            errorMessage : "Resource Max Storing Positions missing!"
        },
        isNumeric : true,
    },
    "resources.*.loadingMeter" : {
        in : ["body"],
        exists : {
            options : { values : "falsy"},
            errorMessage : "Resource Loading Meter missing!"
        },
        isNumeric : true,
    },
    "resources.*.payload" : {
        in : ["body"],
        exists : {
            options : { values : "falsy"},
            errorMessage : "Resource Payload missing!"
        },
        isNumeric : true,
    },
});

export const masterDataSchemaForGet = checkSchema({
    shippingCompanyId : {
        in : ["params"],
        exists : true,
        escape : true,
        isString : true
    }
});

