export type GetAdminUsersResponse = {
    uid : string,
    email : string,
    shippingCompanyId : string,
    shippingCompanyName : string,
}

export type CreateAdminUserRequest = {
    email : string,
    password : string,
    confirmPassword : string,
    shippingCompanyId : string,
    shippingCompanyName : string,
}

export type UpdateAdminUserRequest = {
    email? : string,
    password? : string,
    confirmPassword? : string,
}