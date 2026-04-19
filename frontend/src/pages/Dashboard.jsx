import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [restoringId, setRestoringId] = useState(null);

  const fetchFiles = async () => {
    const res = await API.get("/backup/files");
    setFiles(res.data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const formatSize = (bytesLike) => {
    const raw = Number(bytesLike);
    if (!raw || Number.isNaN(raw)) return "--";
    const units = ["B", "KB", "MB", "GB"];
    let value = raw;
    let idx = 0;
    while (value >= 1024 && idx < units.length - 1) {
      value /= 1024;
      idx += 1;
    }
    return `${value.toFixed(value >= 10 || idx === 0 ? 0 : 2)} ${units[idx]}`;
  };

  const totalStorageBytes = files.reduce((sum, item) => sum + Number(item.file_size || 0), 0);
  const latestBackup = files.length
    ? [...files].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
    : null;

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      await API.post("/backup/upload", formData);
      alert("Uploaded");
      setFile(null);
      fetchFiles();
    } finally {
      setUploading(false);
    }
  };

  const restoreFile = async (id, fallbackName) => {
    setRestoringId(id);
    try {
      const res = await API.get(`/backup/restore/${id}`, {
        responseType: "blob",
      });

      const contentDisposition = res.headers["content-disposition"];
      const matchedName = contentDisposition?.match(/filename="?([^"]+)"?/);
      const downloadName = matchedName?.[1] || fallbackName || `backup-${id}`;

      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", downloadName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert(err.response?.data?.message || "Restore failed. Please login again and retry.");
    } finally {
      setRestoringId(null);
    }
  };

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
          <Link className="active" to="/dashboard">
            Dashboard
          </Link>
          <Link to="/backups">My Backups</Link>
          <Link to="/upload">Upload File</Link>
          <Link to="/restore">Restore Files</Link>
          <Link to="/activity">Activity Log</Link>
          <button className="dashboard-logout" onClick={logout}>
            Logout
          </button>
        </nav>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <span className="dashboard-menu-toggle">|||</span>
          <div className="dashboard-profile">Anish</div>
        </header>

        <div className="dashboard-content">
          <div className="dashboard-headline">
            <h1>Dashboard</h1>
            <p>Welcome back, Anish</p>
          </div>

          <div className="dashboard-stats-grid">
            <article className="dashboard-stat-card">
              <h3>Total Backups</h3>
              <p>{files.length}</p>
              <span>All versions</span>
            </article>
            <article className="dashboard-stat-card">
              <h3>Total Storage</h3>
              <p>{formatSize(totalStorageBytes)}</p>
              <span>Used storage</span>
            </article>
            <article className="dashboard-stat-card">
              <h3>Files Uploaded</h3>
              <p>{files.length}</p>
              <span>Total files</span>
            </article>
            <article className="dashboard-stat-card">
              <h3>Last Backup</h3>
              <p>{latestBackup ? new Date(latestBackup.created_at).toLocaleDateString() : "--"}</p>
              <span>Latest backup</span>
            </article>
          </div>

          <div className="dashboard-panels-grid">
            <article className="dashboard-panel">
              <h2>Upload New File</h2>
              <div className="dashboard-upload-box">
                <p>{file ? file.name : "Drag & drop your file here"}</p>
                <span>or</span>
                <label className="dashboard-upload-browse" htmlFor="backup-file-input">
                  Browse Files
                </label>
                <input
                  id="backup-file-input"
                  className="dashboard-file-input"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <button className="dashboard-primary-btn" onClick={uploadFile} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload File"}
              </button>
            </article>

            <article className="dashboard-panel">
              <div className="dashboard-panel-head">
                <h2>Recent Backups</h2>
                <Link to="/backups" className="dashboard-view-all">
                  View All
                </Link>
              </div>
              <div className="dashboard-backup-list">
                {files.length === 0 ? (
                  <div className="dashboard-empty-row">No backups available yet.</div>
                ) : (
                  files.slice(0, 6).map((f) => (
                    <div className="dashboard-backup-row" key={f.id}>
                      <div className="dashboard-backup-name">{f.filename}</div>
                      <div className="dashboard-backup-meta">v{f.version}</div>
                      <div className="dashboard-backup-meta">{new Date(f.created_at).toLocaleString()}</div>
                      <button
                        className="dashboard-restore-btn"
                        onClick={() => restoreFile(f.id, f.filename)}
                        disabled={restoringId === f.id}
                      >
                        {restoringId === f.id ? "..." : "Restore"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}