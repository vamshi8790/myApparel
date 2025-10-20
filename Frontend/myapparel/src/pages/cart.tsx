import React, { useState, useEffect } from "react";
import axios from "axios";
import type { TokenPayload } from "../services/service";
import { jwtService } from "../services/service";
import "./pages.css";
import { API_ROUTES } from "../API/api";

interface ProductDetail {
  id: string;
  category: string;
  cost: number;
  image_base64: string;
  product_name: string;
}

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  user_id: string;
  product: ProductDetail;
}

interface UserOrder {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  cost: number;
  total_price: number;
  status: string;
}

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

const MyOrdersView: React.FC = () => {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = jwtService.getToken();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError("Authentication token missing.");
        setLoading(false);
        return;
      }
      const payload: TokenPayload | null = jwtService.getPayload();
      const user_id = payload?.user_id || payload?.sub || null;
      if (!user_id) {
        setError("User ID missing from token.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get<UserOrder[]>(
          API_ROUTES.GET_USER_ORDERS,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { user_id },
          }
        );
        setOrders(response.data || []);
      } catch (err: any) {
        if (err.response?.status === 404) setOrders([]);
        else setError(err.response?.data?.detail || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your orders...</p>
      </div>
    );

  if (error)
    return (
      <div className="orders-view">
        <h2>Your Recent Orders</h2>
        <p className="cart-error-message">{error}</p>
      </div>
    );

  return (
    <div className="orders-view">
      <h2>Your Recent Orders</h2>
      {orders.length === 0 ? (
        <div className="order-list-placeholder">
          <p>No recent orders found.</p>
          <p className="order-cta">Browse products to start shopping!</p>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => {
            const imageUrl = order.product_image
              ? `data:image/png;base64,${order.product_image}`
              : `https://placehold.co/80x80/4f46e5/ffffff?text=${order.product_name.slice(
                  0,
                  1
                )}`;
            return (
              <div key={order.id} className="order-item">
                <div className="order-item-left">
                  <img
                    src={imageUrl}
                    alt={order.product_name}
                    className="order-item-image"
                  />
                  <div className="order-item-details">
                    <p className="order-product-name">{order.product_name}</p>
                    <p className="order-quantity">Quantity: {order.quantity}</p>
                    <p className="order-price">
                      Unit Price: ₹{order.cost.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <div className="order-item-right">
                  <p className="order-total">
                    ₹{order.total_price.toLocaleString("en-IN")}
                  </p>
                  <span
                    className={`order-status status-${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const CustomConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;
  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal">
        <p>{message}</p>
        <div className="custom-modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="confirm-btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const CartApp: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const initialTab = window.location.hash === "#orders" ? "orders" : "cart";
  const [activeTab, setActiveTab] = useState<"cart" | "orders">(initialTab);
  const [checkingOut, setCheckingOut] = useState(false);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: "",
    onConfirm: () => {},
  });
  const [userId, setUserId] = useState<string | null>(null);
  const token = jwtService.getToken();

  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(window.location.hash === "#orders" ? "orders" : "cart");
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!token) {
        setError("Authentication token missing.");
        setLoading(false);
        return;
      }
      const payload: TokenPayload | null = jwtService.getPayload();
      const user_id = payload?.user_id || payload?.sub || null;
      setUserId(user_id);
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<CartItem[]>(
          API_ROUTES.GET_CART_ITEMS,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { user_id },
          }
        );
        const cartArray: CartItem[] = response.data || [];
        setCartItems(cartArray);

        const totalCount = cartArray.reduce(
          (sum, item) => sum + (item.quantity ?? 0),
          0
        );
        setCartCount(totalCount);
        localStorage.setItem("cartCount", totalCount.toString());
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to fetch cart data.");
      } finally {
        setLoading(false);
      }
    };
    if (activeTab === "cart") {
      fetchCartItems();
    }
  }, [token, activeTab]);

  const handleConfirmDelete = (cartId: string) => {
    setConfirmState({
      isOpen: true,
      message: "Are you sure you want to remove this item from your cart?",
      onConfirm: () => handleDelete(cartId),
    });
  };

  const handleDelete = async (cartId: string) => {
    try {
      await axios.delete(API_ROUTES.DELETE_CART_ITEM(cartId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedCart = cartItems.filter((item) => item.id !== cartId);
      setCartItems(updatedCart);

      const newCount = updatedCart.reduce(
        (sum, i) => sum + (i.quantity ?? 0),
        0
      );
      setCartCount(newCount);
      localStorage.setItem("cartCount", newCount.toString());

      setMessage("Item removed successfully!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage("Failed to remove item. Please try again.");
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    const cost = item.product?.cost ?? 0;
    const qty = item.quantity ?? 0;
    return sum + cost * qty;
  }, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setMessage("Your cart is empty!");
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    setCheckingOut(true);
    try {
      const response = await axios.post(
        API_ROUTES.CHECKOUT,
        { user_id: userId, cart_ids: cartItems.map((item) => item.id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems([]);
      setCartCount(0);
      localStorage.setItem("cartCount", "0");
      setMessage(response.data.message || "Order placed successfully!");
      setTimeout(() => {
        setMessage(null);
        setActiveTab("orders");
        window.location.hash = "#orders";
      }, 2000);
    } catch (err: any) {
      setMessage(
        err.response?.data?.detail || "Checkout failed. Please try again."
      );
      setTimeout(() => setMessage(null), 4000);
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading && activeTab === "cart")
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your cart...</p>
      </div>
    );

  return (
    <div className="cart-page">
      {message && <div className="cart-message">{message}</div>}
      <CustomConfirmModal
        isOpen={confirmState.isOpen}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onClose={() => setConfirmState({ ...confirmState, isOpen: false })}
      />
      <div className="cart-container">
        <div className="tab-navigation">
          <button
            className={
              activeTab === "cart" ? "tab-button active" : "tab-button"
            }
            onClick={() => {
              setActiveTab("cart");
              window.location.hash = "";
            }}
          >
            🛒 Shopping Cart ({cartCount})
          </button>
          <button
            className={
              activeTab === "orders" ? "tab-button active" : "tab-button"
            }
            onClick={() => {
              setActiveTab("orders");
              window.location.hash = "#orders";
            }}
          >
            📦 My Orders
          </button>
        </div>

        {activeTab === "cart" ? (
          <div className="cart-content">
            <header className="cart-header">
              <h1>Your Items</h1>
              <p>Review your {cartItems.length} items before checkout.</p>
            </header>

            <div className="cart-items">
              {error && <p className="cart-error-message">{error}</p>}
              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <p className="cart-empty-heading">Your Cart is Empty</p>
                  <p className="cart-empty-text">
                    Time to find some great products!
                  </p>
                </div>
              ) : (
                <>
                  <div className="cart-item-list">
                    {cartItems.map((item) => {
                      const name =
                        item.product?.product_name || "Unknown Product";
                      const cost = item.product?.cost ?? 0;
                      const qty = item.quantity ?? 0;
                      const total = cost * qty;
                      const productImage = item.product?.image_base64;

                      const imageUrl =
                        productImage && productImage !== ""
                          ? `data:image/png;base64,${productImage}`
                          : `https://placehold.co/80x80/4f46e5/ffffff?text=${name.slice(
                              0,
                              1
                            )}`;

                      return (
                        <div key={item.id} className="cart-item">
                          <div className="cart-item-left">
                            <img
                              src={imageUrl}
                              alt={name}
                              className="cart-item-image"
                            />
                            <div className="cart-item-details">
                              <p className="product-name">{name}</p>
                              <p className="product-price">
                                Total: ₹{total.toLocaleString("en-IN")}
                              </p>
                              <p className="product-qty">Qty: {qty}</p>
                            </div>
                          </div>
                          <div className="cart-item-right">
                            <p className="cart-item-price">
                              ₹{cost.toLocaleString("en-IN")}
                            </p>
                            <div className="cart-item-actions">
                              <button
                                className="cart-item-remove"
                                onClick={() => handleConfirmDelete(item.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="cart-footer">
                    <div className="cart-summary">
                      <p className="cart-total-label">Total Amount:</p>
                      <p className="cart-total-value">
                        ₹{cartTotal.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <button
                      className="checkout-btn"
                      onClick={handleCheckout}
                      disabled={checkingOut}
                    >
                      {checkingOut ? "Processing..." : "Proceed to Checkout"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <MyOrdersView />
        )}
      </div>
    </div>
  );
};

export default CartApp;
