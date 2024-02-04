export type User = {
    uid : string,
    email : string,
    password : string,
    confirmPassword : string,
    disabled : boolean,
    displayName : string,
    roles : string[]
}

export type CreateUserResponse = {
    uid : string,
    email : string,
    shippingCompanyId : string,
    shippingCompanyName : string,
    roles : string[]
}

export type CreateUserRequest = {
    email : string,
    password : string,
    confirmPassword : string,
    roles : string[],
    shippingCompanyId : string
    shippingCompanyName : string
}

export type GetUserResponse = {
    uid : string,
    email : string,
    roles : string[],
    shippingCompanyId : string
    shippingCompanyName : string
}

export type UpdateUserRequest = {
    email? : string,
    password? : string,
    confirmPassword? : string,
    roles? : string[],
}
