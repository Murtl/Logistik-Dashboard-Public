import {Express} from "express";
import {
    deleteAdminUserHandler,
    getAllAdminUsersHandler,
    initAdminAndShippingCompanyHandler,
    updateAdminUserHandler
} from "../controllers/superAdminController";
import {checkIfUserIsSuperAdmin} from "../middleware/auth/verifyAuthentication";
import {validateRequestSchema} from "../middleware/validation/validateRequestSchema";
import {adminSchema, adminSchemaForDelete, adminSchemaForUpdate} from "../schemas/adminSchema";

/**
 * Diese Schnittstellen können nur mit dem Aluco SUPERADMIN-Account aufgerufen werden.
 * @param app
 */
export function superAdminRoutes(app : Express){

    app.post("/api/admin/companies",
        adminSchema,
        validateRequestSchema,
        checkIfUserIsSuperAdmin,
        initAdminAndShippingCompanyHandler);

    app.put("/api/admin/companies/:adminId",
        adminSchemaForUpdate,
        validateRequestSchema,
        checkIfUserIsSuperAdmin,
        updateAdminUserHandler
    );

    app.delete("/api/admin/companies/:adminId/:shippingCompanyId",
        adminSchemaForDelete,
        validateRequestSchema,
        checkIfUserIsSuperAdmin,
        deleteAdminUserHandler
    );

    app.get("/api/admin/companies",
        checkIfUserIsSuperAdmin,
        getAllAdminUsersHandler);

}