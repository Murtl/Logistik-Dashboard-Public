import logger from "./utils/logger";
import config from "config";
import createServer from "./utils/server";
import {initSuperAdminAccount} from "./services/superAdminService";

const port = config.get<number>("port");

const app = createServer();
app.listen(port, async () => {
    logger.info(`Server listening at http://localhost:${port}`);

    initSuperAdminAccount();
});