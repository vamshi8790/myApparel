import "./Home.css";
import bgImg from "../../assets/landing-page.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import kid1 from "../../assets/kid1.png";
import kid2 from "../../assets/kid2.png";
import kid3 from "../../assets/kid3.png";
import boy1 from "../../assets/boy1.png";
import boy2 from "../../assets/boy2.png";
import boy3 from "../../assets/boy3.png";
import girl1 from "../../assets/girl1.png";
import girl2 from "../../assets/girl2.png";
import girl3 from "../../assets/girl3.png";

type Slide = { img: string; text: string };

const Carousel = ({ slides }: { slides: Slide[] }) => {
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
        <div key={index} className={`item ${index === current ? "active" : ""}`}>
          <img src={slide.img} alt={slide.text} className="slide-image" />
        </div>
      ))}
    </div>
  );
};

function Home() {
  const navigate = useNavigate();
  const categories = [
    {
      name: "Boys",
      path: "/boys",
      slides: [
        { img: boy1, text: "Boys 1" },
        { img: boy2, text: "Boys 2" },
        { img: boy3, text: "Boys 3" },
      ],
    },
    {
      name: "Girls",
      path: "/girls",
      slides: [
        { img: girl1, text: "Girls 1" },
        { img: girl2, text: "Girls 2" },
        { img: girl3, text: "Girls 3" },
      ],
    },
    {
      name: "Kids",
      path: "/kids",
      slides: [
        { img: kid1, text: "Kids 1" },
        { img: kid2, text: "Kids 2" },
        { img: kid3, text: "Kids 3" },
      ],
    },
  ];

  const handleCategoryClick = (path: string) => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(path);
    } else {
      navigate("/auth");
    }
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
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="apparels-link"
              onClick={() => handleCategoryClick(cat.path)}
            >
              <div className="apparels-container">
                <Carousel slides={cat.slides} />
                <h2 className="carousel-category">{cat.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;
