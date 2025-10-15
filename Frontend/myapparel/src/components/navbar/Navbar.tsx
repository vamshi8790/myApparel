import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logof.png";
import profile from "../../assets/user.png";
import bag from "../../assets/shoppingBag.png";
import menu from "../../assets/menu.png";
import close from "../../assets/close.png";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
      if (window.innerWidth > 600) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="navbar">
      <div className="logoContainer" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="logo" />
      </div>

      {!isMobile && (
        <div className="nav-links-container">
          <ul className="nav-links">
            <li>
              <NavLink
                to="/boys"
                className={({ isActive }) =>
                  isActive ? "active-link" : undefined
                }
              >
                Boys
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/girls"
                className={({ isActive }) =>
                  isActive ? "active-link" : undefined
                }
              >
                Girls
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/kids"
                className={({ isActive }) =>
                  isActive ? "active-link" : undefined
                }
              >
                Kids
              </NavLink>
            </li>
          </ul>
        </div>
      )}

      <div className="nav-links-container right-section">
        <ul className="nav-links">
          {!isMobile && (
            <>
              <li>
                <NavLink to="/profile">
                  <img src={profile} alt="profile" className="profile" />
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/cart"
                  className={({ isActive }) => {
                    const isCartActive =
                      isActive && location.hash !== "#orders";
                    return isCartActive ? "cart-link active-link" : "cart-link";
                  }}
                >
                  <div className="cart-icon-container">
                    <img src={bag} alt="cart" className="cart" />
                    <span className="cart-count">{0}</span>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/cart#orders"
                  className={() => {
                    const isOrdersActive =
                      location.pathname === "/cart" &&
                      location.hash === "#orders";
                    return isOrdersActive ? "active-link" : undefined;
                  }}
                >
                  My Orders
                </NavLink>
              </li>
              <li>
                <NavLink to="/auth" className="auth-link">
                  Login
                </NavLink>
              </li>
              <li>
                <span
                  className="auth-link"
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/auth");
                  }}
                >
                  Logout
                </span>
              </li>
            </>
          )}

          {isMobile && (
            <li>
              <img
                src={menuOpen ? close : menu}
                alt="menu-toggle"
                className="menu"
                onClick={() => setMenuOpen(!menuOpen)}
              />
            </li>
          )}
        </ul>
      </div>

      {isMobile && menuOpen && (
        <div className="mobile-menu">
          <ul>
            {["Boys", "Girls", "Kids"].map((category) => (
              <li key={category} className="mobile-menu-item">
                <NavLink
                  to={`/${category.toLowerCase()}`}
                  className={({ isActive }) =>
                    isActive ? "active-link" : undefined
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {category}
                </NavLink>
              </li>
            ))}

            <li className="mobile-menu-item">
              <NavLink
                to="/cart#cart"
                onClick={() => setMenuOpen(false)}
                className="mobile-link"
              >
                <span>My Bag</span>
                <div className="cart-icon-container">
                  <img src={bag} alt="cart" className="cart" />
                  <span className="cart-count">{0}</span>
                </div>
              </NavLink>
            </li>

            <li className="mobile-menu-item profile-orders-group">
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="mobile-link"
              >
                <span>My Profile</span>
                <img src={profile} alt="profile" className="profile" />
              </NavLink>
            </li>
            <li className="mobile-menu-item profile-orders-group">
              <NavLink
                to="/cart#orders"
                onClick={() => setMenuOpen(false)}
                className="mobile-link"
              >
                <span>My Orders</span>
              </NavLink>
            </li>
            <li className="login-logout-group">
              <NavLink
                to="/auth"
                onClick={() => setMenuOpen(false)}
                className="mobile-link"
              >
                <span>Login</span>
              </NavLink>
            </li>
            <li className="login-logout-group">
              <span
                onClick={() => {
                  localStorage.removeItem("token");
                  setMenuOpen(false);
                  navigate("/auth");
                }}
              >
                Logout
              </span>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;