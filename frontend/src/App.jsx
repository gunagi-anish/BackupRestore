import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Backups from "./pages/Backups";
import Restore from "./pages/Restore";
import ActivityLog from "./pages/ActivityLog";

function AppRoutes() {
  const { pathname } = useLocation();
  const isFullBleedPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/dashboard" ||
    pathname === "/upload" ||
    pathname === "/backups" ||
    pathname === "/restore" ||
    pathname === "/activity";
  const shellClassName = isFullBleedPage ? "app-shell app-shell-home" : "app-shell";

  return (
    <main className={shellClassName}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/backups" element={<Backups />} />
        <Route path="/restore" element={<Restore />} />
        <Route path="/activity" element={<ActivityLog />} />
      </Routes>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;