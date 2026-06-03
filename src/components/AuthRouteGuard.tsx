import { Outlet } from "react-router-dom";
import {withAuthenticationRequired} from "react-oidc-context";

const PrivateRouteComponent = () => {
    return <Outlet />;
};
const AuthRouteGuard = withAuthenticationRequired(PrivateRouteComponent, {
    OnRedirecting: () => (<div>Redirecting to the login page...</div>)
});
export default AuthRouteGuard;