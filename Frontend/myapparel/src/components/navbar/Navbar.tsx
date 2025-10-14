import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logof.png";
import profile from "../../assets/user.png";
import bag from "../../assets/shoppingBag.png";
import menu from "../../assets/menu.png";
import close from "../../assets/close.png";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
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
              <Link to="/boys">Boys</Link>
            </li>
            <li>
              <Link to="/girls">Girls</Link>
            </li>
            <li>
              <Link to="/kids">Kids</Link>
            </li>
          </ul>
        </div>
      )}

      <div className="nav-links-container">
        <ul className="nav-links">
          {!isMobile && (
            <>
              <li>
                <Link to="/profile">
                  <img src={profile} alt="profile" className="profile" />
                </Link>
              </li>
              <li>
                <Link to="/cart" className="cart-link">
                  <div className="cart-icon-container">
                    <img src={bag} alt="cart" className="cart" />
                    <span className="cart-count">{0}</span>
                  </div>
                </Link>
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
                <Link
                  to={`/${category.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {category}
                </Link>
              </li>
            ))}

            <li className="mobile-menu-item">
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="mobile-link"
              >
                <span>My Bag</span>
                <div className="cart-icon-container">
                  <img src={bag} alt="cart" className="cart" />
                  <span className="cart-count">{0}</span>
                </div>
              </Link>
            </li>

            <li className="mobile-menu-item">
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="mobile-link"
              >
                <span>My Profile</span>
                <img src={profile} alt="profile" className="profile" />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
