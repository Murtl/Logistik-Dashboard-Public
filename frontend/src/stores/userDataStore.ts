import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { AUser } from '@/utils/classes/AUser'
import { AUserDataService } from '@/services/AUserDataService'

/**
 * @description Store for user data
 */
export const useUserDataStore = defineStore('userDataStore', () => {
  const users: Ref<AUser[]> = ref(Array<AUser>())

  const fetchUsers = async (shippingCompanyID: string) => {
    users.value = await AUserDataService.getUsers(shippingCompanyID)
  }

  const addUser = async (shippingCompanyID: string, newUser: AUser, password: string) => {
    return AUserDataService.createUser(shippingCompanyID, newUser, password, password).then(
      async (result) => {
        if (result instanceof AUser) {
          users.value.push(result)
          return { state: true, message: 'User created successfully' }
        }
        return result
      }
    )
  }

  const deleteUser = async (shippingCompanyID: string, uid: string) => {
    return AUserDataService.deleteUser(shippingCompanyID, uid).then(async (result) => {
      if (result.state) {
        users.value = users.value.filter((user) => {
          if (user.uid !== uid) return user
        })
      }
      return result
    })
  }

  const updateUser = async (
    shippingCompanyID: string,
    oldUser: AUser,
    editedUser: AUser,
    newUserPassword: string
  ) => {
    return AUserDataService.editUser(shippingCompanyID, oldUser, editedUser, newUserPassword).then(
      async (result) => {
        if (result.state) {
          users.value = users.value.map((user) => {
            if (user.uid === oldUser.uid) {
              return editedUser
            }
            return user
          })
        }
        return result
      }
    )
  }

  return { users, fetchUsers, addUser, deleteUser, updateUser }
})
