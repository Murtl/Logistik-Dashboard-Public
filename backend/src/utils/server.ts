import express from "express";
import helmet from "helmet";
import cors from "cors";
import userRoutes from "../routes/userRoutes";
import {errorLogger, errorResponder} from "../middleware/errors/errorHandler";
import {superAdminRoutes} from "../routes/superAdminRoutes";
import uploadRoutes from "../routes/uploadRoutes";
import masterDataRoutes from "../routes/masterDataRoutes";
import kpiRoutes from "../routes/kpiRoutes";
import tourRoutes from "../routes/tourRoutes";


function createServer() {
    const app = express();

    app.use(helmet());
    app.use(express.json());
    app.use(cors({
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    userRoutes(app);
    superAdminRoutes(app);
    uploadRoutes(app);
    masterDataRoutes(app);
    kpiRoutes(app);
    tourRoutes(app);


    if(app.get("env") !== "test"){
        app.use(errorLogger);
    }
    app.use(errorResponder);

    return app;
}

export default createServer;
