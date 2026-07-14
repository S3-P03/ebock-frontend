import { useEffect } from "react";
import useAuthSession from "hooks/useAuthSession";

export default function Login() {

    const {login} = useAuthSession();

    useEffect(() => {
        login();
    }, []);

    return null;
}
