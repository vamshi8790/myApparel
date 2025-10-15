import React, { useState } from "react";
import "./Admin.css";

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([
    { id: 1, name: "T-shirt", price: 499, quantity: 30 },
    { id: 2, name: "Jeans", price: 899, quantity: 15 },
  ]);
  const [orders, setOrders] = useState([
    { id: 1, customer: "Vamshi", items: ["T-shirt", "Jeans"], total: 1398 },
    { id: 2, customer: "Riya", items: ["Kurti"], total: 599 },
  ]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", quantity: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.quantity) return;
    const newItem = {
      id: Date.now(),
      name: newProduct.name,
      price: Number(newProduct.price),
      quantity: Number(newProduct.quantity),
    };
    setProducts([...products, newItem]);
    setNewProduct({ name: "", price: "", quantity: "" });
  };

  const deleteProduct = (id: number) => setProducts(products.filter((p) => p.id !== id));

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
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price (₹)</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.price}</td>
                    <td>{p.quantity}</td>
                    <td>
                      <button onClick={() => deleteProduct(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="content-section">
            <h2>All Orders</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.customer}</td>
                    <td>{o.items.join(", ")}</td>
                    <td>{o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                type="number"
                name="price"
                placeholder="Price"
                value={newProduct.price}
                onChange={handleChange}
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={newProduct.quantity}
                onChange={handleChange}
              />
              <button type="submit">Add Product</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
