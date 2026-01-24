import {useState} from "react";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {useToast} from "../context/ToastContext.jsx";
import {getErrorMessage} from "../utils/api.js";
import AuthForm from "../components/AuthForm.jsx";

export default function Register() {
    const {register} = useAuth();
    const [email, setEmail] = useState("demo@example.com");
    const [password, setPassword] = useState("password123")
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const {pushToast} = useToast();
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await register(email, password);
            navigate("/dashboard", {replace: true});
        } catch (error) {
            const message = getErrorMessage(error);
            setError(message);
            pushToast({type: "error", message});
        } finally {
            setSubmitting(false);
        }
    }

    return (
         <AuthForm 
            title = "Register"
            submitLabel = "Create Account"
            email = {email}
            setEmail = {setEmail}
            password = {password}
            setPassword = {setPassword}
            passwordAutoComplete = "new-password"
            error = {error}
            submitting = {submitting}
            onSubmit = {handleSubmit}
        />
    );
}