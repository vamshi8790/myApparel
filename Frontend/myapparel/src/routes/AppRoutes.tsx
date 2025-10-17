import { Routes, Route } from "react-router-dom";
import Home from "../components/home/Home";
import Profile from "../pages/profile";
import Cart from "../pages/cart";
import PageNotFound from "../pages/pageNotFound";
import Kids from "../pages/kids";
import Girls from "../pages/girls";
import Boys from "../pages/boys";
import AuthPage from "../pages/AuthPage";
import Admin from "../components/admin/Admin";
import ProtectedRoute from "../routes/ProtectedRoutes"; 

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/kids" element={<Kids />} />
      <Route path="/girls" element={<Girls />} />
      <Route path="/boys" element={<Boys />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<Admin />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default AppRoutes;