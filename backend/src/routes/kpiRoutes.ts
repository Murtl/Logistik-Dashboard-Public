import {Express} from "express";
import {checkIfUserHasDashboardRole} from "../middleware/auth/verifyAuthentication";
import {getKpisByRequestHandler} from "../controllers/kpiController";
import {kpiSchema} from "../schemas/kpiSchema";
import {validateRequestSchema} from "../middleware/validation/validateRequestSchema";

function kpiRoutes(app : Express){

    app.post("/api/companies/:shippingCompanyId/kpis",
        kpiSchema,
        validateRequestSchema,
        checkIfUserHasDashboardRole,
        getKpisByRequestHandler
    );
}

export default kpiRoutes;