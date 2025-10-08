import React, { useEffect, useState } from "react";
import "./pages.css";

// Define a Product interface for typing
interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
}

function Kids() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        const kidsItems = data.filter(
          (item: Product) => item.category === "kid's clothing"
        );
        setProducts(kidsItems);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading-text">Loading products...</p>;

  return (
    <div className="kids-page">
      <h1 className="page-heading">Welcome to MyApparel Kids Page</h1>

      <div className="products-grid">
        {products.map((item: Product) => (
          <div className="product-card" key={item.id}>
            <img
              src={item.image}
              alt={item.title}
              className="product-image"
            />
            <h3 className="product-title">{item.title}</h3>
            <p className="product-price">${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Kids;
