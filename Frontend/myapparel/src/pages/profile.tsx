import React, { useEffect, useState } from "react";
import "./pages.css";
import profileBgImg from "../assets/logof.png";
import { API_ROUTES } from "../API/api";
import { jwtService } from "../services/service";

interface UserProfile {
  full_name: string;
  email: string;
  phone_number: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({
    full_name: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    const payload = jwtService.getPayload();
    const userId = payload?.user_id;

    if (!userId) return;

    fetch(API_ROUTES.GET_USER(userId), {
      headers: {
        Authorization: `Bearer ${jwtService.getToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data: UserProfile) => {
        setUser(data);
        setFormData(data);
      })
      .catch((err) => console.error("Error fetching profile:", err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const payload = jwtService.getPayload();
    const userId = payload?.user_id;
    if (!userId) return;

    fetch(API_ROUTES.UPDATE_USER(userId), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtService.getToken()}`,
      },
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
    <section
      className="profile-page"
      style={{
        backgroundImage: `url(${profileBgImg})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="profile-container">
        <main className="content-area">
          {!editMode ? (
            <div className="profile-card">
              <div className="profile-header">
                <h2 className="profile-name">{user.full_name}</h2>
                <p className="profile-email">{user.email}</p>
              </div>
              <div className="profile-info">
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
            </div>
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
                <button className="cancel-btn" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default Profile;
