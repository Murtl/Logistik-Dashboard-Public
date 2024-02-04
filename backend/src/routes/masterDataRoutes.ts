import {Express} from "express";
import {checkIfUserHasMasterDataRole} from "../middleware/auth/verifyAuthentication";
import {
    createMasterDataHandler,
    getMasterDataHandler,
    updateMasterDataHandler
} from "../controllers/masterDataController";
import {validateRequestSchema} from "../middleware/validation/validateRequestSchema";
import {masterDataSchema, masterDataSchemaForGet} from "../schemas/masterDataSchema";

function masterDataRoutes(app : Express) {

    app.get("/api/companies/:shippingCompanyId/masterData",
        masterDataSchemaForGet,
        validateRequestSchema,
        checkIfUserHasMasterDataRole,
        getMasterDataHandler
    );

    app.post("/api/companies/:shippingCompanyId/masterData",
        masterDataSchema,
        validateRequestSchema,
        validateRequestSchema,
        checkIfUserHasMasterDataRole,
        createMasterDataHandler
    );

    app.put("/api/companies/:shippingCompanyId/masterData",
        masterDataSchema,
        validateRequestSchema,
        checkIfUserHasMasterDataRole,
        updateMasterDataHandler
    );

}

export  default masterDataRoutes;