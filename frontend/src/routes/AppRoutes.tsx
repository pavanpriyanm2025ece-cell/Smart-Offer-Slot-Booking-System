import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import Login from "../pages/admin/Login";
import Offers from "../pages/admin/Offers";
import CreateOffer from "../pages/admin/Createoffer";
import Bookings from "../pages/admin/Bookings";
import Confirmation from "../pages/public/Confirmation";
import Home from "../pages/public/Home";
import OfferDetail from "../pages/public/OfferDetail";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/admin/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/offers"
          element={
            <ProtectedRoute>
              <Offers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-offer"
          element={
            <ProtectedRoute>
              <CreateOffer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />

        <Route path="/offer/:id" element={<OfferDetail />} />
        <Route path="/offers/:id" element={<OfferDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

