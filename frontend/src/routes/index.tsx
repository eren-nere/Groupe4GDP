import {  Routes, Route } from "react-router";
import App from "../App";
import LoginPage from "../pages/login";
import SignUpPage from "@pages/sign-up";

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<App />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="sign-up" element={<SignUpPage />} />
    </Routes>
  )
}

export default AppRoutes;