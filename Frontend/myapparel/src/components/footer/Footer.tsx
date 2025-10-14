import "./Footer.css";
import footerlogo from "../../assets/logof.png";
import facebook from "../../assets/facebook.png";
import instagram from "../../assets/instagram.png";
import whatsapp from "../../assets/whatsapp.png"; 

function Footer() {
  return (
    <footer className="footer">
      <img src={footerlogo} alt="Logo" className="footer-logo" />
      <p className="footer-text">© {new Date().getFullYear()} MyApparel. All rights reserved.</p>
      <div className="social-icons">
        <img src={facebook} alt="Facebook" className="social-icon" />
        <img src={instagram} alt="Instagram" className="social-icon" />
        <img src={whatsapp} alt="Whatsapp" className="social-icon" />
      </div>
    </footer>
  );
}

export default Footer;
