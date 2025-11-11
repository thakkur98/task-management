import {Routes, Route} from "react-router-dom";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/Signup/Signup";

const Navigation = () => {
    return (
        <Routes>
            <Route path="" element={<Dashboard/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>           
        </Routes>
    )
}

export default Navigation;