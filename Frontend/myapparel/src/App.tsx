import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./components/home/Home";
import About from "./components/about/About";
// import Cart from "./components/cart/Cart";
// import Profile from "./components/profile/Profile";
// import PageNotFound from "./components/pagenotfound/PageNotFound";



function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
