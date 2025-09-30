import "./Home.css";
import bgImg from "../../assets/landing-page.png";
import { useState, useEffect } from "react";
import kid1 from "../../assets/kid1.png";
import kid2 from "../../assets/kid2.png";
import kid3 from "../../assets/kid3.png";
import boy1 from "../../assets/boy1.png";
import boy2 from "../../assets/boy2.png";
import boy3 from "../../assets/boy3.png";
import girl1 from "../../assets/girl1.png";
import girl2 from "../../assets/girl2.png";
import girl3 from "../../assets/girl3.png";
import { Link } from "react-router-dom";

function Home() {
  const kidsSlides = [
    { img: kid1, text: "Kids 1" },
    { img: kid2, text: "Kids 2" },
    { img: kid3, text: "Kids 3" },
  ];

  const boysSlides = [
    { img: boy1, text: "Boys 1" },
    { img: boy2, text: "Boys 2" },
    { img: boy3, text: "Boys 3" },
  ];

  const girlsSlides = [
    { img: girl1, text: "Girls 1" },
    { img: girl2, text: "Girls 2" },
    { img: girl3, text: "Girls 3" },
  ];

  const Carousel = ({ slides }: { slides: { img: string; text: string }[] }) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 2000);
      return () => clearInterval(interval);
    }, [slides.length]);

    return (
      <div className="apparels-carousel">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`item ${index === current ? "active" : ""}`}
          >
            <img src={slide.img} alt={slide.text} className="slide-image" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <section className="home-container">
        <div className="home-image">
          <img src={bgImg} alt="Landing" className="landing-img" />
        </div>
        <div className="home-text">
          <h1 className="home-heading">Every outfit tells a story...</h1>
        </div>
      </section>

      <section className="shop-container">
        <h1 className="shop-heading">Shop With us...</h1>
        <div className="apparels">
          <Link to="/boys" className="apparels-link">
            <div className="apparels-container">
              <Carousel slides={boysSlides} />
              <h2 className="carousel-category">Boys</h2>
            </div>
          </Link>

          <Link to="/girls" className="apparels-link">
            <div className="apparels-container">
              <Carousel slides={girlsSlides} />
              <h2 className="carousel-category">Girls</h2>
            </div>
          </Link>

          <Link to="/kids" className="apparels-link">
            <div className="apparels-container">
              <Carousel slides={kidsSlides} />
              <h2 className="carousel-category">Kids</h2>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;
