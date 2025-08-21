"use client"

import { createPortal } from "react-dom"
import { X, Download, CheckCircle } from "lucide-react"
import "./downloadPortal.css"

export default function DownloadPortal({
  progress,
  speed,
  timeRemaining,
  downloadedSize,
  totalSize,
  isDownloading,
  onCancel,
  formatBytes,
  formatSpeed,
  formatTimeRemaining,
  quality,
  language,
}) {
  const isComplete = progress >= 100

  return createPortal(
    <div className="download-portal-overlay">
      <div className="download-portal">
        <div className="download-header">
          <div className="download-title">
            {isComplete ? (
              <>
                <CheckCircle className="download-complete-icon" />
                Téléchargement terminé
              </>
            ) : (
              <>
                <Download className="download-icon-header" />
                Téléchargement en cours...
              </>
            )}
          </div>
          <button onClick={onCancel} className="download-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="download-content">
          <div className="download-file-info">
            <div className="file-name">Tutoriel_React_Complet_{quality}.mp4</div>
            <div className="file-details">
              <span className="file-size">
                {formatBytes(downloadedSize)} / {formatBytes(totalSize)}
              </span>
              <span className="file-quality">• {quality}</span>
              <span className="file-language">• {language.toUpperCase()}</span>
            </div>
          </div>

          <div className="download-progress-container">
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${progress}%`,
                  backgroundColor: isComplete ? "#4CAF50" : "#fdd835",
                }}
              />
            </div>
            <div className="progress-percentage">{Math.round(progress)}%</div>
          </div>

          {isDownloading && !isComplete && (
            <div className="download-stats">
              <div className="download-stat">
                <span className="stat-label">Vitesse:</span>
                <span className="stat-value">{formatSpeed(speed)}</span>
              </div>
              <div className="download-stat">
                <span className="stat-label">Temps restant:</span>
                <span className="stat-value">{formatTimeRemaining(timeRemaining)}</span>
              </div>
            </div>
          )}

          {isComplete && (
            <div className="download-complete-message">
              <p>Le fichier a été téléchargé avec succès!</p>
              <button className="download-open-btn">Ouvrir le dossier</button>
            </div>
          )}

          {isDownloading && !isComplete && (
            <div className="download-actions">
              <button onClick={onCancel} className="download-cancel-btn">
                Annuler le téléchargement
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
