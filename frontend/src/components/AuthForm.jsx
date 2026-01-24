export default function AuthForm({title, submitLabel, email, setEmail, password, setPassword, passwordAutoComplete, error, submitting, onSubmit}) {
    return (
        <div className = "max-w-md">
            <h1 className = "text-2xl font-bold mb-4">{title}</h1>

            <form onSubmit = {onSubmit} className = "space-y-3">
                <div>
                    <label className = "block text-sm mb-1">Email</label>
                    <input 
                        type = "email"
                        className = "w-full border rounded-xl px-3 py-2"
                        value = {email}
                        onChange = {(e) => setEmail(e.target.value)}
                        autoComplete = "email"
                        required
                    />
                </div>

                <div>
                    <label className = "block text-sm mb-1">Password</label>
                    <input 
                        className = "w-full border rounded-xl px-3 py-2"
                        type = "password"
                        value = {password}
                        onChange = {(e) => setPassword(e.target.value)}
                        autoComplete = {passwordAutoComplete}
                        required
                    />
                </div>

                {error && <div className = "text-red-600 text-sm">{error}</div>}

                <button disabled = {submitting} className = "px-4 py-2 rounded bg-black text-white">{submitLabel}</button>
            </form>
        </div>
    )
}