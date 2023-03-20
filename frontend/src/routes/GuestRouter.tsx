import { Routes, Route } from "react-router-dom";
import { Login, Signup } from "../pages/guest";
// Pages

export const GuestRouter = () => {
  return (
    <Routes>
      <Route path="*" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};
