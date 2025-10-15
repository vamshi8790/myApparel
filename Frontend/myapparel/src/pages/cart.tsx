import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./pages.css";

interface CartItem {
  productId: number;
  quantity: number;
}

interface CartData {
  id: number;
  userId: number;
  date: string;
  products: CartItem[];
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"cart" | "orders">("cart");
  const [carts, setCarts] = useState<CartData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch carts and all products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartsRes = await fetch("https://fakestoreapi.com/carts");
        if (!cartsRes.ok) throw new Error("Failed to fetch carts");
        const cartsData: CartData[] = await cartsRes.json();
        setCarts(cartsData);

        const productsRes = await fetch("https://fakestoreapi.com/products");
        if (!productsRes.ok) throw new Error("Failed to fetch products");
        const productsData: Product[] = await productsRes.json();
        setProducts(productsData);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Set active tab based on URL hash
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    const path = location.pathname;
    if (path === "/orders" || hash === "orders") {
      setActiveTab("orders");
    } else {
      setActiveTab("cart");
    }
  }, [location.hash, location.pathname]);

  const handleTabChange = (tab: "cart" | "orders") => {
    setActiveTab(tab);
    navigate(`/cart#${tab}`, { replace: true });
  };

  const getProductDetails = (productId: number) => {
    return products.find((p) => p.id === productId);
  };

  const renderCartCard = (cart: CartData) => (
    <div key={cart.id} className="cart-card">
      <p>
        <strong>User ID:</strong> {cart.userId} | <strong>Date:</strong>{" "}
        {new Date(cart.date).toLocaleDateString()}
      </p>
      <ul>
        {cart.products.map((item) => {
          const product = getProductDetails(item.productId);
          return (
            <li key={item.productId}>
              {product ? (
                <>
                  {product.title} - ${product.price} × {item.quantity}
                </>
              ) : (
                <>Product ID: {item.productId} - Quantity: {item.quantity}</>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <section className="cart-page">
      <div className="cart-layout">
        <button
          className={`cart-tab ${activeTab === "cart" ? "active" : ""}`}
          onClick={() => handleTabChange("cart")}
        >
          Cart
        </button>
        <button
          className={`cart-tab ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => handleTabChange("orders")}
        >
          Orders
        </button>
      </div>

      <div className="cart-content">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : carts.length === 0 ? (
          <p>No carts/orders available.</p>
        ) : activeTab === "cart" ? (
          <div className="cart-section">
            <h3>🛒 Cart Items</h3>
            {carts.map(renderCartCard)}
          </div>
        ) : (
          <div className="orders-section">
            <h3>📦 Order History</h3>
            {carts.map(renderCartCard)}
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
