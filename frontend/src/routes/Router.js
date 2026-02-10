import Navbar from "../components/header_footer/NavBar";
import Footer from "../components/header_footer/Footer";
import { Routes, Route } from "react-router-dom";
import CategoryPage from "../components/pages/category_page/CategoryPage";
import HomeView from "../views/HomeView";
import Categories from "../components/hero_others/Categories";
import Restaurants from "../components/hero_others/Restaurants";
import Offers from "../views/OffersView";
import ContactUsView from "../views/ContactUsView";
import LoginView from "../views/LoginView";
import DashboardView from "../views/DashboardView";
import OfferDetails from "../components/pages/offer_details/OfferDetails";
import CartView from "../views/CartView";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/offers/:id" element={<OfferDetails />} />
        <Route path="/contact" element={<ContactUsView />} />
        <Route path="/cart" element={<CartView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/dashboard" element={<DashboardView />} />
      </Routes>
      <Footer />
    </>
  );
}
