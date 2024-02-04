import type { ACostTypes } from '@/utils/interfaces/ACostTypes'

/**
 * @description The resource class
 */
export class AResource {
  type: string
  costType: ACostTypes
  cost: number
  co2PerKm: number
  loadingVolume: number
  maxStoringPositions: number
  loadingMeter: number
  payload: number

  public constructor(
    type: string,
    costType: ACostTypes,
    cost: number,
    co2PerKM: number,
    loadingVolume: number,
    maxStoringPositions: number,
    loadingMeter: number,
    payload: number
  ) {
    this.type = type
    this.costType = costType
    this.cost = cost
    this.co2PerKm = co2PerKM
    this.loadingVolume = loadingVolume
    this.maxStoringPositions = maxStoringPositions
    this.loadingMeter = loadingMeter
    this.payload = payload
  }
}
