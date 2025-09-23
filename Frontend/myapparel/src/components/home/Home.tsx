import "./Home.css";
import bgImg from "../../assets/landing-page.png";

function Home() {
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
    </>
  );
}

export default Home;
