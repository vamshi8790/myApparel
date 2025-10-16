import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./pages.css";
import { API_ROUTES } from "../API/api";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    newPassword: "",
  });

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setSuccessMessage("");
    setFormData({ name: "", email: "", phone: "", password: "", address: "", newPassword: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
    setFormData({ ...formData, password: "", newPassword: "" });
  };

  const handleCancelForgot = () => {
    setIsForgotPassword(false);
    setFormData({ ...formData, newPassword: "" });
  };

  const navigateAfterDelay = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
      setIsLogin(true);
      setIsForgotPassword(false);
      setFormData({ name: "", email: "", phone: "", password: "", address: "", newPassword: "" });
      navigate("/auth");
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isForgotPassword) {
        const res = await fetch(API_ROUTES.RESET_PASSWORD, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            email: formData.email,
            new_password: formData.newPassword,
          }),
        });
        if (!res.ok) throw new Error("Password reset failed");
        navigateAfterDelay("Password reset successful!");
      } else if (isLogin) {
        const res = await fetch(API_ROUTES.LOGIN, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            email: formData.email,
            password: formData.password,
          }),
        });
        if (!res.ok) throw new Error("Invalid credentials");
        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        navigate("/");
      } else {
        const res = await fetch(API_ROUTES.REGISTER, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            address: formData.address,
          }),
        });
        if (!res.ok) throw new Error("Signup failed");
        navigateAfterDelay("Signup successful!");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="auth-container">
      <h2>
        {isForgotPassword
          ? "Reset Password"
          : isLogin
          ? "Login"
          : "Sign Up"}
      </h2>

      {successMessage && <p className="success-message">{successMessage}</p>}

      {!isLoggedIn && (
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && !isForgotPassword && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {!isLogin && !isForgotPassword && (
            <>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </>
          )}
          {!isForgotPassword && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          )}
          {isForgotPassword && (
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
          )}
          <button type="submit">
            {isForgotPassword
              ? "Reset Password"
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
        </form>
      )}

      {!isForgotPassword && !isLoggedIn && isLogin && (
        <p
          className="forgot-password"
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </p>
      )}

      {isForgotPassword && !isLoggedIn && (
        <button className="cancel-btn" onClick={handleCancelForgot}>
          Cancel
        </button>
      )}

      {!isForgotPassword && !isLoggedIn && (
        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span className="toggle-btn" onClick={handleToggle}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      )}
    </div>
  );
};

export default AuthPage;
