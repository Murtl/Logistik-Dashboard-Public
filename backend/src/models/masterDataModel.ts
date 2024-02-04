import {ResourceModel} from "./resourceModel";

export interface MasterDataModel {
    shippingCompanyName: string,
    regularPlanningTime: number,
    dispatcherSalary: number,
    resources: ResourceModel[]
}
