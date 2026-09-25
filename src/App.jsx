import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Comics from "./pages/Comics";
import Search from "./pages/Search";
import ComicDetail from "./pages/ComicDetail";
import RentalCart from "./pages/RentalCart";
import Checkout from "./pages/Checkout";
import MyRentals from "./pages/MyRentals";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="comics" element={<Comics />} />
        <Route path="search" element={<Search />} />
        <Route path="comic/:id" element={<ComicDetail />} />
        <Route path="rental-cart" element={<RentalCart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="my-rentals" element={<MyRentals />} />
        <Route path="auth" element={<Auth />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
