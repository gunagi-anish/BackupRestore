import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Register() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== confirmPassword) {
      setError("Password and confirm password should match.");
      return;
    }
    if (!acceptTerms) {
      setError("Please accept terms and conditions.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await API.post("/auth/register", data);
      alert("Registered Successfully");
      window.location.href = "/login";
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-card auth-card-register shadow-sm">
        <div className="auth-card-inner">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Register a new account</p>

          <form onSubmit={handleSubmit}>
            <label className="auth-label" htmlFor="register-username">
              Username
            </label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                U
              </span>
              <input
                id="register-username"
                className="auth-input"
                placeholder="Enter your username"
                required
                onChange={(e) => setData({ ...data, username: e.target.value })}
              />
            </div>

            <label className="auth-label" htmlFor="register-email">
              Email
            </label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                @
              </span>
              <input
                id="register-email"
                className="auth-input"
                placeholder="Enter your email"
                type="email"
                required
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>

            <label className="auth-label" htmlFor="register-password">
              Password
            </label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                *
              </span>
              <input
                id="register-password"
                type="password"
                className="auth-input"
                placeholder="Enter your password"
                required
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>

            <label className="auth-label" htmlFor="register-confirm-password">
              Confirm Password
            </label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                *
              </span>
              <input
                id="register-confirm-password"
                type="password"
                className="auth-input"
                placeholder="Confirm your password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="auth-row">
              <label className="auth-check">
                <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                <span>
                  I agree to the <a href="#">Terms &amp; Conditions</a>
                </span>
              </label>
            </div>

            {error && <p className="auth-error">{error}</p>}
            <button className="btn auth-submit-btn w-100 mt-3" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="auth-foot-note">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}