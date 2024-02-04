import {Express} from "express";
import {userSchemaForDelete, userSchemaForUpdate, userSchema, userSchemaForGet} from "../schemas/userSchema";
import {validateRequestSchema} from "../middleware/validation/validateRequestSchema";
import {
    checkIfUserHasAdminRole, checkIfUserIsAuthorized
} from "../middleware/auth/verifyAuthentication";
import {
    createUserHandler,
    deleteUserHandler,
    getAllUsersInfoHandler, loginUserHandler,
    updateUserHandler
} from "../controllers/userController";
import {checkIfAdminBelongsToThisShippingCompany} from "../middleware/firebase/cloudFirestore";


function userRoutes(app : Express){

    app.get("/api/users/login",
        checkIfUserIsAuthorized,
        loginUserHandler
    );

    app.post("/api/companies/:shippingCompanyId/users",
        userSchema,
        validateRequestSchema,
        checkIfUserHasAdminRole,
        checkIfAdminBelongsToThisShippingCompany,
        createUserHandler
    );

    app.get("/api/companies/:shippingCompanyId/users",
        userSchemaForGet,
        validateRequestSchema,
        checkIfUserHasAdminRole,
        checkIfAdminBelongsToThisShippingCompany,
        getAllUsersInfoHandler
    );

    app.put("/api/companies/:shippingCompanyId/users/:update_uid",
        userSchemaForUpdate,
        validateRequestSchema,
        checkIfUserHasAdminRole,
        checkIfAdminBelongsToThisShippingCompany,
        updateUserHandler
    );

    app.delete("/api/companies/:shippingCompanyId/users/:delete_uid",
        userSchemaForDelete,
        validateRequestSchema,
        checkIfUserHasAdminRole,
        checkIfAdminBelongsToThisShippingCompany,
        deleteUserHandler
    );
}

export default userRoutes;