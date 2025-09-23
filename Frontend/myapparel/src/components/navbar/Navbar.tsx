import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo2.png";
import profile from "../../assets/user.png";
import bag from "../../assets/shoppingBag.png";
import menu from "../../assets/menu.png"
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logoContainer" onClick={() => navigate("/")}>
        <img src={logo} alt="logo" className="logo" />
      </div>

      <div className="nav-links-container">
        <ul className="nav-links">
          <li><Link to="/"><h3>Boys</h3></Link></li>
          <li><Link to="/about"><h3>Girls</h3></Link></li>
          <li><Link to="/profile"><h3>Kids</h3></Link></li>
        </ul>
      </div>

      <div className="nav-links-container">
        <ul className="nav-links">
          <li><Link to="/profile"><img src={profile} alt="profile" className="profile" /></Link></li>
          <li><Link to="/profile"><img src={bag} alt="cart" className="cart" /></Link></li>
          <li><Link to="/profile"><img src={menu} alt="menu" className="menu" /></Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
