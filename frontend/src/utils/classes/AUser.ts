import type { APermissions } from '@/utils/classes/APermissions'

/**
 * @description The user class
 */
export class AUser {
  uid?: string
  email: string
  permissions: APermissions
  shippingCompanyId: string
  shippingCompanyName: string

  public constructor(
    email: string,
    permissions: APermissions,
    shippingCompanyId: string,
    shippingCompanyName: string,
    uid?: string
  ) {
    this.email = email
    this.permissions = permissions
    this.shippingCompanyId = shippingCompanyId
    this.shippingCompanyName = shippingCompanyName
    this.uid = uid
  }
}
