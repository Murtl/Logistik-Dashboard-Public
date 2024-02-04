import { firestore} from "firebase-admin";
import {ImportModel} from "../models/importModel";
import {Tour} from "../models/tourModel";
import {KpiModel} from "../models/kpiModel";
import {MasterDataModel} from "../models/masterDataModel";
import {ResourceModel} from "../models/resourceModel";
import FieldValue = firestore.FieldValue;
import {COMPANIES_COLLECTION, KPI_COLLECTION, TOURS_COLLECTION} from "../utils/consts";
import {BadRequestError} from "../middleware/errors/clientErrors";
export async function writeDataToFirestore(file: Express.Multer.File, shippingCompanyId: string) {

        let jsonData: string = file.buffer.toString();
        let parsedJSON: ImportModel = JSON.parse(jsonData); // necessary to access value

        /** Check if shippingCompany exists and if so, load it */
        let masterData: MasterDataModel;
        let resources: ResourceModel[];

        const masterDataDoc = await firestore()
            .collection(COMPANIES_COLLECTION)
            .doc(shippingCompanyId)
            .get();

        if (!masterDataDoc.exists) {
           throw new BadRequestError("shipping company does not exist!!")
        } else {
            masterData = masterDataDoc.data() as MasterDataModel;
            resources = masterData.resources;
        }

        /** Write tours into database, while doing so check if resource exists - if not create it */
        await Promise.all(parsedJSON["tours"].map(async (tour) => {

            let resourceExists = false

            resources.forEach((resource) => {
                if (tour.resource == resource.type) {
                    resourceExists = true
                }
            })

            if (!resourceExists) {
                const newResource: ResourceModel = {
                    type: tour.resource,
                    costType: "fix",
                    cost: 0,
                    co2PerKm: 0,
                    loadingVolume: 0,
                    maxStoringPositions: 0,
                    loadingMeter: 0,
                    payload: 0
                }
                resources.push(newResource)
                await addResourceToFirebaseArray(newResource)
            }

            const data: Tour = {
                tourNumber: tour.tourNumber,
                transportOperator: tour.transportOperator,
                date: parsedJSON.date, //from parsedJSON because it is not provided in tour individually
                kilometers: tour.kilometers,
                plannedShipments: tour.plannedShipments,
                plannedShipmentWeight: tour.plannedShipmentWeight,
                resource: tour.resource,
                numberOfStops: tour.numberOfStops,
                plannedShipmentVolume: tour.plannedShipmentVolume,
                plannedShipmentStoringPositions: tour.plannedShipmentStoringPositions,
                plannedShipmentLoadingMeter: tour.plannedShipmentLoadingMeter,
                performed: tour.performed,
                cost: calculateResourceCost(resources, tour.resource, tour.kilometers) as number,
                co2: calculateResourceCO2(resources, tour.resource, tour.kilometers) as number,
            }

            await writeTourToFirestore(data)
                .then(() => {})
                .catch((error: any) => {
                    throw new BadRequestError(error,'Tour ' + data.tourNumber + ': saving failed');
                });
        }));

        /**
         * write KPIs into database
         *
         * */

        const kpis: KpiModel[] = [
            {
                name: 'amountPlannedShipments',
                text: 'Anzahl der verplanten Sendungen',
                unit: 'Anzahl',
                values: [{date: parsedJSON.date, value: parsedJSON.amountPlannedShipments}]
            },
            {
                name: 'amountShipments',
                text: 'Anzahl der zu verplanenden Sendungen',
                unit: 'Anzahl',
                values: [{date: parsedJSON.date, value: parsedJSON.amountShipments}]
            },
            {
                name: 'totalPlannedShipmentWeight',
                text: 'Gesamtgewicht der verplanten Sendungen',
                unit: 'Kilogramm',
                values: [{date: parsedJSON.date, value: parsedJSON.totalPlannedShipmentsWeight}]
            },
            {
                name: 'reschudulingCount',
                text: 'Anzahl der Umplanungen',
                unit: 'Anzahl',
                values: [{date: parsedJSON.date, value: parsedJSON.reschedulingCount}]
            },
            {
                name: 'plannedTours',
                text: 'Anzahl der geplanten Touren',
                unit: 'Anzahl',
                values: [{date: parsedJSON.date, value: parsedJSON.plannedTours}]
            },
            {
                name: 'planningTime',
                text: 'Dauer der Planung',
                unit: 'Sekunden',
                values: [{date: parsedJSON.date, value: parsedJSON.planningTime}]
            },
            {
                name: 'availableTours',
                text: 'Pro Tag verfügbare Kapazität an Touren',
                unit: 'Anzahl',
                values: [{date: parsedJSON.date, value: parsedJSON.availableTours}]
            },
            {
                name: 'avgKmTours',
                text: 'Durchschnitt der Kilometer der Touren je Tag',
                unit: 'Kilometer',
                values: [{
                    date: parsedJSON.date,
                    value: avgKmTours(parsedJSON["tours"], parsedJSON.plannedTours),
                    tourCount: parsedJSON.plannedTours
                }]
            },
            {
                name: 'avgStopsTour',
                text: 'Durchschnittliche Anzahl Tourstopps je Tag',
                unit: 'Anzahl',
                values: [{
                    date: parsedJSON.date,
                    value: avgStopsTours(parsedJSON["tours"], parsedJSON.plannedTours),
                    tourCount: parsedJSON.plannedTours
                }]
            },
            {
                name: 'costsUsedResources',
                text: 'Summe der Kosten aller eingesetzten Ressourcen je Tag',
                unit: 'Euro',
                values: [{date: parsedJSON.date, value: costsUsedResources(parsedJSON["tours"])}]
            },
            {
                name: 'toursPerResourceType',
                text: 'Summe der Touren je Ressourcentyp',
                unit: 'Anzahl',
                values: [{
                    date: parsedJSON.date,
                    value: toursPerResourceType(parsedJSON["tours"]),
                    tourCount: parsedJSON.plannedTours
                }]
            },
            {
                name: 'toursPerTransportOperator',
                text: 'Summe der Touren je Transporteur',
                unit: 'Anzahl',
                values: [{
                    date: parsedJSON.date,
                    value: toursPerTransportOperator(parsedJSON["tours"]),
                    tourCount: parsedJSON.plannedTours
                }]
            },
            {
                name: 'shipmentsPerTransportOperator',
                text: 'Summe der Sendungen je Transporteur',
                unit: 'Anzahl',
                values: [{
                    date: parsedJSON.date,
                    value: shipmentsPerTransportOperator(parsedJSON["tours"])
                }]
            },
            {
                name: 'costSavingsResources',
                text: 'Kosteneinsparung durch Ressourceneinsparung',
                unit: 'Euro',
                values: [{date: parsedJSON.date, value: costSavingResources(resources!, parsedJSON["tours"])}]
            },
            {
                name: 'co2Savings',
                text: 'CO2-Einsparung durch Ressourceneinsparung',
                unit: 'Gramm',
                values: [{date: parsedJSON.date, value: co2Savings(resources!, parsedJSON["tours"])}]
            },
            {
                name: 'costSavingsPlanningTime',
                text: 'Kosteneinsparung durch reduzierte Planungszeit',
                unit: 'Euro',
                values: [{date: parsedJSON.date, value: costSavingsPlanningTime(masterData!, parsedJSON.amountPlannedShipments)}]
            },
            {
                name: 'timeSavingsPlanningTime',
                text: 'Zeiteinsparung gegenüber regulärer Planung',
                unit: 'Sekunden',
                values: [{date: parsedJSON.date, value: timeSavingsPlanningTime(masterData!, parsedJSON.planningTime)}]
            },
            {
                name: 'tourSavings',
                text: 'Anzahl eingesparter Touren',
                unit: 'Anzahl',
                values: [{
                    date: parsedJSON.date,
                    value: tourSavings(parsedJSON.availableTours, parsedJSON.plannedTours)
                }]
            },
            {
                name: 'utilizationTours',
                text: 'Auslastung der Touren',
                unit: 'Prozent',
                values: [{
                    date: parsedJSON.date,
                    value: utilizationTours(parsedJSON.availableTours, parsedJSON.plannedTours)
                }]
            },
            {
                name: 'avgUsedShipmentVolume',
                text: 'Durchschnittlich genutztes Ladevolumen',
                unit: 'Prozent',
                values: [{
                    date: parsedJSON.date,
                    value: avgUsedShipmentVolume(masterData!, resources!, parsedJSON.tours, parsedJSON.plannedTours),
                    tourCount: parsedJSON.plannedTours
                }]
            },
            {
                name: 'avgUsedStoringPositions',
                text: 'Durchschnittlich genutzte Ladepositions',
                unit: 'Prozent',
                values: [{
                    date: parsedJSON.date,
                    value: avgUsedStoringPositions(masterData!, resources!, parsedJSON.tours, parsedJSON.plannedTours),
                    tourCount: parsedJSON.plannedTours
                }]
            },
            {
                name: 'avgUsedShipmentLoadingMeter',
                text: 'Durchschnittlich genutzte Lademeter',
                unit: 'Prozent',
                values: [{
                    date: parsedJSON.date,
                    value: avgUsedLoadingMeter(masterData!, resources!, parsedJSON.tours, parsedJSON.plannedTours),
                    tourCount: parsedJSON.plannedTours
                }]
            }
        ]

        /** Saving KPIs to firestore **/
        await Promise.all(kpis.map(async (kpi) => {
            /** workaround because date is not a date-datatype */
            let year = parsedJSON.date.toString().slice(0, 4)

            /** Check if document exists and get existing data */
            await getKpiDocFromFirestore(year, kpi)
                .then(docSnapshot => {
                    if (docSnapshot.exists)
                    {
                        /** check if current date was already written to db */
                        let existingKpiData = docSnapshot.data() as KpiModel;
                        let dateFound = false
                        existingKpiData.values.forEach(value => {
                            if (value.date == parsedJSON.date)
                            {
                                dateFound = true
                            }
                        })
                        if (!dateFound) {
                            existingKpiData.values.push(kpi.values[0])
                            writeKpiToFirestore(year, existingKpiData)
                        }
                    }
                    else {
                        // document has to be created
                        writeKpiToFirestore(year, kpi)
                            .then()
                            .catch(error => {
                                throw new BadRequestError(error);
                            })
                    }
                })
                .catch(error => {
                    throw new BadRequestError(error);
                })
        }));

        /**
         * Functions for saving data to firestore
         * */
        async function writeTourToFirestore(tour: Tour) {
            // save response from firestore to be able to use the promise
            //ensures that documentID is always unique!
            const docRef = firestore()
                .collection(COMPANIES_COLLECTION+`/${parsedJSON.shippingCompany}/`+TOURS_COLLECTION)
                .doc();

            return await docRef.set(tour);
        }

        async function writeKpiToFirestore(year: string, kpiData: KpiModel) {
            // save response from firestore to be able to use the promise
            const docRef = firestore()
                .collection(COMPANIES_COLLECTION+`/${parsedJSON.shippingCompany}/`+KPI_COLLECTION+`${year}/`)
                .doc(kpiData.name);


          return await docRef.set(kpiData);
        }

        async function getKpiDocFromFirestore(year: string, kpiData: KpiModel)  {

            const docRef = firestore()
                .collection(COMPANIES_COLLECTION+`/${shippingCompanyId}/`+KPI_COLLECTION+`${year}/`)
                .doc(kpiData.name);


            return await docRef.get();
        }

        async function addResourceToFirebaseArray(resource: ResourceModel) {

            return await firestore()
                .collection(COMPANIES_COLLECTION)
                .doc(shippingCompanyId)
                .update({
                    resources: FieldValue.arrayUnion(resource)
                })
        }

        /**
         * Calculations for Tours
         * */
        function calculateResourceCost(masterDataResources: ResourceModel[], resource: string, kilometers: number,) {
            let cost = 0;

            masterDataResources.forEach((masterDataResource) => {
                if (resource == masterDataResource.type) {
                    if (masterDataResource.costType.toLowerCase() == 'per km') {
                        cost = masterDataResource.cost * kilometers;
                    } else {
                        cost = masterDataResource.cost;
                    }
                }
            })
            return cost;
        }

        function calculateResourceCO2(masterDataResources: ResourceModel[], resource: string, kilometers: number) {
            let co2 = 0;

            masterDataResources.forEach((masterDataResource) => {
                if (resource == masterDataResource.type) {
                    co2 = kilometers * masterDataResource.co2PerKm
                }
            })
            return co2;
        }

        /**
         * Calculations for KPIs
         * */
        function avgKmTours(tours: Tour[], performedTours: number) {
            let sumKilometers: number = 0;

            tours.forEach((tour) => {
                if(tour.performed) {
                    sumKilometers += tour.kilometers
                }
            });

            return sumKilometers / performedTours;
        }

        function avgStopsTours(tours: Tour[], performedTours: number) {
            let sumStops: number = 0;

            tours.forEach((tour) => {
                if(tour.performed) {
                    sumStops += tour.numberOfStops
                }
            });

            return sumStops / performedTours;
        }

        function costsUsedResources(tours: Tour[]) {
            let totalCost = 0;

            tours.forEach((tour) => {
                totalCost += calculateResourceCost(resources, tour.resource, tour.kilometers);
            })

            return totalCost;
        }

        function toursPerResourceType(tours: Tour[]) {
            let resourceTypeUsageArray: { resource: string, count: number }[] = [];

            tours.forEach((tour) => {
                let newResourceToAdd: boolean = true;

                if(tour.performed) {
                    if (resourceTypeUsageArray[0] == null) {
                        resourceTypeUsageArray.push({resource: tour.resource, count: 1})
                    } else {
                        let index = 0;

                        for (index; index < resourceTypeUsageArray.length; index++) {
                            if (resourceTypeUsageArray[index].resource === tour.resource) {
                                resourceTypeUsageArray[index].count += 1;
                                newResourceToAdd = false;
                                break;
                            }
                        }

                        //add newResource to array, if it does not already exist
                        if (newResourceToAdd) {
                            resourceTypeUsageArray.push({resource: tour.resource, count: 1});
                        }
                    }
                }
            })

            return resourceTypeUsageArray;
        }

         function toursPerTransportOperator(tours: Tour[]) {
            let resourceTransportOperatorArray: { operator: string, count: number }[] = [];

            tours.forEach((tour) => {
                let newTransportOperatorToAdd: boolean = true;

                if(tour.performed) {
                    if (resourceTransportOperatorArray[0] == null) {
                        resourceTransportOperatorArray.push({operator: tour.transportOperator, count: 1})
                    } else {
                        let index = 0;

                        for (index; index < resourceTransportOperatorArray.length; index++) {
                            if (resourceTransportOperatorArray[index].operator === tour.transportOperator) {
                                resourceTransportOperatorArray[index].count += 1;
                                newTransportOperatorToAdd = false;
                                break;
                            }
                        }

                        //add newResource to array, if it does not already exist
                        if (newTransportOperatorToAdd) {
                            resourceTransportOperatorArray.push({operator: tour.transportOperator, count: 1});
                        }
                    }
                }
            })

            return resourceTransportOperatorArray;
        }

        function shipmentsPerTransportOperator(tours: Tour[]) {
            let shipmentsTransportOperatorArray: { operator: string, shipments: number }[] = [];

            tours.forEach((tour) => {
                let newTransportOperatorToAdd: boolean = true;

                if(tour.performed) {
                    if (shipmentsTransportOperatorArray[0] == null) {
                        shipmentsTransportOperatorArray.push({operator: tour.transportOperator, shipments: tour.plannedShipments})
                    } else {
                        let index = 0;

                        for (index; index < shipmentsTransportOperatorArray.length; index++) {
                            if (shipmentsTransportOperatorArray[index].operator === tour.transportOperator) {
                                shipmentsTransportOperatorArray[index].shipments += tour.plannedShipments;
                                newTransportOperatorToAdd = false;
                                break;
                            }
                        }

                        //add newResource to array, if it does not already exist
                        if (newTransportOperatorToAdd) {
                            shipmentsTransportOperatorArray.push({operator: tour.transportOperator, shipments: tour.plannedShipments});
                        }
                    }
                }
            })

            return shipmentsTransportOperatorArray;
        }

        /**
         * Calculations saving KPIs
         * */
        function costSavingResources(masterDataResources: ResourceModel[], tours: Tour[]) {
            let savedCosts = 0;

            tours.forEach((tour) => {
                if (!tour.performed) {
                    masterDataResources.forEach((masterDataResource) => {
                        if (tour.resource == masterDataResource.type) {
                            if (masterDataResource.costType.toLowerCase() == 'per km') {
                                const avgKm = avgKmTours(tours, parsedJSON.plannedTours);
                                savedCosts += avgKm * masterDataResource.cost;
                            } else {
                                savedCosts += masterDataResource.cost;
                            }
                        }
                    })
                }
            })

            return savedCosts;
        }

        function co2Savings(masterDataResources: ResourceModel[], tours: Tour[]) {
            let savedCo2 = 0;
            const avgKm = avgKmTours(tours, parsedJSON.plannedTours);

            tours.forEach((tour) => {
                if (!tour.performed) {
                    masterDataResources.forEach((masterDataResource) => {
                        if (tour.resource == masterDataResource.type) {
                            savedCo2 += avgKm * masterDataResource.co2PerKm;
                        }
                    })
                }
            })

            return savedCo2;
        }

        function costSavingsPlanningTime(masterData: MasterDataModel, amountPlannedShipments: number) {
            let alucoCost;

            if(amountPlannedShipments <= 1000) {
                alucoCost = amountPlannedShipments * 0.1;
            }
            else if(amountPlannedShipments > 1000 && amountPlannedShipments <= 2500) {
                alucoCost = amountPlannedShipments * 0.09;
            }
            else {
                alucoCost = amountPlannedShipments * 0.08;
            }

            return masterData.dispatcherSalary * (masterData.regularPlanningTime) - alucoCost;
        }

        function timeSavingsPlanningTime(masterData: MasterDataModel, planningTime: number) {
            return masterData.regularPlanningTime * 3600 - planningTime;
        }

        function tourSavings(availableTours: number, plannedTours: number) {
            return availableTours - plannedTours;
        }

        /**
         * Calculations utilization KPIs
         * */
        function utilizationTours(availableTours: number, plannedTours: number) {
            return plannedTours * 100 / availableTours;
        }

        function avgUsedShipmentVolume(masterData: MasterDataModel, masterDataResources: ResourceModel[], tours: Tour[], performedTours: number) {
            let usedShipmentVolumeValues: {avg: number, capacity: number}[] = [];
            let capacity = 0;
            let toursShipmentVolume = 0;

            tours.forEach((tour) => {
                if (tour.performed && tour.plannedShipmentVolume != null) {
                    masterDataResources.forEach((masterDataResource) => {
                        if (tour.resource == masterDataResource.type) {
                            toursShipmentVolume += tour.plannedShipmentVolume * 100 / masterDataResource.loadingVolume;
                            capacity += masterDataResource.loadingVolume;
                        }
                    })
                }
            })
            usedShipmentVolumeValues.push({avg: (toursShipmentVolume / performedTours), capacity: capacity});

            return usedShipmentVolumeValues;
        }

        function avgUsedStoringPositions(masterData: MasterDataModel, masterDataResources: ResourceModel[], tours: Tour[], performedTours: number) {
            let usedStoringPositionValues: {avg: number, capacity: number}[] = [];
            let toursStoringPositions = 0;
            let capacity = 0;

            tours.forEach((tour) => {
                if (tour.performed && tour.plannedShipmentStoringPositions != null) {
                    masterDataResources.forEach((masterDataResource) => {
                        if (tour.resource == masterDataResource.type) {
                            toursStoringPositions += tour.plannedShipmentStoringPositions * 100 / masterDataResource.maxStoringPositions;
                            capacity += masterDataResource.maxStoringPositions;
                        }
                    })
                }
            })
            usedStoringPositionValues.push({avg: (toursStoringPositions / performedTours), capacity: capacity});

            return usedStoringPositionValues;
        }

        function avgUsedLoadingMeter(masterData: MasterDataModel, masterDataResources: ResourceModel[], tours: Tour[], performedTours: number) {
            let loadingMeterValues: {avg: number, capacity: number}[] = [];
            let capacity = 0;
            let toursLoadingMeter = 0;

            tours.forEach((tour) => {
                if (tour.performed && tour.plannedShipmentLoadingMeter != null) {

                    masterDataResources.forEach((masterDataResource) => {
                        if (tour.resource == masterDataResource.type) {
                            toursLoadingMeter += tour.plannedShipmentLoadingMeter * 100 / masterDataResource.loadingMeter;
                            capacity += masterDataResource.loadingMeter;
                        }
                    })
                }
            })
            loadingMeterValues.push({avg: (toursLoadingMeter / performedTours), capacity: capacity});

            return loadingMeterValues;
        }

}
