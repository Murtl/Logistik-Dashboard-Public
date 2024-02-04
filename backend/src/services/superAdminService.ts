import firebase from "../../firebase";
import {ADMIN_ROLES_ARRAY, SUPERADMIN_ROLE} from "../utils/roles";
import logger from "../utils/logger";
import config from "config";
import {COMPANIES_COLLECTION, USERS_COLLECTION} from "../utils/consts";
import {applyRolesInFirebase, userRollback} from "./userService";
import {auth, firestore} from "firebase-admin";
import UserRecord = auth.UserRecord;
import generator from "generate-password-ts";
import {CreateAdminUserRequest, GetAdminUsersResponse, UpdateAdminUserRequest} from "../models/adminModel";
import {BadRequestError} from "../middleware/errors/clientErrors";

const MAX_RETRY_ATTEMPTS : number = 5;
const email : string = config.get<string>("admin_email");
const displayName : string = config.get<string>("admin_displayName");
const password : string = generator.generate({
    length : 20,
    numbers : true,
    uppercase : true,
    lowercase : true,
    symbols : true
});

/**
 * Anlegen der Admin-Accounts für die Company X.
 * Außerdem wird in Firestore die Company und der Nutzer initial angelegt und mit der Company verknüpft.
 *
 * @param model
 */
export async function initAdminAndShippingCompany(model : CreateAdminUserRequest) : Promise<GetAdminUsersResponse> {
    const userRecord: UserRecord = await firebase
        .auth()
        .createUser({
            email : model.email,
            password : model.password
        });
    await applyRolesInFirebase(userRecord.uid, ADMIN_ROLES_ARRAY);
    try {
        await firestore()
            .collection(COMPANIES_COLLECTION)
            .doc(model.shippingCompanyId)
            .set({
                shippingCompanyName: model.shippingCompanyName,
                userIDs: [userRecord.uid]
            });

        await firestore()
            .collection(USERS_COLLECTION)
            .doc(userRecord.uid)
            .set({
                uid: userRecord.uid,
                roles: ADMIN_ROLES_ARRAY,
                email: model.email,
                shippingCompanyId: model.shippingCompanyId,
                shippingCompanyName: model.shippingCompanyName
            });
    } catch (e) {
        await userRollback(userRecord.uid);
        throw new BadRequestError("Error while creating Firestore entries!");
    }

    return {
        uid : userRecord.uid,
        email : model.email,
        shippingCompanyId : model.shippingCompanyId,
        shippingCompanyName : model.shippingCompanyName
    }
}

export async function getAllAdminUsersFromFirestore() : Promise<GetAdminUsersResponse[]>{
    const adminUserRef = await
        firestore()
            .collection(USERS_COLLECTION)
            .where("roles", "array-contains","admin");
    const adminUserSnapshot = await adminUserRef.get();
    const adminUserResponseList : GetAdminUsersResponse[] = [];
    if(!adminUserSnapshot.empty){
        adminUserSnapshot.forEach(doc => {
            adminUserResponseList.push(doc.data() as GetAdminUsersResponse);
        });
    }
    return adminUserResponseList;
}

export async function updateAdminUserInFirestore(adminUser : UpdateAdminUserRequest, uid : string){
    const userRef = await firestore()
        .collection(USERS_COLLECTION)
        .doc(uid);
    const userDoc = await userRef.get();
    if(userDoc.exists){
        if(adminUser.email){
            await userRef.update({
                email : adminUser.email
            });
        }
    }
}

export async function updateAdminUserInFirebase(adminUser : UpdateAdminUserRequest, uid : string){
    await firebase.auth().getUser(uid);
    if(adminUser.email){
        await firebase.auth().updateUser(uid, {
            email : adminUser.email
        });
    }
    if(adminUser.password && adminUser.confirmPassword) {
        if (adminUser.password === adminUser.confirmPassword) {
            await firebase.auth().updateUser(uid, {
                password: adminUser.password
            });
        } else {
            throw new BadRequestError("Passwords do not match!");
        }
    }
}

export async function deleteAdminUserInFirebase(userIDs : string[]){
    for(let i = 0; i < userIDs.length; i++){
        await firebase
            .auth()
            .deleteUser(userIDs[i]);
    }
}

export async function deleteCompanyWithAllRelatedDataAndUsersInFirestore(uid : string, shippingCompanyId : string) : Promise<string[]> {
    const companyRef = await firestore()
        .collection(COMPANIES_COLLECTION)
        .doc(shippingCompanyId);
    const companyDoc = await companyRef.get();
    const userIDsToDelete: string[] = [];
    if(companyDoc.exists){
        const companyData = companyDoc.data();
        if(companyData){
            const userIDs = companyData.userIDs;
            if(userIDs){
                for(let i = 0; i < userIDs.length; i++){
                    userIDsToDelete.push(userIDs[i]);
                    await firestore()
                        .collection(USERS_COLLECTION)
                        .doc(userIDs[i])
                        .delete();
                }
            }
        }
    }
    const bulkWriter = firestore().bulkWriter();
    bulkWriter.onWriteError((error) => {
        if (error.failedAttempts < MAX_RETRY_ATTEMPTS) {
            return true;
        } else {
            logger.error(`Failed write at document: ${error.documentRef.path}`);
            return false;
        }
    });
    await firestore()
        .recursiveDelete(companyRef, bulkWriter);
    return userIDsToDelete;
}

/**
 * Wird beim Starten des Servers automatisch erzeugt. Im Live-Betrieb passiert das eigenltich nur einmal und dann muss
 * das Password, welches hier generiert wird gespeichert oder in Firebase geändert werden.
 * Das ist DER SUPERADMIN von Aluco, mit dem die weitere Admins und Companies anlegen kännen.
 *
 */
export function initSuperAdminAccount(){
    firebase
        .auth()
        .createUser({
            email : email,
            password : password,
            displayName : displayName,
        })
        .then((userRecord : UserRecord) => {
            applyRolesInFirebase(userRecord.uid, [SUPERADMIN_ROLE])
                .then( () => {
                    logger.info(`SuperAdmin created: email: ${email} | password: ${password}`);
                })
                .catch((error : any) => {
                   logger.warn(error);
                });
        })
        .catch((error : any) => {
           logger.info("SuperAdmin has already been created!")
        });
}