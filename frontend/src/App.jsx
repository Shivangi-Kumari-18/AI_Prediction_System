// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Dashboard from "./Components/pages/Dashboards/Dashboard";
import Home from "./Components/pages/Homes/Home";
import Features from "./Components/pages/Feature/Features";
import About from "./Components/pages/Abouts/About";
import Contact from "./Components/pages/Contacts/Contact";
import Login from "./Components/pages/Authentication/Login";
import SignUp from "./Components/pages/Authentication/SignUp";
import ForgotPassword from "./Components/pages/Authentication/ForgotPassword";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./context/PrivateRoute";
import Footer from "./Components/pages/Footers/Footer";
import LoginOptions from "./Components/pages/Authentication/LoginOptions";
import AdminDashboard from "./Components/Admin/AdminDashboard/AdminDashboard";
import StudentPortal from "./Components/StudentPortal/StudentDashboard/StudentDashboard";


function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* default route -> Home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Public routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/loginoptions" element={<LoginOptions />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/studentportal" element={<StudentPortal/>} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            
              <Dashboard />
            
          }
        />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;
