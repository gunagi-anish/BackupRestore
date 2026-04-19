import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  if (pathname === "/") return null;

  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const showLogout = isAuthenticated && pathname === "/dashboard";

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg app-navbar px-3 px-md-4 py-3">
      <div className="container-fluid px-0">
        <Link className="navbar-brand fw-semibold text-white" to="/">
          Backup &amp; Restore
        </Link>
        {showLogout ? (
          <button className="btn btn-outline-light btn-sm px-3" onClick={logout}>
            Logout
          </button>
        ) : (
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-light btn-sm px-3" to="/login">
              Login
            </Link>
            <Link className="btn btn-light btn-sm px-3" to="/register">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}