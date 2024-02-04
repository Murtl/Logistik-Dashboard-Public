import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { auth } from '@/firebase'
import { AUser } from '@/utils/classes/AUser'
import { APermissions } from '@/utils/classes/APermissions'
import type { AIBackendUser } from '@/utils/interfaces/AIBackendUser'
import AApiService from '@/services/AApiService'

/**
 * @description This class contains all the functions for the authentication of the user.
 */
export class AAuthService {
  /**
   * @description This function logs the user in.
   * @param email E-Mail of the user
   * @param password Password of the user
   * @returns {Promise<{state: boolean, message: string}>} Returns a promise with the state and the message.
   */
  static async login(
    email: string,
    password: string
  ): Promise<{ state: boolean; message: string }> {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { state: true, message: 'Login erfolgreich' }
    } catch (e: any) {
      switch (e.message) {
        case 'Firebase: Error (auth/user-not-found).':
          return { state: false, message: 'Benutzer nicht gefunden' }
        case 'Firebase: Error (auth/wrong-password).':
          return { state: false, message: 'Falsches Passwort' }
        case 'Firebase: Error (auth/invalid-email).':
          return { state: false, message: 'Ungültige E-Mail' }
        case 'Firebase: Error (auth/user-disabled).':
          return { state: false, message: 'Benutzer deaktiviert' }
        default:
          return { state: false, message: 'Login ist gescheitert' }
      }
    }
  }

  /**
   * @description This function reauthenticates the user.
   * @param password Password of the user
   * @returns {Promise<{state: boolean, message: string}>} Returns a promise with the state and the message.
   */
  static async reauthenticate(password: string): Promise<{ state: boolean; message: string }> {
    const user = auth.currentUser
    if (user && typeof user.email === 'string') {
      const credentials = EmailAuthProvider.credential(user.email, password)
      try {
        await reauthenticateWithCredential(user, credentials)
        return { state: true, message: 'Successfully reauthenticated' }
      } catch (e: any) {
        switch (e.message) {
          case 'Firebase: Error (auth/user-mismatch).':
            return { state: false, message: 'User mismatched' }
          case 'Firebase: Error (auth/user-not-found).':
            return { state: false, message: 'User not found' }
          case 'Firebase: Error (auth/invalid-email).':
            return { state: false, message: 'Invalid Email' }
          case 'Firebase: Error (auth/invalid-credential).':
            return { state: false, message: 'Invalid credentials' }
          case 'Firebase: Error (auth/wrong-password).':
            return { state: false, message: 'Wrong password' }
          case 'Firebase: Error (auth/invalid-verification-code).':
            return { state: false, message: 'Invalid verification code' }
          case 'Firebase: Error (auth/invalid-verification-id).':
            return { state: false, message: 'Invalid verification id' }
          default:
            return { state: false, message: 'Something went wrong' }
        }
      }
    }
    return { state: false, message: 'No user logged in' }
  }

  /**
   * @description This function logs the user out.
   * @returns {Promise<{state: boolean, message: string}>} Returns a promise with the state and the message.
   */
  static async logout(): Promise<{
    state: boolean
    message: string
  }> {
    const user = auth.currentUser
    if (user) {
      try {
        await auth.signOut()
        return { state: true, message: 'Logged out successfully' }
      } catch (e: any) {
        return { state: false, message: 'Something went wrong' }
      }
    }
    return { state: false, message: 'No user logged in' }
  }

  /**
   * @description This returns the information of a User from firestore.
   * @returns {Promise<{state: boolean, message: string}>} Returns a promise with User Object.
   */
  static async getUserInfo(): Promise<AUser> {
    const result = await AApiService.get<AIBackendUser>('users/login')
    if (result.status !== 200) throw new Error('Error while fetching user info')

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
  }
}
