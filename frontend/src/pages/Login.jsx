import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Login() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-card auth-card-login shadow-sm">
        <div className="auth-card-inner">
          <div className="auth-head-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 2 4.5 5.2v6.4c0 4.8 3.2 9.2 7.5 10.8 4.3-1.6 7.5-6 7.5-10.8V5.2L12 2Zm0 2.3 5.5 2.4v4.9c0 3.8-2.3 7.4-5.5 8.9-3.2-1.5-5.5-5.1-5.5-8.9V6.7L12 4.3Z" />
            </svg>
          </div>
          <h2 className="auth-title">Welcome Back!</h2>
          <p className="auth-subtitle">Login to your account</p>

          <form onSubmit={handleSubmit}>
            <label className="auth-label" htmlFor="login-email">
              Email
            </label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                @
              </span>
              <input
                id="login-email"
                className="auth-input"
                placeholder="Enter your email"
                type="email"
                required
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>

            <label className="auth-label" htmlFor="login-password">
              Password
            </label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon" aria-hidden="true">
                *
              </span>
              <input
                id="login-password"
                type="password"
                className="auth-input"
                placeholder="Enter your password"
                required
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
            </div>

            <div className="auth-row">
              <label className="auth-check">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <a href="#" className="auth-link">
                Forgot Password?
              </a>
            </div>

            {error && <p className="auth-error">{error}</p>}
            <button className="btn auth-submit-btn w-100 mt-3" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="auth-foot-note">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}