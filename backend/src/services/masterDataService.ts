import {MasterDataModel} from "../models/masterDataModel";
import {firestore} from "firebase-admin";
import {COMPANIES_COLLECTION} from "../utils/consts";
import {BadRequestError} from "../middleware/errors/clientErrors";

export async function createMasterData(masterData : MasterDataModel, shippingCompanyId : string) {
    const masterDataRef = firestore()
        .collection(COMPANIES_COLLECTION)
        .doc(shippingCompanyId);

    await masterDataRef.set({
        dispatcherSalary : masterData.dispatcherSalary,
        regularPlanningTime : masterData.regularPlanningTime,
        resources : masterData.resources
    }, {merge : true})
}

export async function getMasterData(shippingCompanyId : string) : Promise<MasterDataModel> {
    const masterDataRef = firestore()
        .collection(COMPANIES_COLLECTION)
        .doc(shippingCompanyId);

    const masterDataDoc = await masterDataRef.get();
    if(masterDataDoc.exists){
        return masterDataDoc.data() as MasterDataModel;
    } else {
        throw new BadRequestError("MasterData does not exist!");
    }
}

export async function updateMasterData(masterData : MasterDataModel, shippingCompanyId : string) {
    const masterDataRef = firestore()
        .collection(COMPANIES_COLLECTION)
        .doc(shippingCompanyId);

    await masterDataRef.update({
        dispatcherSalary : masterData.dispatcherSalary,
        regularPlanningTime : masterData.regularPlanningTime,
        resources : masterData.resources
    });
}