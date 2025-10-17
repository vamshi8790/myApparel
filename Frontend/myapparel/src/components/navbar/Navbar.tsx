import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logof.png";
import profile from "../../assets/user.png";
import bag from "../../assets/shoppingBag.png";
import menu from "../../assets/menu.png";
import close from "../../assets/close.png";
import { jwtService } from "../../services/service";
// import { API_ROUTES } from "../../API/api";


const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 780);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null);

  const isAdmin = userRole === "admin";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 780);
      if (window.innerWidth > 780) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loggedIn = jwtService.isLoggedIn();
    const role = jwtService.getRole();
    setIsLoggedIn(loggedIn);
    setUserRole(role);
  }, [location.pathname]);

  const handleLogout = () => {
    jwtService.removeToken();
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/auth");
  };

  const renderDesktopLinks = () => {
    return (
      <>
        <ul className="nav-links nav-links-left">
          <li>
            <NavLink
              to="/boys"
              className={({ isActive }) => (isActive ? "active-link" : undefined)}
            >
              Boys
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/girls"
              className={({ isActive }) => (isActive ? "active-link" : undefined)}
            >
              Girls
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/kids"
              className={({ isActive }) => (isActive ? "active-link" : undefined)}
            >
              Kids
            </NavLink>
          </li>
        </ul>

        <div className="right-section-desktop">
          {!isLoggedIn ? (
            <NavLink to="/auth" className="auth-link">
              Login
            </NavLink>
          ) : isAdmin ? (
            <>
              <NavLink
                to="/admin"
                className={({ isActive }) => (isActive ? "active-link" : undefined)}
              style={{color:"black", textDecoration:"none"}}>
                Dash Board
              </NavLink>
              <span className="auth-link" onClick={handleLogout}>
                Logout
              </span>
            </>
          ) : (
            <>
              <div className="cart-orders-group-desktop">
                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    isActive ? "cart-link active-link" : "cart-link"
                  }
                >
                  <div className="cart-icon-container">
                    <img src={bag} alt="cart" className="cart" />
                    <span className="cart-count">{0}</span>
                  </div>
                </NavLink>
                <NavLink style={{color:"black", textDecoration:"none"}}
                  to="/cart#orders"
                  className={() =>
                    location.pathname === "/cart" && location.hash === "#orders"
                      ? "active-link"
                      : undefined}>My Orders
                </NavLink>
              </div>
              
              <NavLink to="/profile">
                <img src={profile} alt="profile" className="profile" />
              </NavLink>
              <span className="auth-link" onClick={handleLogout}>
                Logout
              </span>
            </>
          )}
        </div>
      </>
    );
  };

  const renderMobileLinks = () => {
    return (
      <>
        {["Boys", "Girls", "Kids"].map((category) => (
          <li key={category} className="mobile-menu-item">
            <NavLink
              to={`/${category.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
            >
              {category}
            </NavLink>
          </li>
        ))}

        {!isLoggedIn ? (
          <li className="login-logout-group">
            <NavLink
              to="/auth"
              onClick={() => setMenuOpen(false)}
              className="mobile-link"
            >
              <span>Login</span>
            </NavLink>
          </li>
        ) : isAdmin ? (<>
          <li className="mobile-menu-item">
            <NavLink
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="mobile-link"
            >
              <span>Dash Board</span>
            </NavLink>
          </li>
          <li className="login-logout-group">
        <span
          onClick={() => {
            handleLogout();
            setMenuOpen(false);
          }}
        >
          Logout
        </span>
      </li>
          
       </> ) : (
          <>
            <li className="mobile-menu-item">
              <NavLink
                to="/cart"
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
                to="/cart#orders"
                onClick={() => setMenuOpen(false)}
                className="mobile-link"
              >
                <span>My Orders</span>
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
            <li className="login-logout-group">
              <span
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </span>
            </li>
          </>
        )}
      </>
    );
  };

  return (
    <nav className="navbar">
      <div className="logoContainer" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="logo" />
      </div>

      {!isMobile && (
        <>{renderDesktopLinks()}</>
      )}

      {isMobile && (
        <div className="mobile-menu-toggle">
          <img
            src={menuOpen ? close : menu}
            alt="menu-toggle"
            className="menu"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>
      )}

      {isMobile && menuOpen && (
        <div className="mobile-menu">
          <ul>{renderMobileLinks()}</ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;