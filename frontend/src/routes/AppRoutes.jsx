import {Routes, Route} from "react-router-dom";

// Pages
import Home from "../pages/Home/index.jsx";
import Login from "../pages/Login/index.jsx";
import Signup from "../pages/Signup/index.jsx";
import Generate from "../pages/Generate/index.jsx";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path={"/"} element={<Home/>}/>
            <Route path={"/auth/login"} element={<Login/>}/>
            <Route path={"/auth/signup"} element={<Signup/>}/>
            <Route path={"/generate-deck"} element={<Generate/>}/>
        </Routes>
    )
}