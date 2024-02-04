/**
 * Type for a tour data
 */
export type ATourDataType = {
  tourNumber: string
  transportOperator: string
  date: string
  kilometers: number
  plannedShipments: number
  plannedShipmentWeight: number
  resource: string
  numberOfStops: number
  plannedShipmentVolume: number
  plannedShipmentStoringPositions: number
  plannedShipmentLoadingMeter: number
  cost: number
  co2: number
  performed: boolean
}
