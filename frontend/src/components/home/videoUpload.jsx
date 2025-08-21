"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { useNavigate } from "react-router-dom"
import "./videoUpload.css"
import api from "../../services/Api"

const VideoUpload = ({ isOpen, onClose, onUploadComplete }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const [uploadStats, setUploadStats] = useState({
    uploadedBytes: 0,
    totalBytes: 0,
    uploadSpeed: "0 B/s",
    totalDuration: "00:00",
    remainingDuration: "00:00",
    remainingSize: "0 B",
  })

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    visibility: "PUBLIC",
    tags: [],
    customThumbnail: null,
    generatedThumbnails: [],
  })

  const [tagInput, setTagInput] = useState("")
  const fileInputRef = useRef(null)
  const thumbnailInputRef = useRef(null)
  const wsRef = useRef(null)
  const navigate = useNavigate()

  const categories = [
    "Actualités", "Animation", "Animaux", "Art", "Beauté",
    "Comédie", "Cuisine", "Dessin animé", "Divertissement", "Documentaire", "Dramatique",
    "Éducation", "Enfants", "Fitness", "Gaming", "Horreur",
    "Lifestyle", "Mode", "Musique", "Photographie", "Politique",
    "Romance", "Science-fiction", "Sports", "Technologie", "Voyage"
  ];

  const visibilityOptions = [
    { value: "PUBLIC", label: "Public", description: "Tout le monde peut voir cette vidéo" },
    { value: "UNLISTED", label: "Non répertorié", description: "Seules les personnes avec le lien peuvent voir" },
    { value: "PRIVATE", label: "Privé", description: "Seul vous pouvez voir cette vidéo" },
  ]

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  useEffect(() => {
    if (selectedFile) {
      const mockThumbnails = [
        "/placeholder.svg?height=120&width=200&text=Thumbnail 1",
        "/placeholder.svg?height=120&width=200&text=Thumbnail 2",
        "/placeholder.svg?height=120&width=200&text=Thumbnail 3",
      ]
      setFormData((prev) => ({
        ...prev,
        title: prev.title || selectedFile.name.replace(/\.[^/.]+$/, ""),
        generatedThumbnails: mockThumbnails,
      }))
    }
  }, [selectedFile])

  const connectWebSocket = (uploadId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token manquant pour le WebSocket");
      return;
    }

    const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}/upload/${uploadId}/?token=${token}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => console.log("WebSocket connecté");
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setUploadProgress(data.progress);
      setUploadStats({
        uploadedBytes: data.uploaded_bytes || 0,
        totalBytes: data.total_bytes || selectedFile.size,
        uploadSpeed: data.speed || "0 B/s",
        totalDuration: data.total_duration || "00:00",
        remainingDuration: data.remaining_duration || "00:00",
        remainingSize: data.remaining_size || "0 B",
      });
      if (data.status === "completed") {
        setIsFinalizing(false);
        setTimeout(() => {
          handleUploadComplete(data.video_id);
        }, 1000);
      }
    };
    wsRef.current.onclose = () => console.log("WebSocket fermé");
    wsRef.current.onerror = (error) => console.error("Erreur WebSocket :", error);
  };

  const uploadFileInChunks = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setIsFinalizing(false);
    const chunkSize = 5 * 1024 * 1024;
    const totalChunks = Math.ceil(selectedFile.size / chunkSize);
    let uploadId = null;

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, selectedFile.size);
      const chunk = selectedFile.slice(start, end);

      const formDataToSend = new FormData();
      formDataToSend.append("fichier", chunk);
      formDataToSend.append("chunk_number", i);
      formDataToSend.append("total_chunks", totalChunks);
      formDataToSend.append("total_size", selectedFile.size);

      if (i === 0) {
        formDataToSend.append("titre", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("categorie", formData.category);
        formDataToSend.append("visibilite", formData.visibility);
        formDataToSend.append("tags", formData.tags.join(","));
      } else if (uploadId) {
        formDataToSend.append("upload_id", uploadId);
      }

      try {
        const response = await api.post("/videos/chunked-upload/", formDataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (i === 0) {
          uploadId = response.data.upload_id;
          connectWebSocket(uploadId);
        }

        if (i === totalChunks - 1) {
          setIsFinalizing(true);
        }
      } catch (error) {
        console.error("Erreur lors de l'upload :", error);
        setIsUploading(false);
        setIsFinalizing(false);
        return;
      }
    }
  };

  const handleUploadComplete = (videoId) => {
    const newVideo = {
      id: videoId,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      visibility: formData.visibility,
      tags: formData.tags,
      fileName: selectedFile.name,
      fileSize: formatBytes(selectedFile.size),
      uploadDate: new Date().toLocaleDateString("fr-FR"),
      status: formData.visibility === "PUBLIC" ? "Publié" : "Privé",
      views: 0,
      duration: "00:00",
      thumbnail: formData.customThumbnail || formData.generatedThumbnails[0] || "/placeholder.svg?height=120&width=200",
    }
    if (onUploadComplete) onUploadComplete(newVideo)
    handleClose()
    // navigate("/")
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0] && e.dataTransfer.files[0].type.startsWith("video/")) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e) => {
    console.log(e.target.files)
    const file = e.target.files[0]
    console.log(file.name.endsWith(".mkv"));
    if (file && (file.type.startsWith("video/")||file.name.endsWith(".mkv"))) setSelectedFile(file)
  }

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => setFormData((prev) => ({ ...prev, customThumbnail: e.target.result }))
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() && !formData.tags.includes(tagInput.trim()) && formData.tags.length < 10) {
      e.preventDefault()
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }))
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const formatTime = (timeStr) => timeStr || "--:--"

  const handleNextStep = () => {
    if (currentStep === 1 && selectedFile) setCurrentStep(2)
  }

  const handlePreviousStep = () => {
    if (currentStep === 2) setCurrentStep(1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedFile && formData.title && formData.category) uploadFileInChunks()
  }

  const handleClose = () => {
    if (wsRef.current) wsRef.current.close()
    setCurrentStep(1)
    setSelectedFile(null)
    setFormData({
      title: "", description: "", category: "", visibility: "PUBLIC",
      tags: [], customThumbnail: null, generatedThumbnails: [],
    })
    setTagInput("")
    setUploadProgress(0)
    setIsUploading(false)
    setIsFinalizing(false)
    onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <div className="upload-portal-overlay" onClick={(e) => e.target === e.currentTarget && !isUploading && handleClose()}>
      <div className="upload-portal-container">
        <div className="upload-portal-header">
          <div className="upload-portal-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            <h2>Importer une vidéo</h2>
          </div>
          <div className="steps-indicator">
            <div className={`step ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}><span></span></div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}><span></span></div>
          </div>
          {!isUploading && (
            <button className="upload-portal-close" onClick={handleClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </button>
          )}
        </div>
        <div className="upload-portal-content">
          {!isUploading ? (
            <>
              {currentStep === 1 && (
                <div className="step-content">
                  <div className="step-header"><h3>Sélectionnez votre vidéo</h3></div>
                  <div
                    className={`drop-zone ${dragActive ? "drag-active" : ""} ${selectedFile ? "has-file" : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*,video/x-matroska, .mkv"
                      onChange={handleFileSelect}
                      style={{ display: "none" }}
                    />
                    {selectedFile ? (
                      <div className="file-preview">
                        <div className="file-icon">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
                          </svg>
                        </div>
                        <div className="file-info">
                          <h4>{selectedFile.name}</h4>
                          <p>{formatBytes(selectedFile.size)}</p>
                          <div className="file-details">
                            <span>Type: {selectedFile.type}</span>
                            <span>Modifié: {new Date(selectedFile.lastModified).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <button type="button" className="remove-file" onClick={(e) => { e.stopPropagation(); setSelectedFile(null) }}>
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="drop-content">
                        <div className="upload-icon">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
                          </svg>
                        </div>
                        <h3>Glissez-déposez votre vidéo ici</h3>
                        <p>ou cliquez pour sélectionner un fichier</p>
                        <div className="supported-formats">
                          <span>Formats supportés: MP4, AVI, MOV, WMV, MKV (Max: 5GB)</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="step-actions">
                    <button type="button" className="btn-secondary" onClick={handleClose}>Annuler</button>
                    <button type="button" className="btn-primary" disabled={!selectedFile} onClick={handleNextStep}>Suivant</button>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="step-content">
                  <div className="step-header"><h3>Détails de la vidéo</h3></div>
                  <form onSubmit={handleSubmit} className="video-details-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="title">Titre de la vidéo *</label>
                        <input
                          type="text"
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                          placeholder="Donnez un titre accrocheur à votre vidéo"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          placeholder="Décrivez votre vidéo..."
                          rows="4"
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="category">Catégorie *</label>
                        <select
                          id="category"
                          value={formData.category.category}
                          onChange={(e) => handleInputChange("category", e.target.value)}
                          required
                        >
                          <option value="">Sélectionnez une catégorie</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="visibility">Visibilité *</label>
                        <select
                          id="visibility"
                          value={formData.visibility}
                          onChange={(e) => handleInputChange("visibility", e.target.value)}
                        >
                          {visibilityOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        <small className="form-help">
                          {visibilityOptions.find((opt) => opt.value === formData.visibility)?.description}
                        </small>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="tags">Tags</label>
                        <div className="tags-input-container">
                          <div className="tags-list">
                            {formData.tags.map((tag, index) => (
                              <span key={index} className="tag">
                                {tag}
                                <button type="button" onClick={() => handleRemoveTag(tag)} className="tag-remove">×</button>
                              </span>
                            ))}
                          </div>
                          <input
                            type="text"
                            id="tags"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder={formData.tags.length === 0 ? "Ajoutez des tags (Entrée pour valider)" : ""}
                            disabled={formData.tags.length >= 10}
                          />
                        </div>
                        <small className="form-help">{formData.tags.length}/10 tags - Appuyez sur Entrée pour ajouter un tag</small>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Miniature (facultatif)</label>
                        <div className="thumbnails-section">
                          <div className="single-thumbnail-upload">
                            {formData.customThumbnail ? (
                              <div className="thumbnail-preview">
                                <img src={formData.customThumbnail} alt="Miniature personnalisée" />
                                <button type="button" className="thumbnail-remove" onClick={() => handleInputChange("customThumbnail", null)}>×</button>
                              </div>
                            ) : (
                              <div className="thumbnail-upload" onClick={() => thumbnailInputRef.current?.click()}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
                                </svg>
                                <span>Uploader une miniature</span>
                              </div>
                            )}
                          </div>
                          <input
                            ref={thumbnailInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                            style={{ display: "none" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="step-actions">
                      <button type="button" className="btn-secondary" onClick={handlePreviousStep}>Précédent</button>
                      <button type="submit" className="btn-primary" disabled={!formData.title || !formData.category}>Publier la vidéo</button>
                    </div>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="upload-progress-container">
              <div className="upload-file-info">
                <div className="file-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z" />
                  </svg>
                </div>
                <div className="file-details">
                  <h3>{formData.title}</h3>
                  <p>{selectedFile?.name}</p>
                </div>
              </div>
              <div className="progress-section">
                <div className="progress-header">
                  <span className="progress-status">Upload en cours...</span>
                  <span className="progress-percentage">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${uploadProgress}%` }}>
                      <div className="progress-shine"></div>
                    </div>
                  </div>
                </div>
                <div className="upload-stats">
                  <div className="stat-item">
                    <span className="stat-label">Taille:</span>
                    <span className="stat-value">{formatBytes(uploadStats.uploadedBytes)} / {formatBytes(uploadStats.totalBytes)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Vitesse:</span>
                    <span className="stat-value">{uploadStats.uploadSpeed}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Temps restant:</span>
                    <span className="stat-value">{formatTime(uploadStats.remainingDuration)}</span>
                  </div>
                </div>
                {uploadProgress >= 100 && isFinalizing && (
                  <div className="finalizing-loader">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" />
                    </svg>
                    <span>Finalisation de l'upload...</span>
                  </div>
                )}
                {uploadProgress >= 100 && !isFinalizing && (
                  <div className="upload-complete">
                    <div className="success-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
                      </svg>
                    </div>
                    <span>Upload terminé avec succès!</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default VideoUpload