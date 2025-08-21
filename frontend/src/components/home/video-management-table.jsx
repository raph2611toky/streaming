"use client";

import { useState } from "react";
import "./video-management-table.css";

const VideoManagementTable = ({ videos, onEdit, onDelete }) => {
  const [sortField, setSortField] = useState("uploadDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideos, setSelectedVideos] = useState([]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedVideos(filteredVideos.map((video) => video.id));
    } else {
      setSelectedVideos([]);
    }
  };

  const handleSelectVideo = (videoId) => {
    setSelectedVideos((prev) =>
      prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]
    );
  };

  const filteredVideos = videos
    .filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || video.status.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "uploadDate") {
        aValue = new Date(aValue.split("/").reverse().join("-"));
        bValue = new Date(bValue.split("/").reverse().join("-"));
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusBadge = (status) => {
    const statusClasses = {
      Publié: "status-published",
      Brouillon: "status-draft",
      Privé: "status-private",
      "En attente": "status-pending",
    };

    return <span className={`status-badge ${statusClasses[status] || "status-default"}`}>{status}</span>;
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-title">
          <h2>Mes vidéos</h2>
          <span className="video-count">
            {filteredVideos.length} vidéo{filteredVideos.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="table-controls">
          <div className="search-box">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher une vidéo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="publié">Publié</option>
            <option value="brouillon">Brouillon</option>
            <option value="privé">Privé</option>
            <option value="en attente">En attente</option>
          </select>
        </div>
      </div>

      {selectedVideos.length > 0 && (
        <div className="bulk-actions">
          <span>
            {selectedVideos.length} vidéo{selectedVideos.length !== 1 ? "s" : ""} sélectionnée
            {selectedVideos.length !== 1 ? "s" : ""}
          </span>
          <div className="bulk-buttons">
            <button className="bulk-btn bulk-delete">Supprimer</button>
            <button className="bulk-btn bulk-private">Rendre privé</button>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="videos-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input
                  type="checkbox"
                  checked={selectedVideos.length === filteredVideos.length && filteredVideos.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="thumbnail-col">Vidéo</th>
              <th
                className={`sortable ${sortField === "title" ? `sorted-${sortDirection}` : ""}`}
                onClick={() => handleSort("title")}
              >
                Titre
                <svg className="sort-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14l5-5 5 5z" />
                </svg>
              </th>
              <th
                className={`sortable ${sortField === "category" ? `sorted-${sortDirection}` : ""}`}
                onClick={() => handleSort("category")}
              >
                Catégorie
                <svg className="sort-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14l5-5 5 5z" />
                </svg>
              </th>
              <th
                className={`sortable ${sortField === "status" ? `sorted-${sortDirection}` : ""}`}
                onClick={() => handleSort("status")}
              >
                Statut
                <svg className="sort-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14l5-5 5 5z" />
                </svg>
              </th>
              <th
                className={`sortable ${sortField === "views" ? `sorted-${sortDirection}` : ""}`}
                onClick={() => handleSort("views")}
              >
                Vues
                <svg className="sort-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14l5-5 5 5z" />
                </svg>
              </th>
              <th
                className={`sortable ${sortField === "uploadDate" ? `sorted-${sortDirection}` : ""}`}
                onClick={() => handleSort("uploadDate")}
              >
                Date
                <svg className="sort-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14l5-5 5 5z" />
                </svg>
              </th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVideos.map((video) => (
              <tr key={video.id} className={selectedVideos.includes(video.id) ? "selected" : ""}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedVideos.includes(video.id)}
                    onChange={() => handleSelectVideo(video.id)}
                  />
                </td>
                <td className="thumbnail-cell">
                  <div className="video-thumbnail">
                    <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} />
                    <div className="duration-badge">{video.duration}</div>
                  </div>
                </td>
                <td className="title-cell">
                  <div className="video-title">
                    <h4>{video.title}</h4>
                    {video.description && <p className="video-description">{video.description}</p>}
                  </div>
                </td>
                <td>
                  <span className="category-tag">{video.category}</span>
                </td>
                <td>{getStatusBadge(video.status)}</td>
                <td className="views-cell">
                  <div className="views-info">
                    <span className="views-count">{formatViews(video.views)}</span>
                    <span className="views-label">vues</span>
                  </div>
                </td>
                <td className="date-cell">{video.uploadDate}</td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => onEdit && onEdit(video)}
                      title="Modifier"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      </svg>
                    </button>
                    <button className="action-btn view-btn" title="Voir">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => onDelete && onDelete(video)}
                      title="Supprimer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredVideos.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
              </svg>
            </div>
            <h3>Aucune vidéo trouvée</h3>
            <p>Commencez par uploader votre première vidéo</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoManagementTable;