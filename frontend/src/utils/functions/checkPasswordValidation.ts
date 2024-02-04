/**
 * Check if the password is valid
 * @param passwordToCheck The password to check
 */
export const checkPasswordValidation = (passwordToCheck: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/
  return passwordRegex.test(passwordToCheck)
}
