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