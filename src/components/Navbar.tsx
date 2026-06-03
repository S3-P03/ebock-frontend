import useAuthSession from "../hooks/useAuthSession";

export default function Navbar(){
    const {login, logout, isAuthenticated} = useAuthSession();
    return (
        <nav>
            My app &nbsp;
            {isAuthenticated ? (
                <button onClick={logout}>Logout</button>
            ) : (
                <button onClick={login}>Login</button>
            )}
        </nav>
    )
}