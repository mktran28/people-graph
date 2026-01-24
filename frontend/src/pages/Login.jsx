import {useState} from "react";
import {useAuth} from "../context/AuthContext";
import {useLocation, useNavigate} from "react-router-dom";
import {useToast} from "../context/ToastContext.jsx";
import {getErrorMessage} from "../utils/api.js";
import AuthForm from "../components/AuthForm.jsx";

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
        <AuthForm 
            title = "Login"
            submitLabel = "Login"
            email = {email}
            setEmail = {setEmail}
            password = {password}
            setPassword = {setPassword}
            passwordAutoComplete = "current-password"
            error = {error}
            submitting = {submitting}
            onSubmit = {handleSubmit}
        />
    );
}