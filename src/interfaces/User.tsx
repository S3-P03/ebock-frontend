export interface User {
    cip: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePictureUrl: string | null;
}

export interface ConnectedUser {
    cip: string;
    email: string;
}

export interface UserInformation {
    user: User;
    address: UserAddress;
}

export interface UserAddress {
    noCivic: number;
    street: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
}