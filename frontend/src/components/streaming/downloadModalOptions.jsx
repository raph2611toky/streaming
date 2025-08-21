"use client"

import { createPortal } from "react-dom"
import { useState } from "react"
import { X, Download, Settings } from "lucide-react"
import "./downloadModalOptions.css"

export default function DownloadOptionsModal({
  qualities,
  languages,
  selectedQuality,
  selectedLanguage,
  onConfirm,
  onCancel,
  fichierNom
}) {
  const [quality, setQuality] = useState(selectedQuality)
  const [language, setLanguage] = useState(selectedLanguage)

  const handleConfirm = () => {
    onConfirm(quality, language)
  }

  const selectedQualityInfo = qualities.find((q) => q.value === quality)

  return createPortal(
    <div className="download-options-overlay">
      <div className="download-options-modal">
        <div className="download-options-header">
          <div className="download-options-title">
            <Settings className="download-options-icon" />
            Options de téléchargement
          </div>
          <button onClick={onCancel} className="download-options-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="download-options-content">
          <div className="download-option-group">
            <label className="download-option-label">Qualité vidéo</label>
            <div className="quality-options">
              {qualities.map((qualityOption) => (
                <div
                  key={qualityOption.value}
                  className={`quality-option ${quality === qualityOption.value ? "selected" : ""}`}
                  onClick={() => setQuality(qualityOption.value)}
                >
                  <div className="quality-option-main">
                    <div className="quality-option-label">{qualityOption.label}</div>
                    <div className="quality-option-size">{qualityOption.size}</div>
                  </div>
                  <div className="quality-option-radio">
                    <div className={`radio-dot ${quality === qualityOption.value ? "active" : ""}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="download-summary">
            <div className="summary-item">
              <span className="summary-label">Titre:</span>
              <span className="summary-value">{fichierNom}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Taille estimée:</span>
              <span className="summary-value">{selectedQualityInfo?.size}</span>
            </div>
          </div>
        </div>

        <div className="download-options-actions">
          <button onClick={onCancel} className="download-options-cancel-btn">
            Annuler
          </button>
          <button onClick={handleConfirm} className="download-options-confirm-btn">
            <Download size={16} />
            Télécharger
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
