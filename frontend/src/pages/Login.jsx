import {useState} from "react";
import {useAuth} from "../context/AuthContext";
import {useLocation, useNavigate} from "react-router-dom";

export default function Login() {
    const {login} = useAuth();
    const [email, setEmail] = useState("demo@example.com");
    const [password, setPassword] = useState("password123")
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/dashboard";

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            await login(email, password);
            navigate(from, {replace: true});
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className = "max-w-md">
            <h1 className = "text-2xl font-bold mb-4">Login</h1>

            <form onSubmit = {handleSubmit} className = "space-y-3">
                <div>
                    <label className = "block text-sm mb-1">Email</label>
                    <input 
                        className = "w-full border rounded px-3 py-2"
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                        autoComplete = "email"
                    />
                </div>

                <div>
                    <label className = "block text-sm mb-1">Password</label>
                    <input 
                        className = "w-full border rounded px-3 py-2"
                        type = "password"
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                        autoComplete = "current-password"
                    />
                </div>

                {error && <div className = "text-red-600 text-sm">{error}</div>}

                <button className = "px-4 py-2 rounded bg-black text-white">Login</button>
            </form>
        </div>
    );
}