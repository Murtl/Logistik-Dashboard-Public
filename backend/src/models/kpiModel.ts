export interface KpiModel {
    name: string,
    text: string,
    unit: string,
    values:  {date: Date, tourCount?: number, value: any}[]
}

export type KpiRequest = {
    shippingCompanyId: string;
    year : number;
    from?: string;
    to?: string;
    kpiFilter? : string[];
}
