import {  Routes, Route } from "react-router";
import App from "../App";
import LoginPage from "../pages/login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<App />} />
      <Route path="login" element={<LoginPage />} />
    </Routes>
  )
}

export default AppRoutes;