import { User } from "oidc-client-ts";

export interface AuthSession {
    isAuthenticated : boolean,
    isLoading: boolean,
    connectedUser : User,
    login: () => void
    logout: () => void
}