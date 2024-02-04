/**
 * Interface for the user object returned by the backend
 */
export interface AIBackendUser {
  uid: number
  email: string
  shippingCompanyId: string
  shippingCompanyName: string
  roles: string[]
}
