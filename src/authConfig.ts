export const authProviderConfig = {
    authority: `${process.env.REACT_APP_KEYCLOAK_URL}realms/${process.env.REACT_APP_KEYCLOAK_REALM}`,
    client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
    automaticSilentRenew: true,
    redirect_uri: process.env.REACT_APP_REDIRECT_URI || `${window.location.origin}/`,
    onSigninCallback: () => {
        window.history.replaceState({}, document.title, window.location.pathname);
    },
};

export const logoutRedirectUri = process.env.REACT_APP_LOGOUT_REDIRECT_URI || `${window.location.origin}/login`;