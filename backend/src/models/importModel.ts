import {Tour} from "./tourModel";

export interface ImportModel {
    amountPlannedShipments: number,
    amountShipments: number,
    availableTours: number,
    date: Date,
    plannedTours: number,
    planningTime: number,
    reschedulingCount: number,
    shippingCompany: string,
    totalPlannedShipmentsWeight: number,
    tourCount: number,
    tours: Array<Tour>
}
