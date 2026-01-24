import {useState} from "react";
import {useAuth} from "../context/AuthContext";
import {useLocation, useNavigate} from "react-router-dom";
import {useToast} from "../context/ToastContext.jsx";
import {getErrorMessage} from "../utils/api.js";

export default function Login() {
    const {login} = useAuth();
    const [email, setEmail] = useState("demo@example.com");
    const [password, setPassword] = useState("password123")
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/dashboard";
    const {pushToast} = useToast();
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login(email, password);
            navigate(from, {replace: true});
        } catch (error) {
            const message = getErrorMessage(error);
            setError(message);
            pushToast({type: "error", message: message});
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className = "max-w-md">
            <h1 className = "text-2xl font-bold mb-4">Login</h1>

            <form onSubmit = {handleSubmit} className = "space-y-3">
                <div>
                    <label className = "block text-sm mb-1">Email</label>
                    <input 
                        type = "email"
                        className = "w-full border rounded px-3 py-2"
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                        autoComplete = "email"
                        required
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
                        required
                    />
                </div>

                {error && <div className = "text-red-600 text-sm">{error}</div>}

                <button disabled = {submitting} className = "px-4 py-2 rounded bg-black text-white">{submitting ? "Logging in" : "Login"}</button>
            </form>
        </div>
    );
}