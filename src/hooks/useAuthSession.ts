import {useAuth} from "react-oidc-context";
import { logoutRedirectUri } from "authConfig";
import { setRedactedEbockEnvironment, setCurrentAuthToken } from "services/apiClient";
import { useEffect } from "react";

export default function useAuthSession(){
    const auth = useAuth();
    const token = auth.user?.access_token || "";

    useEffect(() => {
        setCurrentAuthToken(token);
    }, [token]);

    return {
        isAuthenticated: auth.isAuthenticated,
        isLoading: auth.isLoading,
        connectedUser: {
            cip: auth.user?.profile?.cip || "",
            email: auth.user?.profile?.email || "",
        },
        token: token,
        login: () => auth.signinRedirect(),
        logout: () => {
            setRedactedEbockEnvironment(false);
            auth.signoutRedirect({
                post_logout_redirect_uri: logoutRedirectUri
            })
        }
    }
}