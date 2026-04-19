import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
    } finally {
      setUploading(false);
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
          <Link className="active" to="/upload">
            Upload File
          </Link>
          <Link to="/restore">Restore Files</Link>
          <Link to="/activity">Activity Log</Link>
          <button className="dashboard-logout" onClick={logout}>
            Logout
          </button>
        </nav>
      </aside>

      <section className="dashboard-main upload-main">
        <div className="dashboard-content">
          <div className="upload-header">
            <h1>Upload File</h1>
            <p>Upload your file to secure your data</p>
          </div>

          <div className="upload-dropzone">
            <p>{file ? file.name : "Drag & drop file here to upload"}</p>
            <span>or</span>
            <label className="dashboard-upload-browse" htmlFor="upload-page-file-input">
              Browse Files
            </label>
            <input
              id="upload-page-file-input"
              className="dashboard-file-input"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <button className="dashboard-primary-btn upload-action-btn" onClick={uploadFile} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>

          <section className="upload-info-grid">
            <article className="upload-info-card">
              <h2>Upload Information</h2>
              <ul>
                <li>Maximum file size: 500 MB</li>
                <li>Allowed format: All file types</li>
                <li>Files are encrypted before upload transfer</li>
                <li>Multiple versions will be created</li>
              </ul>
            </article>

            <article className="upload-info-card">
              <h2>Tips</h2>
              <ul>
                <li>You can upload multiple files</li>
                <li>Each upload creates a new version</li>
                <li>Old versions are safe and can be restored anytime</li>
              </ul>
            </article>
          </section>
        </div>
      </section>
    </div>
  );
}
