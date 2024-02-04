import type { AAdminUser } from '@/utils/types/aAdminUser'
import AApiService from '@/services/AApiService'

/**
 * @description This class contains all functions for the super admin view to manage the admin users.
 */
export class ASuperAdminService {
  /**
   * @description This function gets all admin users.
   */
  static async getAdminUsers(): Promise<AAdminUser[]> {
    const result = await AApiService.get('admin/companies')
    return result.data
  }

  /**
   * @description This function creates a new admin user.
   * @param email Email of the new admin user
   * @param password Password of the new admin user
   * @param confirmPassword Password of the new admin user
   * @param shippingId ID of the shipping company
   * @param shippingName Name of the shipping company
   */
  static async createAdminUser(
    email: string,
    password: string,
    confirmPassword: string,
    shippingId: string,
    shippingName: string
  ): Promise<AAdminUser> {
    const result = await AApiService.post('admin/companies', {
      email: email,
      password: password,
      confirmPassword: password,
      shippingCompanyId: shippingId,
      shippingCompanyName: shippingName
    })
    return result.data
  }

  /**
   * @description This function updates an admin user.
   *
   * @param uid UID of the admin user
   * @param email Email of the admin user
   * @param password new Password of the admin user
   * @param confirmPassword new Password of the admin user
   */
  static async updateAdminUser(
    uid: string,
    email: string,
    password?: string,
    confirmPassword?: string
  ) {
    let data
    if (password && confirmPassword) {
      data = {
        email: email,
        password: password,
        confirmPassword: confirmPassword
      }
    } else {
      data = {
        email: email,
        password: null,
        confirmPassword: null
      }
    }

    const result = await AApiService.put('admin/companies/' + uid, data)
    return result.data
  }

  /**
   * @description This function deletes an admin user.
   * @param uid UID of the admin user
   * @param shippingCompanyId ID of the shipping company
   */
  static async deleteAdminUser(uid: string, shippingCompanyId: string) {
    try {
      await AApiService.delete(`admin/companies/${uid}/${shippingCompanyId}`)
      return { state: true, message: 'User erfolgreich gelöscht' }
    } catch (error: any) {
      return { state: false, message: error.response.data.additionalInfo.message }
    }
  }
}
