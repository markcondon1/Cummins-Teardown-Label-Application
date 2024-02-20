import App from "./App";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import FirstFit from "./pages/FirstFit";
import Login from "./pages/Login";
import Reman from "./pages/Reman";
import TeardownTray from "./pages/TeardownTray";
import Dashboard from "./pages/Dashboard";
import useNavigate from "react-router-dom";
import {Router} from "express";
export default function appRoutes(){


    const navigate = useNavigate();
    return(
        <Router>
        <Routes>
            <Route exact path="/" element={<Login/>}/>
            <Route exact path="/app" element={<App/>}/>
            <Route extact path="/app/home" element={<Dasboard/>}/>
            <Route exact path="/app/firstFit" element={<FirstFit/>}/>
            <Route exact path="/app/Reman" element={<Reman/>}/>
            <Route exact path="/app/teardownTray" element={<TeardownTray/>}/>
        </Routes>
        </Router>
    )

}