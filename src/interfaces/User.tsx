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

export interface UserUpdatePayload {
    user: UserinfoForUpdate;
    address: UserAddress;
}

export interface UserinfoForUpdate {
    firstName: string;
    lastName: string;
}

export interface UserAddress {
    civicNumber: number;
    apptNumber: number | null;
    street: string;
    city: string;
    postalCode: string;
    provinceCode: string;
    country: string;
}