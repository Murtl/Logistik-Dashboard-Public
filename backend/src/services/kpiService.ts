import {firestore} from "firebase-admin";
import {COMPANIES_COLLECTION, KPI_COLLECTION} from "../utils/consts";
import {BadRequestError} from "../middleware/errors/clientErrors";
import {KpiModel, KpiRequest} from "../models/kpiModel";


export async function getKpisByRequest(kpiRequest : KpiRequest){
    const kpisRef = getKpisRef(kpiRequest);

    const kpisSnapshot = await kpisRef.get();
    const kpis : KpiModel[] = [];
    if(!kpisSnapshot.empty){
        kpisSnapshot.forEach(doc => {
            const kpi : KpiModel = doc.data() as KpiModel;
            const values : {date: Date, tourCount?: number, value: any}[] = [];
            doc.get("values").forEach((value : any) => {
                if(kpiRequest.from && kpiRequest.to){
                    if(value.date >= kpiRequest.from && value.date <= kpiRequest.to){
                        values.push(value);
                    }
                } else {
                    values.push(value);
                }
            });
            kpi.values = values;
            kpis.push(kpi);
        });
    } else {
        //Wenn man das throwt, dann wird nix returned und so kommt es zu Fehlern etc.
       // throw new BadRequestError("No kpis found for company "+kpiRequest.shippingCompanyId);
    }
    return kpis;
}

function getKpisRef(kpiRequest : KpiRequest){
    if(kpiRequest.kpiFilter){
        return  firestore()
            .collection(COMPANIES_COLLECTION+`/${kpiRequest.shippingCompanyId}/`+KPI_COLLECTION+`${kpiRequest.year}`)
            .where("name", "in", kpiRequest.kpiFilter);
    } else {
        return firestore()
            .collection(COMPANIES_COLLECTION+`/${kpiRequest.shippingCompanyId}/`+KPI_COLLECTION+`${kpiRequest.year}`);
    }
}
