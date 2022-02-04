import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Resources from "./views/resources/resources";
import LoginSignup from "./views/loginSignup/loginSignup";
import Home from "./views/home/Home";
import React from "react";
import requireAuth from "./components/auth/RequireAuth";
import Calendar from "./views/Calendar/calendar";
import { FetchUserInfo } from "./hooks/FetchUserInfo";
import ManagementPanel from "./views/ManagementPanel/ManagementPanel";
import Loader from "./components/loader/Loader";
export default function App() {
  let userinfo;
  userinfo = FetchUserInfo(localStorage.userId)

  return userinfo ? (
    
    <BrowserRouter>
    {
    console.log(userinfo , 'aqui app')

    }
        {requireAuth() ? (
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/resources" element={<Resources />} />
            <Route exact path="/calendar" element={<Calendar />} />
            {
              userinfo.isAdmin &&
            <Route exact path="/management" element={<ManagementPanel />} />
            }
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Routes>
            <Route exact path="/login" element={<LoginSignup />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </BrowserRouter>
  )
      :

      <>

      <Loader/>

      </>
     
 
      
  
}
