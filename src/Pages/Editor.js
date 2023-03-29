import { useNavigate } from "react-router-dom";

const Editor = () => {
    const navigate = useNavigate()
    return (
        <>
        <h1>Editor</h1>
        <button onClick={() => navigate('/load')}>Login</button>
        </>
    );
}

export default Editor;