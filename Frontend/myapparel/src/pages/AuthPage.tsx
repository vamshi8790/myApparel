import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./pages.css";
import { API_ROUTES } from "../API/api";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    address: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    address: "",
    newPassword: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setSuccessMessage("");
    setFormData({ full_name: "", email: "", phone_number: "", password: "", address: "", newPassword: "" });
    setErrors({ full_name: "", email: "", phone_number: "", password: "", address: "", newPassword: "" });
  };

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = "Invalid email format";
    }
    if (name === "password" || name === "newPassword") {
      if (value.length < 6) error = "Password must be at least 6 characters";
      else if (!/[A-Z]/.test(value) || !/[0-9]/.test(value))
        error = "Password must contain an uppercase letter and a number";
    }
    if (name === "phone_number") {
      if (value.length < 10 || value.length > 15)
        error = "Phone number must be 10–15 digits";
    }
    if (name === "full_name" && value.trim().length < 3)
      error = "Full name must be at least 3 characters";
    if (name === "address" && value.trim().length < 5)
      error = "Address must be at least 5 characters";
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  useEffect(() => {
    const hasError = Object.values(errors).some((e) => e !== "");
    const requiredFields = isForgotPassword
      ? ["email", "newPassword"]
      : isLogin
      ? ["email", "password"]
      : ["full_name", "email", "phone_number", "password", "address"];
    const hasEmpty = requiredFields.some((f) => !formData[f as keyof typeof formData]);
    setIsFormValid(!hasError && !hasEmpty);
  }, [errors, formData, isLogin, isForgotPassword]);

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
      setFormData({ full_name: "", email: "", phone_number: "", password: "", address: "", newPassword: "" });
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
            full_name: formData.full_name,
            email: formData.email,
            phone_number: formData.phone_number,
            password: formData.password,
            address: formData.address,
          }),
        });
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Signup error:", errorData);
          throw new Error(errorData.detail || "Signup failed");
        }
        navigateAfterDelay("Signup successful!");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="auth-container">
      <h2>{isForgotPassword ? "Reset Password" : isLogin ? "Login" : "Sign Up"}</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}

      {!isLoggedIn && (
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && !isForgotPassword && (
            <>
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
              {errors.full_name && <p className="error">{errors.full_name}</p>}
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}

          {!isLogin && !isForgotPassword && (
            <>
              <input
                type="tel"
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
              {errors.phone_number && <p className="error">{errors.phone_number}</p>}

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              {errors.address && <p className="error">{errors.address}</p>}
            </>
          )}
          {!isForgotPassword && (
            <>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </>
          )}
          {isForgotPassword && (
            <>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              {errors.newPassword && <p className="error">{errors.newPassword}</p>}
            </>
          )}
          <button type="submit" disabled={!isFormValid}>
            {isForgotPassword ? "Reset Password" : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
      )}

      {!isForgotPassword && !isLoggedIn && isLogin && (
        <p className="forgot-password" onClick={handleForgotPassword}>
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
