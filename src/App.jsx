import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import MainComp from "./Components/MainComp";
import Users from "./Pages/Users";
import UserListPage from "./Pages/UserListPage";
import ActiveSessions from "./Pages/ActiveSessions";
import History from "./Pages/History";
import GroupsData from "./NavbarPages/GroupsData";
import Organization from "./NavbarPages/Organization";
import MfaPage from "./Pages/MfaPage";
import Connections from "./NavbarPages/Connections";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="*" element={<LoginPage />} />
        <Route path="/mfa-verify/:userId" element={<MfaPage />} />

        {/* Other Routes */}
        <Route path="/home-page" element={<MainComp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/Users" element={<UserListPage />} />

        {/* Corrected Route for /create-user */}
        <Route path="/create-user" element={<Users />} />
        <Route path="/Active-Sessions" element={<ActiveSessions/>} />
        <Route path="/History" element={<History/>} />
        <Route path="/Groups" element={<GroupsData/>} />
        <Route path="/Organization" element={<Organization/>} />
        <Route path="/Connections" element={<Connections/>} />

        <Route
          path="/reset-password/:id/:token"
          element={<ResetPasswordPage />}
        />
      </Routes>
    </Router>
  );
};

export default App;
