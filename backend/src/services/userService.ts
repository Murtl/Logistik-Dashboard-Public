import {CreateUserRequest, GetUserResponse, UpdateUserRequest} from "../models/userModel";
import firebase from "../../firebase";
import {COMPANIES_COLLECTION, USERS_COLLECTION} from "../utils/consts";
import {auth, firestore} from "firebase-admin";
import FieldValue = firestore.FieldValue;
import UserRecord = auth.UserRecord;
import {CreateAdminUserRequest} from "../models/adminModel";
import {BadRequestError} from "../middleware/errors/clientErrors";

// CREATE
export async function createUserInFirebase(adminRequest : CreateAdminUserRequest) {
        return  await firebase
            .auth()
            .createUser({
                email : adminRequest.email,
                password : adminRequest.password
            });
}

export async function createAndAssignUserToShippingCompanyInFirestore(userRecord : UserRecord, userRequest : CreateUserRequest) {
    const companyRef = firestore()
        .collection(COMPANIES_COLLECTION)
        .doc(userRequest.shippingCompanyId);
    const companyDoc = await companyRef.get();
    if(companyDoc.exists){
        await companyRef.update({
            userIDs : FieldValue.arrayUnion(userRecord.uid)
        });
        await firestore()
            .collection(USERS_COLLECTION)
            .doc(userRecord.uid)
            .set({
                uid: userRecord.uid,
                roles: userRequest.roles,
                email: userRequest.email,
                shippingCompanyId: userRequest.shippingCompanyId,
                shippingCompanyName: userRequest.shippingCompanyName
            });
    } else {
        throw new BadRequestError("Shipping Company does not exist!");
    }
}

export async function userRollback(uid : string){
    return await firebase
        .auth()
        .deleteUser(uid);
}

export async function applyRolesInFirebase(uid : string, roles : string[]){
    return await
        firebase
            .auth()
            .setCustomUserClaims(uid, {roles : roles});
}

// DELETE

export async function deleteUserFromFirebase(uid : string) {
    return await firebase
        .auth()
        .deleteUser(uid);
}

export async function deleteUserFromFirestore(uid : string, shippingCompanyId : string) {
    const companyRef = firestore()
        .collection(COMPANIES_COLLECTION)
        .doc(shippingCompanyId);
    const companyDoc = await companyRef.get();
    if(companyDoc.exists){
        await companyRef.update({
            userIDs : FieldValue.arrayRemove(uid)
        });
    }
    await firestore()
        .collection(USERS_COLLECTION)
        .doc(uid)
        .delete();
}

// GET

export async function getAllUsersFromFirestore(shippingCompanyId : string) {
    const userRef = firestore()
        .collection(USERS_COLLECTION)
        .where("shippingCompanyId", "==", shippingCompanyId);
    const userSnapshot = await userRef.get();
    const getUserResponseList: GetUserResponse[] = [];
    if (!userSnapshot.empty) {
        userSnapshot.forEach((doc: any) => {
            getUserResponseList.push(doc.data() as GetUserResponse);
        });
    }
    return getUserResponseList;
}

export async function getUserFromFirestore(uid : string) : Promise<GetUserResponse> {
    const userRef = firestore()
        .collection(USERS_COLLECTION)
        .doc(uid);
    const userDoc = await userRef.get();
    if (userDoc.exists){
        return userDoc.data() as GetUserResponse;
    } else {
        throw new BadRequestError("User does not exist!");
    }
}

// UPDATE

export async function updateUserInFirebase(updateUser : UpdateUserRequest, shippingCompanyId : string, uid : string) {
    if (updateUser.email) {
        await firebase
            .auth()
            .updateUser(uid, {
                email: updateUser.email
            });
    }

    if (updateUser.password && updateUser.confirmPassword) {
        if (updateUser.password === updateUser.confirmPassword) {
            await firebase
                .auth()
                .updateUser(uid, {
                    password: updateUser.password
                });
        } else {
            throw new BadRequestError("Passwords do not match!");
        }
    }
}


export async function updateUserInFirestore(updateUser : UpdateUserRequest, uid : string){
    const userRef =  firestore()
        .collection(USERS_COLLECTION)
        .doc(uid);
    const userDoc = await userRef.get();
    if (userDoc.exists){
        if(updateUser.roles){
            await userRef.update({
                roles : updateUser.roles
            });
        }
        if(updateUser.email){
            await userRef.update({
                email : updateUser.email
            });
        }
    }
}
