import { AMasterData } from '@/utils/classes/AMasterData'
import AApiService from '@/services/AApiService'

/**
 * @description This class contains all the functions for the api calls for the master data.
 */
export class AMasterDataService {
  /**
   * @description This function returns the master data.
   * @param shippingCompanyId ID of the shipping company
   * @returns {Promise<AMasterData>} Returns a promise with the master data.
   */
  static async getMasterData(shippingCompanyId: string) {
    const result = await AApiService.get(`companies/${shippingCompanyId}/masterData`)
    if (result.status === 204) {
      return new AMasterData('', 0, 0, [])
    }
    return result.data
  }

  /**
   * @description This function updates the master data.
   * @param updatedMasterData The updated master data.
   * @param shippingCompanyId ID of the shipping company
   * @returns {Promise<{state: boolean, message: string}>} Returns a promise with the state and the message.
   */
  static async updateMasterData(updatedMasterData: AMasterData, shippingCompanyId: string) {
    const result = await AApiService.put(
      `companies/${shippingCompanyId}/masterData`,
      updatedMasterData
    )
    return result.data
  }

  /**
   * @description This function creates a master data file.
   * @param masterData The master data.
   * @param shippingCompanyId ID of the shipping company
   * @returns {Promise<{state: boolean, message: string}>} Returns a promise with the state and the message.
   */

  static async createMasterData(masterData: AMasterData, shippingCompanyId: string) {
    const result = await AApiService.post(`companies/${shippingCompanyId}/masterData`, masterData)
    return result.data
  }
}
