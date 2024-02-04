import type { ATourDataType } from '@/utils/types/aTourDataType'
import AApiService from './AApiService'

/**
 * @description This service gets the TourData from the backend.
 */
export class ATourDataService {
  static async getTourData(shippingCompanyID: string, date: string): Promise<ATourDataType[]> {
    const response = await AApiService.post(`/companies/${shippingCompanyID}/tours`, {
      date: date.split('.').reverse().join('-')
    })
    return response.data
  }
}
