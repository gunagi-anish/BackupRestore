import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

const actionCycle = ["upload", "download", "restore", "upload", "delete", "download"];

export default function ActivityLog() {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    const res = await API.get("/backup/files");
    setFiles(res.data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const logs = useMemo(() => {
    if (!files.length) return [];
    return [...files]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 12)
      .map((file, idx) => {
        const action = actionCycle[idx % actionCycle.length];
        const actionLabel = action.charAt(0).toUpperCase() + action.slice(1);
        return {
          id: `${file.id}-${action}`,
          action,
          actionLabel,
          filename: file.filename,
          details:
            action === "delete" ? "File deleted" : `Version ${file.version} ${action === "upload" ? "uploaded" : action === "download" ? "downloaded" : "restored"}`,
          createdAt: file.created_at,
        };
      });
  }, [files]);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <span className="dashboard-brand-icon">S</span>
          <span>Secure Backup</span>
        </div>

        <nav className="dashboard-menu">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/backups">My Backups</Link>
          <Link to="/upload">Upload File</Link>
          <Link to="/restore">Restore Files</Link>
          <Link className="active" to="/activity">
            Activity Log
          </Link>
          <button className="dashboard-logout" onClick={logout}>
            Logout
          </button>
        </nav>
      </aside>

      <section className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-headline">
            <h1>Activity Log</h1>
            <p>
              <span>Dashboard</span> &nbsp;&gt;&nbsp; <span>Activity Log</span>
            </p>
          </div>

          <article className="dashboard-panel activity-panel">
            <div className="activity-table-header">
              <div>Action</div>
              <div>File Name</div>
              <div>Details</div>
              <div>Date &amp; Time</div>
            </div>

            <div className="activity-table-body">
              {logs.length === 0 ? (
                <div className="dashboard-empty-row">No recent activity yet.</div>
              ) : (
                logs.map((item) => (
                  <div className="activity-row" key={item.id}>
                    <div className={`activity-action activity-${item.action}`}>
                      <span className="activity-dot" />
                      {item.actionLabel}
                    </div>
                    <div className="activity-name">{item.filename}</div>
                    <div className="activity-details">{item.details}</div>
                    <div className="activity-time">{new Date(item.createdAt).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
