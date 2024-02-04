/**
 * @description Class for permissions
 */
export class APermissions {
  userManagement: boolean
  resourceManagement: boolean
  dashboard: boolean

  public constructor(userManagement: boolean, resourceManagement: boolean, dashboard: boolean) {
    this.userManagement = userManagement
    this.resourceManagement = resourceManagement
    this.dashboard = dashboard
  }

  public toLocaleString(): string {
    let result = ''
    if (this.userManagement) {
      result += 'Benutzerverwaltung'
    }
    if (this.resourceManagement) {
      if (result.length > 0) {
        result += ', '
      }
      result += 'Stammdatenpflege'
    }
    if (this.dashboard) {
      if (result.length > 0) {
        result += ', '
      }
      result += 'Dashboard'
    }
    return result
  }
}
