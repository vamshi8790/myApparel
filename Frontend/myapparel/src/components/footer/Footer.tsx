import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">© {new Date().getFullYear()} MyApparel. All rights reserved.</div>
    </footer>
  );
}

export default Footer;
