import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { API_ROUTES } from "../API/api";
import "./pages.css";
import { jwtService } from "../services/service";

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


function isAxiosErrorType(error: any): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}



const ProductPage: React.FC<ProductPageProps> = ({ category, pageTitle }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [productQuantity, setProductQuantity] = useState<{ [key: string]: number }>({});


  const token = jwtService.getToken();
  const payload = jwtService.getPayload();
  const currentUserId = payload?.sub;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
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
        if (isAxiosErrorType(error)) {
          console.error("Error fetching products:", error.message, error.response?.data);
          if (error.response && error.response.status === 401) {
            alert("Session expired or unauthorized. Please log in again.");
          }
        } else {
          console.error("Unexpected error:", error);
          alert("An unexpected error occurred while fetching products.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, token]);

  const increment = (id: string) =>
    setProductQuantity((prev) => ({ ...prev, [id]: Math.min(prev[id] + 1, 3) }));

  const decrement = (id: string) =>
    setProductQuantity((prev) => ({ ...prev, [id]: Math.max(prev[id] - 1, 1) }));

  const handleAddToCart = async (product: Product) => {
    if (!currentUserId || !token) {
      alert("You must be logged in to add items to the cart.");
      return;
    }

    try {
      const payloadData = {
        user_id: currentUserId,
        product_id: product.id,
        quantity: productQuantity[product.id],
      };

      const response = await axios.post(API_ROUTES.ADD_TO_CART, payloadData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 201) {
        alert(`${product.product_name} added to cart!`);
      } else {
        alert("Failed to add product to cart");
      }
    } catch (error) {
      if (isAxiosErrorType(error)) {
        console.error("Error adding to cart:", error.message, error.response?.data);
        const errorData = error.response?.data as { detail?: string } | undefined;
        alert(`Failed to add product: ${errorData?.detail || "Please try again."}`);
      } else {
        console.error("Unexpected error:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  if (loading) return <p className="loading-text">Loading products...</p>;

  return (
    <section className="product-page">
      <h1 className="page-heading">{pageTitle}</h1>
      <div className="products-grid">
        {products.length === 0 ? (
          <p className="no-products-text">No products found in the {category} category.</p>
        ) : (
          products.map((item) => (
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
                <button
                  onClick={() => decrement(item.id)}
                  disabled={productQuantity[item.id] <= 1}
                >
                  -
                </button>
                <span>{productQuantity[item.id]}</span>
                <button
                  onClick={() => increment(item.id)}
                  disabled={productQuantity[item.id] >= 3}
                >
                  +
                </button>
              </div>

              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(item)}
                disabled={!currentUserId}
              >
                {currentUserId ? "Add to Cart" : "Login to Add"}
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ProductPage;
