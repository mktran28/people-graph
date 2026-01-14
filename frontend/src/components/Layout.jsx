import {Link, NavLink, Outlet} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

export default function Layout() {
    const {user, logout} = useAuth();

    return (
        <div className = "min-h-screen">
            <header className = "border-b">
                <div className = "max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link to = "/" className = "font-bold text-lg">PeopleGraph</Link>
                    
                    {user ? (
                        <div className = "flex items-center gap-4">
                            <nav className = "flex gap-3 text-sm">
                                <NavLink to = "/dashboard" className = {({isActive}) => (isActive ? "font-semibold" : "opacity-70")}>Dashboard</NavLink>
                                <NavLink to = "/people" className = {({isActive}) => (isActive ? "font-semibold" : "opacity-70")}>People</NavLink>
                                <NavLink to = "/topics" className = {({isActive}) => (isActive ? "font-semibold" : "opacity-70")}>Topics</NavLink>
                            </nav>

                            <div className = "text-sm opacity-70 hidden sm:block">{user.email}</div>

                            <button onClick = {logout} className = "px-3 py-2 rounded bg-black text-white text-sm">Logout</button>
                        </div>
                    ) : (
                        <nav className = "flex gap-3 text-sm">
                            <NavLink to = "/login" className = {({isActive}) => (isActive ? "font-semibold" : "opacity-70")}>Login</NavLink>
                            <NavLink to = "/register" className = {({isActive}) => (isActive ? "font-semibold" : "opacity-70")}>Register</NavLink>
                        </nav>
                    )}
                </div>
            </header>

            <main className = "max-w-5xl mx-auto px-4 py-6">
                <Outlet />
            </main>
        </div>
    )
}