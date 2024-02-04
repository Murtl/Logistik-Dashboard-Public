import {checkSchema} from "express-validator";

export const tourSchema = checkSchema({
    shippingCompanyId: {
        in: ["params"],
        isString: true,
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid shippingCompanyId!"
        },
        escape: true,
    },
    date: {
        in: ["body"],
        exists: {
            options: {values: "falsy"},
            errorMessage: "Invalid date!"
        },
        escape: true,
        isString: true,
    }
})