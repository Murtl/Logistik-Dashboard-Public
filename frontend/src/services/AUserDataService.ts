import { AUser } from '@/utils/classes/AUser'
import { APermissions } from '@/utils/classes/APermissions'
import type { AIBackendUser } from '@/utils/interfaces/AIBackendUser'
import AApiService from '@/services/AApiService'

/**
 * @description This class contains all the functions for user data management.
 */

export class AUserDataService {
  /**
   * @description This function returns a list of all users.
   * @param shippingCompanyId ID of the shipping company
   * @returns {Promise<AUser[]>} Returns a promise with the state and the message.
   */
  static async getUsers(shippingCompanyId: string) {
    const users: AUser[] = []
    const result = await AApiService.get<AIBackendUser[]>(
      'companies/' + shippingCompanyId + '/users/'
    )
    if (result.data.length === 0) return users
    result.data.forEach((user) => {
      users.push(
        new AUser(
          user.email,
          new APermissions(
            user.roles.includes('admin'),
            user.roles.includes('masterdata'),
            user.roles.includes('dashboard')
          ),
          user.shippingCompanyId,
          user.shippingCompanyName,
          user.uid.toString()
        )
      )
    })
    return users
  }

  /**
   * @description This function creates a new user.
   * @param shippingCompanyId ID of the shipping company
   * @param user AUser Object with the email, password and permissions for new user
   * @param password Password of the user
   * @param confirmPassword Password of the user
   * @returns {Promise<{state: boolean, message: string}>} Returns a promise with the state and the message.
   */
  static async createUser(
    shippingCompanyId: string,
    user: AUser,
    password: string,
    confirmPassword: string
  ) {
    return await AApiService.post<AIBackendUser>('companies/' + shippingCompanyId + '/users', {
      email: user.email,
      password: password,
      confirmPassword: confirmPassword,
      roles: [
        user.permissions.resourceManagement ? 'masterdata' : '',
        user.permissions.dashboard ? 'dashboard' : ''
      ],
      shippingCompanyId: user.shippingCompanyId,
      shippingCompanyName: user.shippingCompanyName
    })
      .then((result) => {
        return new AUser(
          result.data.email,
          new APermissions(
            result.data.roles.includes('admin'),
            result.data.roles.includes('masterdata'),
            result.data.roles.includes('dashboard')
          ),
          result.data.shippingCompanyId,
          result.data.shippingCompanyName,
          result.data.uid.toString()
        )
      })
      .catch((error) => {
        return { state: false, message: error.response.data.additionalInfo.message }
      })
  }

  /**
   * @description This function deletes a user.
   * @param shippingCompanyId ID of the shipping company
   * @param uid ID of the user
   * @returns {Promise<{state: boolean, message: string}>} Returns a promise with the state and the message.
   */
  static async deleteUser(shippingCompanyId: string, uid: string) {
    return await AApiService.delete('companies/' + shippingCompanyId + '/users/' + uid)
      .then(() => {
        return { state: true, message: 'User erfolgreich gelöscht' }
      })
      .catch((error) => {
        return { state: false, message: error.response.data.additionalInfo.message }
      })
  }

  /**
   * @description This function edits a user.
   * @param shippingCompanyId ID of the shipping company
   * @param oldUser AUser Object with the email, password and permissions of the old user
   * @param editedUser AUser Object with the email, password and permissions of the edited user
   * @param newPassword Password of the user
   * @returns {Promise<{state: boolean, message: string}>} Returns a promise with the state and the message.
   */
  static async editUser(
    shippingCompanyId: string,
    oldUser: AUser,
    editedUser: AUser,
    newPassword?: string
  ) {
    let data
    if (newPassword) {
      data = {
        email: editedUser.email,
        password: newPassword,
        confirmPassword: newPassword,
        roles: [
          editedUser.permissions.resourceManagement ? 'masterdata' : '',
          editedUser.permissions.dashboard ? 'dashboard' : ''
        ]
      }
    } else {
      data = {
        email: editedUser.email,
        password: null,
        confirmPassword: null,
        roles: [
          editedUser.permissions.resourceManagement ? 'masterdata' : '',
          editedUser.permissions.dashboard ? 'dashboard' : ''
        ]
      }
    }
    return await AApiService.put(
      'http://localhost:3000/api/companies/' + shippingCompanyId + '/users/' + oldUser.uid,
      data
    )
      .then(() => {
        return { state: true, message: 'User erfolgreich geupdated' }
      })
      .catch((error) => {
        return { state: false, message: error.response.data.additionalInfo.message }
      })
  }
}
