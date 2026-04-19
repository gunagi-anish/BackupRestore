import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Backups() {
  const [files, setFiles] = useState([]);
  const [restoringId, setRestoringId] = useState(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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
    return `${value.toFixed(value >= 10 || idx === 0 ? 0 : 1)} ${units[idx]}`;
  };

  const extensionOf = (name = "") => {
    const last = name.split(".").pop();
    return last ? last.toLowerCase() : "other";
  };

  const filteredFiles = files
    .filter((f) => f.filename.toLowerCase().includes(query.toLowerCase()))
    .filter((f) => (typeFilter === "all" ? true : extensionOf(f.filename) === typeFilter))
    .sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "name") return a.filename.localeCompare(b.filename);
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const restoreFile = async (id, fallbackName) => {
    setRestoringId(id);
    try {
      const res = await API.get(`/backup/restore/${id}`, {
        responseType: "blob",
      });

      const contentDisposition = res.headers["content-disposition"];
      const matchedName = contentDisposition?.match(/filename=\"?([^\"]+)\"?/);
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
          <Link to="/dashboard">Dashboard</Link>
          <Link className="active" to="/backups">
            My Backups
          </Link>
          <Link to="/upload">Upload File</Link>
          <Link to="/restore">Restore Files</Link>
          <Link to="/activity">Activity Log</Link>
          <button className="dashboard-logout" onClick={logout}>
            Logout
          </button>
        </nav>
      </aside>

      <section className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-headline">
            <h1>My Backups</h1>
            <p>
              <span>Dashboard</span> &nbsp;&gt;&nbsp; <span>My Backups</span>
            </p>
          </div>

          <div className="backups-toolbar">
            <input
              className="backups-search"
              placeholder="Search files..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select className="backups-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All Files</option>
              <option value="pdf">PDF</option>
              <option value="sql">SQL</option>
              <option value="pptx">PPTX</option>
              <option value="txt">TXT</option>
              <option value="zip">ZIP</option>
            </select>
            <select className="backups-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="name">Sort by: Name</option>
            </select>
          </div>

          <article className="dashboard-panel backups-panel">
            <div className="backups-table-header">
              <div>File Name</div>
              <div>Version</div>
              <div>Size</div>
              <div>Uploaded On</div>
              <div>Actions</div>
            </div>
            <div className="dashboard-backup-list backups-list">
              {filteredFiles.length === 0 ? (
                <div className="dashboard-empty-row">No backups available yet.</div>
              ) : (
                filteredFiles.map((f) => (
                  <div className="dashboard-backup-row" key={f.id}>
                    <div className="dashboard-backup-name">{f.filename}</div>
                    <div className="dashboard-backup-meta">v{f.version}</div>
                    <div className="dashboard-backup-meta">{formatSize(f.file_size)}</div>
                    <div className="dashboard-backup-meta">{new Date(f.created_at).toLocaleString()}</div>
                    <button
                      className="dashboard-restore-btn"
                      onClick={() => restoreFile(f.id, f.filename)}
                      disabled={restoringId === f.id}
                    >
                      {restoringId === f.id ? "Restoring..." : "Restore"}
                    </button>
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
