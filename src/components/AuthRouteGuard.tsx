import { Outlet, Navigate } from "react-router-dom";
import useAuthSession from "hooks/useAuthSession";

const AuthRouteGuard = () => {
    const { isAuthenticated, isLoading } = useAuthSession();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthRouteGuard;