import React, { useState, useEffect } from "react";
import "./Admin.css";
import { API_ROUTES } from "../../API/api";
import { jwtService } from "../../services/service";

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [filter, setFilter] = useState("All");
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    quantity: ""
  });

  const fetchProducts = () => {
    fetch(API_ROUTES.GET_ALL_PRODUCTS, {
      headers: { Authorization: `Bearer ${jwtService.getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  };

  const fetchOrders = () => {
    fetch(API_ROUTES.GET_ALL_ORDERS, {
      headers: { Authorization: `Bearer ${jwtService.getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Error fetching orders:", err));
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.category) return;

    fetch(API_ROUTES.CREATE_PRODUCT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtService.getToken()}`
      },
      body: JSON.stringify({
        name: newProduct.name,
        category: newProduct.category,
        image: newProduct.image,
        price: Number(newProduct.price),
        quantity: Number(newProduct.quantity)
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchProducts();
        setNewProduct({
          name: "",
          category: "",
          image: "",
          price: "",
          quantity: ""
        });
      })
      .catch((err) => console.error("Error adding product:", err));
  };

  const deleteProduct = (id: string | number) => {
    fetch(API_ROUTES.DELETE_PRODUCT(id.toString()), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${jwtService.getToken()}` },
    })
      .then(() => fetchProducts())
      .catch((err) => console.error("Error deleting product:", err));
  };

  const filteredOrders = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>Admin</h2>
        <ul>
          <li
            className={activeTab === "products" ? "active" : ""}
            onClick={() => setActiveTab("products")}
          >
            Products
          </li>
          <li
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </li>
          <li
            className={activeTab === "add" ? "active" : ""}
            onClick={() => setActiveTab("add")}
          >
            Add Product
          </li>
        </ul>
      </aside>

      <main className="main-content">
        {activeTab === "products" && (
          <div className="content-section">
            <h2>Current Products</h2>
            <div className="product-grid">
              {products.map((p) => (
                <div className="product-card" key={p.id}>
                  <img src={p.image} alt={p.name} />
                  <h4>{p.name}</h4>
                  <p>₹{p.price}</p>
                  <p>Qty: {p.quantity}</p>
                  <button onClick={() => deleteProduct(p.id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="content-section">
            <h2>All Orders</h2>
            <div className="filter-bar">
              <label>Filter by Status:</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option>All</option>
                <option>Pending</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Total (₹)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id} onClick={() => setSelectedOrder(o)}>
                    <td>{o.id}</td>
                    <td>{o.customer}</td>
                    <td>{o.address}</td>
                    <td>{o.total}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) =>
                          setOrders((prev) =>
                            prev.map((ord) =>
                              ord.id === o.id ? { ...ord, status: e.target.value } : ord
                            )
                          )
                        }
                      >
                        <option>Pending</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {selectedOrder && (
              <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>Order Details</h3>
                  <p><b>Order ID:</b> {selectedOrder.id}</p>
                  <p><b>Customer:</b> {selectedOrder.customer}</p>
                  <p><b>Address:</b> {selectedOrder.address}</p>
                  <p><b>Products:</b> {selectedOrder.products.join(", ")}</p>
                  <p><b>Total:</b> ₹{selectedOrder.total}</p>
                  <p><b>Status:</b> {selectedOrder.status}</p>
                  <button onClick={() => setSelectedOrder(null)}>Close</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "add" && (
          <div className="content-section">
            <h2>Add New Product</h2>
            <form onSubmit={addProduct} className="add-product-form">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={handleChange}
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={newProduct.category}
                onChange={handleChange}
              />
              <input type="file" name="image" accept="image/*" onChange={handleChange} />
              {newProduct.image && <img src={newProduct.image} alt="Preview" className="preview-img" />}
              <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleChange} />
              <input type="number" name="quantity" placeholder="Quantity" value={newProduct.quantity} onChange={handleChange} />
              <button type="submit">Add Product</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
