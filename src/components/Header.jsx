import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BookOpen, ShoppingBag, Menu, X, UserRound } from "lucide-react";
import SearchBar from "./SearchBar";
import { useRental } from "../context/RentalContext";
import { useUser } from "../context/UserContext";
export default function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useRental();
  const { user } = useUser();
  const location = useLocation();
  useEffect(() => setOpen(false), [location]);
  return (
    <>
      <div className="announcement">
        Một cuốn truyện hay. Một khoảng thời gian cho mình.{" "}
        <span>Đặt online · Nhận tại cửa hàng</span>
      </div>
      <header className="header">
        <div className="container header-main">
          <Link to="/" className="logo" aria-label="StoryRent trang chủ">
            <span className="logo-icon">
              <BookOpen size={24} />
            </span>
            story<span>rent</span>
            <i>®</i>
          </Link>
          <SearchBar />
          <div className="header-actions">
            <Link className="account-link" to={user ? "/profile" : "/auth"}>
              <UserRound size={20} />
              <span>{user ? user.name.split(" ").at(-1) : "Đăng nhập"}</span>
            </Link>
            <Link
              className="cart-link"
              to="/rental-cart"
              aria-label={`Giỏ thuê, ${count} cuốn`}
            >
              <ShoppingBag size={21} />
              <span className="cart-count">{count}</span>
            </Link>
            <button
              className="icon-button menu-toggle"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Đóng menu" : "Mở menu"}
              aria-expanded={open}
              aria-controls="main-nav"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <nav
          id="main-nav"
          aria-label="Điều hướng chính"
          className={`container nav ${open ? "is-open" : ""}`}
        >
          <NavLink to="/" end>
            Trang chủ
          </NavLink>
          <Link
            className={
              location.pathname === "/comics" &&
              !location.search.includes("sort=")
                ? "active"
                : ""
            }
            to="/comics"
          >
            Tủ truyện
          </Link>
          <Link
            className={
              location.pathname === "/comics" &&
              location.search.includes("sort=popular")
                ? "active"
                : ""
            }
            to="/comics?sort=popular"
          >
            Được yêu thích
          </Link>
          <Link
            className={
              location.pathname === "/comics" &&
              location.search.includes("sort=newest")
                ? "active"
                : ""
            }
            to="/comics?sort=newest"
          >
            Truyện mới
          </Link>
          <NavLink to="/my-rentals">Đơn thuê của tôi</NavLink>
          <span className="nav-note">
            <span className="status-dot" /> Mở cửa 08:00 – 21:00
          </span>
        </nav>
      </header>
    </>
  );
}
