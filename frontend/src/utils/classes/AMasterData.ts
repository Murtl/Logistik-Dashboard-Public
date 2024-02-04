import type { AResource } from '@/utils/classes/AResource'

/**
 * @description The master data class
 */
export class AMasterData {
  shippingCompanyName: string
  regularPlanningTime: number
  dispatcherSalary: number
  resources: AResource[]

  constructor(
    shippingCompanyName: string,
    regularPlanningTime: number,
    dispatcherSalary: number,
    resources: AResource[]
  ) {
    this.shippingCompanyName = shippingCompanyName
    this.regularPlanningTime = regularPlanningTime
    this.dispatcherSalary = dispatcherSalary
    this.resources = resources
  }
}
