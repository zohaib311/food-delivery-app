import Navbar from "../components/header_footer/NavBar";
import Footer from "../components/header_footer/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
import CategoryPage from "../components/pages/category_page/CategoryPage";
import HomeView from "../views/HomeView";
import Categories from "../components/hero_others/Categories";
import Restaurants from "../components/hero_others/Restaurants";
import Offers from "../views/OffersView";
import ContactUsView from "../views/ContactUsView";
import LoginView from "../views/LoginView";
import DashboardView from "../views/DashboardView";
import OfferDetails from "../components/pages/offer_details/OfferDetails";
import CartView from "../views/customer/CartView";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../views/admin/AdminDashboard";
import AdminUsers from "../views/admin/AdminUsers";
import AdminItems from "../views/admin/AdminItems";
import Checkout from "../components/pages/checkout/Checkout";
import OrdersView from "../views/customer/OrdersView";

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname === '/login';

  return (
    <>
      {!isAdminRoute && !isLoginRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/home" element={<HomeView />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/offers/:id" element={<OfferDetails />} />
        <Route path="/contact" element={<ContactUsView />} />
        <Route path="/cart" element={<CartView />} />
        <Route path="/checkout" element={<ProtectedRoute requiredRole="customer"><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute requiredRole="customer"><OrdersView /></ProtectedRoute>} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/dashboard" element={<DashboardView />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/items"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminItems />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!isAdminRoute && !isLoginRoute && <Footer />}
    </>
  );
}
