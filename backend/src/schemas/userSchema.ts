import {checkSchema} from "express-validator";
import {ADMIN_ROLE, DASHBOARD_ROLE, MASTERDATA_ROLE} from "../utils/roles";

export const userSchema = checkSchema({
    email : {
        in : ["body"],
        exists : {
            options : { values : "falsy" },
            errorMessage : "Invalid email!"
        },
        normalizeEmail : true,
        trim : true,
        escape : true,
        toLowerCase : true,
    },
    password : {
        in : ["body"],
        isStrongPassword : {
            options : {
                minLength : 8,
                minLowercase : 1,
                minUppercase : 1,
                minNumbers : 1 },
            errorMessage : "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, one number, and a special character."
        },
        exists : {
            options : { values : "falsy" },
        },
        escape : true,
    },
    confirmPassword: {
        in : ["body"],
        isStrongPassword : {
            options : {
                minLength : 8,
                minLowercase : 1,
                minUppercase : 1,
                minNumbers : 1 },
            errorMessage : "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, one number, and a special character."
        },
        exists : {
            options : { values : "falsy" },
        },
        escape : true,
        custom : {
            options : (confirmPassword, {req}) => {
                return confirmPassword === req.body.password;
            },
            errorMessage : "Passwords do not match!"
        }
    },
    roles : {
        in : ["body"],
        exists : {
            options : { values : "falsy"}
        },
        escape : true,
        isArray : true,
        custom : {
            options : (values : string[]) => {
                return values.some((value) => value.toLowerCase() === ADMIN_ROLE || value.toLowerCase() === DASHBOARD_ROLE || value.toLowerCase() === MASTERDATA_ROLE);
            },
            errorMessage : "Unknown Role"
        }
    },
    shippingCompanyId : {
        in : ["params"],
        exists : true,
        escape : true,
        isString : true
    }
});

export const userSchemaForUpdate = checkSchema({
    update_uid : {
        in : ["params"],
        exists : true,
        escape : true,
        isString : true
    },
    shippingCompanyId : {
        in : ["params"],
        exists : true,
        escape : true,
        isString : true
    },
    email : {
        in : ["body"],
        exists : {
            options : { values : "undefined" },
        },
        normalizeEmail : true,
        escape : true,
        toLowerCase : true,
    },
    password : {
        in : ["body"],
        exists : {
            options : { values : "undefined" },
        },
        escape : true,
    },
    confirmPassword : {
        in : ["body"],
        exists : {
            options : { values : "undefined" },
        },
        escape : true,
        custom : {
            options : (confirmPassword, {req}) => {
                return confirmPassword === req.body.password;
            },
            errorMessage : "Passwords do not match!"
        }
    },
    roles : {
        in : ["body"],
        exists : {
            options : { values : "undefined"}
        },
        escape : true,
        isArray : true,
        custom : {
            options : (values : string[]) => {
                return values.some((value) => value.toLowerCase() === ADMIN_ROLE || value.toLowerCase() === DASHBOARD_ROLE || value.toLowerCase() === MASTERDATA_ROLE);
            },
            errorMessage : "Unknown Role"
        }
    }
});

export const userSchemaForDelete = checkSchema({
    delete_uid : {
        in : ["params"],
        exists : true,
        escape : true,
        isString : true,
    },
    shippingCompanyId : {
        in : ["params"],
        exists : true,
        escape : true,
        isString : true
    }
});

export const userSchemaForGet = checkSchema({
    shippingCompanyId : {
        in : ["params"],
        exists : true,
        escape : true,
        isString : true
    }
});