import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import People from "./pages/People.jsx";
import Topics from "./pages/Topics.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PersonDetail from "./pages/PersonDetail.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element = {<Layout />}>
          <Route path = "/" element = {<Navigate to="/dashboard" replace />}/>
          <Route path = "/login" element = {<Login />}/>
          <Route path = "/register" element = {<Register />}/>
          <Route path = "/dashboard" element = {<RequireAuth><Dashboard /></RequireAuth>}/>
          <Route path = "/people" element = {<RequireAuth><People /></RequireAuth>}/>
          <Route path = "/people/:id" element = {<RequireAuth><PersonDetail /></RequireAuth>}/>
          <Route path = "/topics" element = {<RequireAuth><Topics /></RequireAuth>}/>
          <Route path = "*" element = {<div>Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}