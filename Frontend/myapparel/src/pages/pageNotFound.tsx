import React from "react";
import { useNavigate } from "react-router-dom";
import "./pages.css";
import pageNotFound from "../assets/pagenotfound.gif";

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="page-notfound">
      <div className="page-notfound-container">
        <img
          src={pageNotFound}
          alt="Page Not Found"
          className="page-notfound-gif"
        />
        <button
          className="home-btn"
          onClick={() => navigate("/")}
        >
          Go to Home
        </button>
      </div>
    </section>
  );
};

export default PageNotFound;
