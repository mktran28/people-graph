import {useState} from "react";
import {useAuth} from "./context/AuthContext";

export default function App() {
  const {user, loading, login, logout} = useAuth();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className = "min-h-screen p-6 max-w-md mx-auto">
      <h1 className = "text-2xl font-bold mb-4">PeopleGraph</h1>

      {user ? (
        <div className = "space-y-3">
          <div className = "p-4 rounded border">
            <div className = "font-semibold">Logged in as</div>
            <div>{user.email}</div>
          </div>
          <button onClick={logout} className = "px-4 py-2 bg-black rounded text-white">Logout</button>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className = "block text-sm mb-1">Email</label>
            <input
              className = "w-full px-3 py-2 border rounded"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)}
              autoComplete = "email"
            />
          </div>

          <div>
            <label className = "block text-sm mb-1">Password</label>
            <input 
              className = "w-full px-3 py-2 border rounded"
              type = "password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
              autoComplete = "current-password"
            />
          </div>

          {error && <div>{error}</div>}

          <button className = "px-4 py-2 bg-black rounded text-white">
            Login
          </button>
        </form>
      )}
    </div>
  );
}