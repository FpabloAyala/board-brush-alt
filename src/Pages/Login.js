
import { useNavigate } from "react-router-dom";
const Login = () => {
    const navigate = useNavigate()
    return (
        <>
        <h1>Login</h1>
        <button onClick={() => navigate('/editor')}>Login</button>
        </>
    );
}

export default Login;