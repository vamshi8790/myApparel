import React, { useEffect, useState } from "react";
import "./pages.css";

interface UserProfile {
  full_name: string;
  email: string;
  phone_number: string;
}

const GET_URL =
  "http://127.0.0.1:8000/users/get/b35b3075-9916-4281-ac33-bb473b386cea";
const UPDATE_URL =
  "http://127.0.0.1:8000/users/update/b35b3075-9916-4281-ac33-bb473b386cea";

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    full_name: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    fetch(GET_URL)
      .then((res) => res.json())
      .then((data: UserProfile & { id: string }) => {
        const { full_name, email, phone_number } = data;
        setUser({ full_name, email, phone_number });
        setFormData({ full_name, email, phone_number });
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    fetch(UPDATE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data: UserProfile) => {
        setUser(data);
        setEditMode(false);
      })
      .catch((err) => console.error("Error updating profile:", err));
  };

  if (!user) return <p className="loading-text">Loading profile...</p>;

  return (
    <section className="profile-page">
      <div className="profile-card">
        {!editMode ? (
          <>
            <div className="profile-header">
              <h2 className="profile-name">{user.full_name}</h2>
              <p className="profile-email">{user.email}</p>
            </div>

            <div className="profile-info">
              <h3>Profile Details</h3>
              <div className="profile-row">
                <strong>Name:</strong> <span>{user.full_name}</span>
              </div>
              <div className="profile-row">
                <strong>Email:</strong> <span>{user.email}</span>
              </div>
              <div className="profile-row">
                <strong>Phone:</strong> <span>{user.phone_number}</span>
              </div>
            </div>

            <button className="edit-btn" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </>
        ) : (
          <div className="profile-form">
            <h3>Edit Profile</h3>
            <div className="form-row">
              <label>Name:</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <label>Phone:</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-buttons">
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button className="edit-btn" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;
