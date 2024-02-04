import {Express} from "express";
import {validateRequestSchema} from "../middleware/validation/validateRequestSchema";
import {checkIfUserHasDashboardRole} from "../middleware/auth/verifyAuthentication";
import {getToursHandler} from "../controllers/tourController";
import {tourSchema} from "../schemas/tourSchema";

function tourRoutes(app : Express){
    app.post("/api/companies/:shippingCompanyId/tours",
        tourSchema,
        validateRequestSchema,
        checkIfUserHasDashboardRole,
        getToursHandler
    );
}

export default tourRoutes;