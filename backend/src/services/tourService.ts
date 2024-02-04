import {Tour} from "../models/tourModel";
import {firestore} from "firebase-admin";
import {COMPANIES_COLLECTION, TOURS_COLLECTION} from "../utils/consts";
import {BadRequestError} from "../middleware/errors/clientErrors";

export async function getTours(shippingCompanyId : string, date : string) : Promise<Tour[]> {
    const tours : Tour[] = [];

    const toursRef = firestore()
        .collection(COMPANIES_COLLECTION+`/${shippingCompanyId}/`+TOURS_COLLECTION);

    const toursSnapshot = await toursRef.get();

    if(!toursSnapshot.empty){
        toursSnapshot.forEach(doc => {
          const tour : Tour = doc.data() as Tour;
          if(doc.get("date") === date){
              tours.push(tour);
          }
        });
    } else {
        throw new BadRequestError("No tours found for company "+shippingCompanyId);
    }
    return tours;
}