import {useAuth} from "react-oidc-context";
import { logoutRedirectUri } from "authConfig";

export default function useAuthSession(){
    const auth = useAuth();
    return {
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        connectedUser: {
            cip: auth.user?.profile?.cip || "",
            email: auth.user?.profile?.email || "",
        },
        token: auth.user?.access_token || "",
        login: () => auth.signinRedirect(),
        logout: () => auth.signoutRedirect({
            post_logout_redirect_uri: logoutRedirectUri
        })
    }
}