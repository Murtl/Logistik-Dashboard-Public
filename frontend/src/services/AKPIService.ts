import AApiService from '@/services/AApiService'

/**
 * @description This service gets the KPIs from the backend.
 */
export class AKPIService {
  static async getKPIs(
    shippingCompanyId: string,
    year: number,
    from?: string,
    to?: string,
    kpiFilter?: string[]
  ) {
    return await AApiService.post(`companies/${shippingCompanyId}/kpis`, {
      year: year,
      from: from?.split('.').reverse().join('-'),
      to: to?.split('.').reverse().join('-'),
      kpiFilter: kpiFilter
    })
  }
}
