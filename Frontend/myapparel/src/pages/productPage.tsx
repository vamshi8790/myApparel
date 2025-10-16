import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTES } from "../API/api";
import "./pages.css";

interface Product {
  id: string;
  product_name: string;
  cost: number;
  category: string;
  image_base64?: string;
}

interface ProductPageProps {
  category: string;
  pageTitle: string;
}

const ProductPage: React.FC<ProductPageProps> = ({ category, pageTitle }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [productQuantity, setProductQuantity] = useState<{ [key: string]: number }>({});
  const [userId] = useState<string>("b35b3075-9916-4281-ac33-bb473b386cea");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_ROUTES.GET_ALL_PRODUCTS);
        const allProducts: Product[] = response.data;

        const filtered = allProducts.filter(
          (item) => item.category.toLowerCase() === category.toLowerCase()
        );

        const initialQuantity: { [key: string]: number } = {};
        filtered.forEach((item) => {
          initialQuantity[item.id] = 1;
        });

        setProducts(filtered);
        setProductQuantity(initialQuantity);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const increment = (id: string) =>
    setProductQuantity((prev) => ({ ...prev, [id]: Math.min(prev[id] + 1, 3) }));

  const decrement = (id: string) =>
    setProductQuantity((prev) => ({ ...prev, [id]: Math.max(prev[id] - 1, 1) }));

  const handleAddToCart = async (product: Product) => {
    try {
      const payload = {
        user_id: userId,
        product_id: product.id,
        quantity: productQuantity[product.id],
      };

      const response = await axios.post(API_ROUTES.ADD_TO_CART, payload);
      if (response.status === 200 || response.status === 201) {
        alert(`${product.product_name} added to cart!`);
      } else {
        alert("Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) return <p className="loading-text">Loading products...</p>;

  return (
    <section className="product-page">
      <h1 className="page-heading">{pageTitle}</h1>
      <div className="products-grid">
        {products.map((item) => (
          <div className="product-card" key={item.id}>
            <div className="product-image-wrapper">
              <img
                src={`data:image/jpeg;base64,${item.image_base64}`}
                alt={item.product_name}
                className="product-image"
              />
            </div>
            <h3 className="product-title">{item.product_name}</h3>
            <p className="product-price">₹{item.cost}</p>

            <div className="quantity-selector">
              <button onClick={() => decrement(item.id)}>-</button>
              <span>{productQuantity[item.id]}</span>
              <button onClick={() => increment(item.id)}>+</button>
            </div>

            <button
              className="add-to-cart-btn"
              onClick={() => handleAddToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductPage;
