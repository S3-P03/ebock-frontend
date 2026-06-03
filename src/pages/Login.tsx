import useAuthSession from "../hooks/useAuthSession";

export default function Login() {

    const {login} = useAuthSession();

    return (
        <div>
            <h1>Se connecter</h1>
            <button className="text-blue-600 hover:underline cursor-pointer mt-4" onClick={login}>Login here</button>
        </div>
    );
}
