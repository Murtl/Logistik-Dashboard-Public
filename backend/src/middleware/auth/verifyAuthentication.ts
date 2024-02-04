import {NextFunction, Request, Response} from "express";
import firebase from "../../../firebase";
import {BadRequestError, UnauthorizedError} from "../errors/clientErrors";
import {ADMIN_ROLE, DASHBOARD_ROLE, MASTERDATA_ROLE, SUPERADMIN_ROLE} from "../../utils/roles";
import {auth} from "firebase-admin";
import DecodedIdToken = auth.DecodedIdToken;

const getBearerToken = (req: Request<{},{},{authToken : string | null},{},{}>, res : Response, next : NextFunction) => {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        req.body.authToken = req.headers.authorization.split(' ')[1];
    } else {
        req.body.authToken = null;
    }
    next();
}

export function checkIfUserIsSuperAdmin(req : Request, res : Response, next : NextFunction) {
    getBearerToken(req, res, async () => {
        if(req.body.authToken) {
            firebase
                .auth()
                .verifyIdToken(req.body.authToken)
                .then((userInfo : DecodedIdToken) => {
                    if(userInfo.roles[0] === SUPERADMIN_ROLE){
                        req.body.uid = userInfo.uid;
                        next();
                    } else {
                        next(new UnauthorizedError("Unauthorized!"));
                    }
                })
                .catch((error : any) => {
                   next(new UnauthorizedError(error));
                });
        } else {
            next(new BadRequestError("Missing oder wrong token!"));
        }
    });
}

export const checkIfUserHasAdminRole = (req : Request, res : Response, next : NextFunction) => {
    getBearerToken(req, res, async () => {
        if(req.body.authToken) {
            firebase
                .auth()
                .verifyIdToken(req.body.authToken)
                .then((userInfo : DecodedIdToken) => {
                    if(userInfo.roles.includes(ADMIN_ROLE)){
                        req.body.uid = userInfo.uid;
                        next();
                    } else {
                        next(new UnauthorizedError("You have no admin rights!"))
                    }
                })
                .catch((error : any) => {
                    next(new UnauthorizedError(error));
                });
        } else {
            next(new BadRequestError("Missing or wrong token!"));
        }
    });
}

export const checkIfUserHasMasterDataRole = (req : Request, res : Response, next : NextFunction) => {
    getBearerToken(req, res, async () => {
        if(req.body.authToken) {
            firebase
                .auth()
                .verifyIdToken(req.body.authToken)
                .then((userInfo : DecodedIdToken) => {
                    if(userInfo.roles.includes(MASTERDATA_ROLE)){
                        req.body.uid = userInfo.uid;
                        next();
                    } else {
                        next(new UnauthorizedError("You have no master data rights!"))
                    }
                })
                .catch((error : any) => {
                    next(new UnauthorizedError(error));
                });
        } else {
            next(new BadRequestError("Missing or wrong token!"));
        }
    });
}

export const checkIfUserHasDashboardRole = (req : Request, res : Response, next : NextFunction) => {
    getBearerToken(req, res, async () => {
        if(req.body.authToken) {
            firebase
                .auth()
                .verifyIdToken(req.body.authToken)
                .then((userInfo : DecodedIdToken) => {
                    if(userInfo.roles.includes(DASHBOARD_ROLE)){
                        req.body.uid = userInfo.uid;
                        next();
                    } else {
                        next(new UnauthorizedError("You have no dashboard rights!"))
                    }
                })
                .catch((error : any) => {
                    next(new UnauthorizedError(error));
                });
        } else {
            next(new BadRequestError("Missing or wrong token!"));
        }
    });
}

export const checkIfUserIsAuthorized = (req : Request, res : Response, next : NextFunction) => {
    getBearerToken(req, res, async () => {
        if(req.body.authToken){
            firebase
                .auth()
                .verifyIdToken(req.body.authToken)
                .then((userInfo : DecodedIdToken) => {
                    req.body.uid = userInfo.uid;
                    next();
                }).catch((error : any) => {
                    next(new UnauthorizedError(error));
                });
        } else {
            next(new BadRequestError("Missing or wrong token!"));
        }
    });
}