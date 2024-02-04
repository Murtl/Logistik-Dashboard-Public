import {Express} from "express";
import {uploadFileHandler} from "../controllers/importController";
import {upload} from "../utils/fileUpload";
import {checkIfUserIsAuthorized} from "../middleware/auth/verifyAuthentication";

function uploadRoutes(app : Express) {

    app.post("/api/companies/:shippingCompanyId/upload",
        checkIfUserIsAuthorized,
        upload.single("data-import"),
        uploadFileHandler
        );
}

export  default uploadRoutes;
