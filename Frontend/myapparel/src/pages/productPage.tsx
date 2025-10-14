import React, { useEffect, useState } from "react";
import "./pages.css";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
}

interface ProductPageProps {
  category: string;
  pageTitle: string;
}

const ProductPage: React.FC<ProductPageProps> = ({ category, pageTitle }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [productQuantity, setProductQuantity] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        const filtered = data.filter((item: Product) => item.category === category);
        setProducts(filtered);

        const initialQuantity: { [key: number]: number } = {};
        filtered.forEach((item) => {
          initialQuantity[item.id] = 1;
        });
        setProductQuantity(initialQuantity);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [category]);

  const increment = (id: number) =>
    setProductQuantity((prev) => ({ ...prev, [id]: Math.min(prev[id] + 1, 3) }));

  const decrement = (id: number) =>
    setProductQuantity((prev) => ({ ...prev, [id]: Math.max(prev[id] - 1, 1) }));

  if (loading) return <p className="loading-text">Loading products...</p>;

  return (
    <section className="product-page">
      <h1 className="page-heading">{pageTitle}</h1>
      <div className="products-grid">
        {products.map((item) => (
          <div className="product-card" key={item.id}>
            <div className="product-image-wrapper">
              <img
                src={item.image}
                alt={item.title}
                className="product-image"
              />
            </div>
            <h3 className="product-title">{item.title}</h3>
            <p className="product-price">${item.price}</p>

            <div className="quantity-selector">
              <button onClick={() => decrement(item.id)}>-</button>
              <span>{productQuantity[item.id]}</span>
              <button onClick={() => increment(item.id)}>+</button>
            </div>

            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductPage;
