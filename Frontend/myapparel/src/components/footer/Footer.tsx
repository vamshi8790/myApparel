import "./Footer.css";
import footerlogo from "../../assets/logof.png";
import facebook from "../../assets/facebook.png";
import instagram from "../../assets/instagram.png";
import whatsapp from "../../assets/whatsapp.png"; 


function Footer() {
  return (
    <footer className="footer">
          <img src={footerlogo} alt="Logo"  className="footer-logo"/>
          <div className="footer-content">
            <p className="footer-text">© {new Date().getFullYear()} MyApparel. All rights reserved.</p>
            <div className="social-icons">
              <img src={facebook} alt="Logo"  className="social-icon"/>
              <img src={instagram} alt="Logo"  className="social-icon"/>
              <img src={whatsapp} alt="Logo"  className="social-icon"/>
            </div>
          </div>

    </footer>
  );
}

export default Footer;
