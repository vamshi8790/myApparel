import React, { useState, useEffect } from "react";
import "./Admin.css";
import { API_ROUTES } from "../../API/api";
import { jwtService } from "../../services/service";
import axios from "axios";

const Admin: React.FC = () => {
  const token = jwtService.getToken();

  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [filter, setFilter] = useState("All");

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    imageFile: null as File | null,
    quantity: ""
  });

  const [editProduct, setEditProduct] = useState<any | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_ROUTES.GET_ALL_PRODUCTS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {}
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(API_ROUTES.GET_ALL_ORDERS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files && files[0]) {
      setNewProduct({ ...newProduct, imageFile: files[0] });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "image" && files && files[0]) {
      setEditProduct({ ...editProduct, imageFile: files[0] });
    } else {
      if (name === "name") {
        setEditProduct({ ...editProduct, product_name: value, name: value });
      } else if (name === "price") {
        setEditProduct({ ...editProduct, cost: value, price: value });
      } else {
        setEditProduct({ ...editProduct, [name]: value });
      }
    }
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.imageFile) {
      alert("Please fill all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("product_name", newProduct.name);
    formData.append("category", newProduct.category);
    formData.append("cost", newProduct.price.toString());
    formData.append("quantity", newProduct.quantity ? newProduct.quantity.toString() : "1");
    formData.append("product_image", newProduct.imageFile);

    try {
      await axios.post(API_ROUTES.CREATE_PRODUCT, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Product added successfully!");
      setNewProduct({ name: "", category: "", price: "", imageFile: null, quantity: "" });
      fetchProducts();
      setActiveTab("products");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to add product.");
    }
  };

  const deleteProduct = async (id: string | number) => {
    try {
      await axios.delete(API_ROUTES.DELETE_PRODUCT(id.toString()), {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {}
  };

  const saveEditedProduct = async () => {
    if (!editProduct || !editProduct.id) return;

    try {
      if (editProduct.imageFile) {
        const formData = new FormData();
        formData.append("product_name", editProduct.product_name || editProduct.name);
        formData.append("category", editProduct.category);
        formData.append("cost", (editProduct.cost || editProduct.price).toString());
        formData.append("quantity", editProduct.quantity.toString());
        formData.append("product_image", editProduct.imageFile);

        await axios.put(API_ROUTES.UPDATE_PRODUCT(editProduct.id.toString()), formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
      } else {
        const jsonData = {
          product_name: editProduct.product_name || editProduct.name,
          category: editProduct.category,
          cost: editProduct.cost || editProduct.price,
          quantity: editProduct.quantity,
        };

        await axios.put(API_ROUTES.UPDATE_PRODUCT(editProduct.id.toString()), jsonData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      alert("Product updated successfully!");
      setEditProduct(null);
      fetchProducts();
    } catch (err: any) {
      let errorMsg = "Failed to update product.";
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          errorMsg = err.response.data.detail.map((e: any) => 
            `${e.loc ? e.loc.join(' -> ') : 'Error'}: ${e.msg}`
          ).join('\n');
        } else {
          errorMsg = err.response.data.detail;
        }
      }
      alert(errorMsg);
    }
  };

  const filteredOrders = filter === "All" ? orders : orders.filter((o) => o.status === filter);
  const boysProducts = products.filter((p) => p.category === "Boys Clothing");
  const girlsProducts = products.filter((p) => p.category === "Girls Clothing");
  const kidsProducts = products.filter((p) => p.category === "Kids Clothing");

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>Admin</h2>
        <ul>
          <li className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>Products</li>
          <li className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>Orders</li>
          <li className={activeTab === "add" ? "active" : ""} onClick={() => setActiveTab("add")}>Add Product</li>
        </ul>
      </aside>

      <main className="main-content">
        {activeTab === "products" && (
          <div className="content-section">
            <h2>Current Products</h2>
            {[{ title: "Boys Clothing", data: boysProducts },
              { title: "Girls Clothing", data: girlsProducts },
              { title: "Kids Clothing", data: kidsProducts }].map((cat) =>
              cat.data.length > 0 && (
                <div key={cat.title}>
                  <h3 className="category-title">{cat.title}</h3>
                  <div className="product-grid">
                    {cat.data.map((p) => (
                      <div className="product-card" key={p.id}>
                        <img src={`data:image/jpeg;base64,${p.image}`} alt={p.product_name} />
                        <h4>{p.product_name}</h4>
                        <p>₹{p.cost}</p>
                        <p>Qty: {p.quantity}</p>
                        <div className="product-actions">
                          <button className="edit-btn" onClick={() => setEditProduct(p)}>Edit</button>
                          <button onClick={() => deleteProduct(p.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
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
              <input type="text" name="name" placeholder="Product Name" value={newProduct.name} onChange={handleChange} />
              <input type="text" name="category" placeholder="Category" value={newProduct.category} onChange={handleChange} />
              <input type="file" name="image" accept="image/*" onChange={handleChange} />
              {newProduct.imageFile && <img src={URL.createObjectURL(newProduct.imageFile)} alt="Preview" className="preview-img" />}
              <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleChange} />
              <input type="number" name="quantity" placeholder="Quantity" value={newProduct.quantity} onChange={handleChange} />
              <button type="submit">Add Product</button>
            </form>
          </div>
        )}

        {editProduct && (
          <div className="modal-overlay" onClick={() => setEditProduct(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Edit Product</h3>
              <input type="text" name="name" value={editProduct.product_name || editProduct.name} onChange={handleEditChange} placeholder="Product Name" />
              <input type="text" name="category" value={editProduct.category} onChange={handleEditChange} placeholder="Category" />
              <input type="number" name="price" value={editProduct.cost || editProduct.price} onChange={handleEditChange} placeholder="Price" />
              <input type="number" name="quantity" value={editProduct.quantity} onChange={handleEditChange} placeholder="Quantity" />
              <input type="file" name="image" accept="image/*" onChange={handleEditChange} />
              {editProduct.imageFile ? (
                <img src={URL.createObjectURL(editProduct.imageFile)} alt="Preview" className="preview-img" />
              ) : (
                <img src={`data:image/jpeg;base64,${editProduct.image}`} alt="Current" className="preview-img" />
              )}
              <div className="modal-buttons">
                <button onClick={() => setEditProduct(null)} className="cancel-btn">Cancel</button>
                <button onClick={saveEditedProduct} style={{background:"green", color:"white"}}>Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
