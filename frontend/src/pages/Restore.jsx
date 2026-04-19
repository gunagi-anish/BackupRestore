import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Restore() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedVersionId, setSelectedVersionId] = useState(null);
  const [restoring, setRestoring] = useState(false);

  const fetchFiles = async () => {
    const res = await API.get("/backup/files");
    setFiles(res.data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const groupedByName = useMemo(() => {
    const groups = {};
    for (const item of files) {
      groups[item.filename] = groups[item.filename] || [];
      groups[item.filename].push(item);
    }
    Object.values(groups).forEach((arr) => arr.sort((a, b) => b.version - a.version));
    return groups;
  }, [files]);

  const fileNames = Object.keys(groupedByName);

  useEffect(() => {
    if (!selectedFile && fileNames.length) {
      setSelectedFile(fileNames[0]);
    }
  }, [fileNames, selectedFile]);

  const versions = selectedFile ? groupedByName[selectedFile] || [] : [];

  useEffect(() => {
    if (versions.length) {
      setSelectedVersionId(versions[0].id);
    }
  }, [selectedFile]);

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

  const restoreSelected = async () => {
    const selected = versions.find((v) => v.id === selectedVersionId);
    if (!selected) {
      alert("Please choose a version first.");
      return;
    }

    setRestoring(true);
    try {
      const res = await API.get(`/backup/restore/${selected.id}`, {
        responseType: "blob",
      });

      const contentDisposition = res.headers["content-disposition"];
      const matchedName = contentDisposition?.match(/filename=\"?([^\"]+)\"?/);
      const downloadName = matchedName?.[1] || selected.filename || `backup-${selected.id}`;

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
      setRestoring(false);
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
          <Link to="/backups">My Backups</Link>
          <Link to="/upload">Upload File</Link>
          <Link className="active" to="/restore">
            Restore Files
          </Link>
          <Link to="/activity">Activity Log</Link>
          <button className="dashboard-logout" onClick={logout}>
            Logout
          </button>
        </nav>
      </aside>

      <section className="dashboard-main">
        <div className="dashboard-content">
          <div className="dashboard-headline">
            <h1>Restore Files</h1>
            <p>
              <span>Dashboard</span> &nbsp;&gt;&nbsp; <span>Restore Files</span>
            </p>
          </div>

          <div className="restore-steps">
            <div className="restore-step active">1</div>
            <div className="restore-step">2</div>
            <div className="restore-step">3</div>
          </div>

          <article className="dashboard-panel restore-panel">
            <label className="restore-label">Select File To Restore</label>
            <select className="restore-file-select" value={selectedFile} onChange={(e) => setSelectedFile(e.target.value)}>
              {fileNames.length === 0 ? (
                <option value="">No files available</option>
              ) : (
                fileNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))
              )}
            </select>

            <h2 className="restore-versions-title">Available Versions</h2>
            <div className="restore-version-table">
              <div className="restore-version-head">
                <div>Version</div>
                <div>Size</div>
                <div>Uploaded On</div>
              </div>
              {versions.length === 0 ? (
                <div className="dashboard-empty-row">No versions available for this file.</div>
              ) : (
                versions.map((v, idx) => (
                  <label className="restore-version-row" key={v.id}>
                    <div>
                      <input
                        type="radio"
                        name="restore-version"
                        checked={selectedVersionId === v.id}
                        onChange={() => setSelectedVersionId(v.id)}
                      />
                      <span>{`Version ${v.version}${idx === 0 ? " (Latest)" : ""}`}</span>
                    </div>
                    <div>{formatSize(v.file_size)}</div>
                    <div>{new Date(v.created_at).toLocaleString()}</div>
                  </label>
                ))
              )}
            </div>

            <div className="restore-actions">
              <Link className="restore-cancel-btn" to="/dashboard">
                Cancel
              </Link>
              <button className="dashboard-primary-btn restore-next-btn" onClick={restoreSelected} disabled={restoring}>
                {restoring ? "Restoring..." : "Next"}
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
