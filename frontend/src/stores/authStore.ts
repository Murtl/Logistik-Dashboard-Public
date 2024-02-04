import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { auth } from '@/firebase'
import { AAuthService } from '@/services/AAuthService'
import { AUser } from '@/utils/classes/AUser'
import { APermissions } from '@/utils/classes/APermissions'

/**
 * @description Store for currently logged in user data
 */
export const useAuthStore = defineStore('authStore', () => {
  const user = ref(auth.currentUser)
  const aUser: Ref<AUser> = ref(new AUser('', new APermissions(false, false, false), '', ''))

  const loggedIn = ref(false)
  const loading = ref(true)
  const userMail = computed(() => user.value?.email)
  const userUID = computed(() => user.value?.uid)
  const isSuperadmin = ref(false)

  auth.onAuthStateChanged(async (newUser) => {
    if (newUser) {
      const token = await newUser.getIdTokenResult()
      isSuperadmin.value = token.claims.roles ? token.claims.roles[0] === 'superadmin' : false
      if (!isSuperadmin.value) {
        aUser.value = await AAuthService.getUserInfo()
      } else {
        aUser.value = new AUser(
          newUser.email!,
          new APermissions(false, false, false),
          '',
          '',
          newUser.uid
        )
      }
      loggedIn.value = true
    } else {
      loggedIn.value = false
    }
    loading.value = false
  })

  return { userUID, userMail, loggedIn, aUser, isSuperadmin, loading }
})
