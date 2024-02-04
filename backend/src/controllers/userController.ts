import {NextFunction, Response, Request} from "express";
import {
    applyRolesInFirebase, createAndAssignUserToShippingCompanyInFirestore,
    createUserInFirebase, deleteUserFromFirebase, deleteUserFromFirestore,
    getAllUsersFromFirestore, getUserFromFirestore, updateUserInFirebase, updateUserInFirestore, userRollback
} from "../services/userService";
import {CreateUserResponse, CreateUserRequest, UpdateUserRequest} from "../models/userModel";
import {BadRequestError} from "../middleware/errors/clientErrors";
import {ADMIN_ROLES_ARRAY, USER_ROLES_ARRAY} from "../utils/roles";


export async function createUserHandler(req: Request, res: Response, next : NextFunction) {
    const userRequest: CreateUserRequest = req.body;
    userRequest.roles = userRequest.roles.filter(role => {
        return USER_ROLES_ARRAY.includes(role.toLowerCase())
    });
    try {
        const userRecord = await createUserInFirebase(userRequest);
        await applyRolesInFirebase(userRecord.uid, ADMIN_ROLES_ARRAY);
        await createAndAssignUserToShippingCompanyInFirestore(userRecord, userRequest)
            .then(() => {
                const userResponse : CreateUserResponse = {
                    uid : userRecord.uid,
                    email : userRequest.email,
                    roles : userRequest.roles,
                    shippingCompanyId : userRequest.shippingCompanyId,
                    shippingCompanyName : userRequest.shippingCompanyName
                }
                res.status(201).send(userResponse);
            }).catch((error : any) => {
                userRollback(userRecord.uid).then(() => {
                    next(new BadRequestError(error));
                });
            });
    } catch (e) {
        next(new BadRequestError(e));
    }
}

export async function deleteUserHandler(req: Request, res : Response, next : NextFunction) {
    try {
        const userId : string = req.params.delete_uid;
        const shippingCompanyId : string = req.params.shippingCompanyId;
        await deleteUserFromFirebase(userId);
        await deleteUserFromFirestore(userId, shippingCompanyId);
        res.status(200).send({msg : "Successfully deleted."});
    } catch (error) {
        next(new BadRequestError(error, "User could not be deleted!"));
    }
}

export function getAllUsersInfoHandler(req: Request, res: Response, next: NextFunction) {
    const shippingCompanyId: string = req.params.shippingCompanyId;
    getAllUsersFromFirestore(shippingCompanyId)
        .then(userListResponse => {
            res.status(200).send(userListResponse);
        })
        .catch((error : any) => {
            next(new BadRequestError(error, "Error while getting UserInfos!"));
        });
}

export async function updateUserHandler(req: Request, res : Response, next : NextFunction) {
    const updateUser: UpdateUserRequest = req.body;
    const shippingCompanyId: string = req.params.shippingCompanyId;
    const userId: string = req.params.update_uid;

    try {
        await updateUserInFirebase(updateUser, shippingCompanyId, userId);
        if(updateUser.roles){
            updateUser.roles = updateUser.roles.filter(role => {
                return USER_ROLES_ARRAY.includes(role.toLowerCase())
            });
            await applyRolesInFirebase(userId, updateUser.roles);
        }
        await updateUserInFirestore(updateUser, userId);
        res.status(200).send({msg : "Successfully updated."});
    } catch (error) {
        next(new BadRequestError(error,"User could not be updated!"));
    }
}

export async function loginUserHandler(req: Request, res : Response, next : NextFunction) {
    getUserFromFirestore(req.body.uid)
        .then(userResponse => {
            res.status(200.).send(userResponse);
        })
        .catch((error : any) => {
            next(new BadRequestError(error, "Error while getting UserInfos!"));
        });
}
