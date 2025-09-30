import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logof.png";
import profile from "../../assets/user.png";
import bag from "../../assets/shoppingBag.png";
import menu from "../../assets/menu.png";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  // const [cartCount, setCartCount] = useState<number>(0);

  return (
    <nav className="navbar">
      <div className="logoContainer" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="logo" />
      </div>

      <div className="nav-links-container">
        <ul className="nav-links">
          <li><Link to="/boys">Boys</Link></li>
          <li><Link to="/girls">Girls</Link></li>
          <li><Link to="/kids">Kids</Link></li>
        </ul>
      </div>

      <div className="nav-links-container">
        <ul className="nav-links">
          <li><Link to="/profile"><img src={profile} alt="profile" className="profile" /></Link></li>
          <li>
            <Link to="/cart" className="cart-link">
              <div className="cart-icon-container">
                <img src={bag} alt="cart" className="cart" />
                <span className="cart-count">{0}</span>
              </div>
            </Link>
          </li>
          <li><img src={menu} alt="menu" className="menu" /></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
