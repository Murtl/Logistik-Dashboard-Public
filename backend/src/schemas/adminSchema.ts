import {checkSchema} from "express-validator";

export const adminSchema = checkSchema({
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
    confirmPassword : {
        in : ["body"],
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
    shippingCompanyId : {
        in : ["body"],
        exists : {
            options : { values : "falsy"},
            errorMessage : "Shipping Company ID missing!"
        },
        escape : true,
    },
    shippingCompanyName : {
        in : ["body"],
        exists : {
            options : { values : "falsy"},
            errorMessage : "Shipping Company Name missing!"
        },
        escape : true,
    }
});

export const adminSchemaForDelete = checkSchema({
    adminId : {
        in : ["params"],
        exists : {
            options : { values : "falsy"},
            errorMessage : "Invalid adminId!"
        },
        escape : true,
        isString : true
    },
    shippingCompanyId : {
        in : ["params"],
        exists : {
            options : { values : "falsy"},
            errorMessage : "Shipping Company ID missing!"
        },
        escape : true,
    },
});

export const adminSchemaForUpdate = checkSchema({
    adminId : {
        in : ["params"],
        exists : {
            options : { values : "falsy"},
            errorMessage : "Invalid adminId!"
        },
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
});