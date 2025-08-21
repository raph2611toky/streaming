"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import VideoUploadTriggerTwoSteps from "./videoUpload"
import VideoManagementTable from "./video-management-table"
import { useNavigate } from "react-router-dom"
import api from "../../services/Api"
import "./user-dashboard.css"

const FinalUserDashboard = (video_length=0) => {
  const [videos, setVideos] = useState([])
  const navigate = useNavigate()
  const wsRef = useRef(null)

  // const fetchVideos = async () => {
  //   const token = localStorage.getItem("token")
  //   if (!token) {
  //     navigate("/login")
  //     return
  //   }
  //   try {
  //     const response = await api.get("/videos/mes/", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     const mappedVideos = response.data.map((video) => ({
  //       id: video.id,
  //       title: video.titre,
  //       description: video.description,
  //       category: video.categorie || "Non catégorisé",
  //       visibility: video.visibilite.toLowerCase(),
  //       tags: video.tags.map((tag) => tag.name),
  //       fileName: video.fichier_url ? video.fichier_url.split("/").pop() : "unknown.mp4",
  //       fileSize: video.taille || "Unknown",
  //       uploadDate: new Date(video.uploaded_at).toLocaleDateString("fr-FR", {
  //         day: "2-digit",
  //         month: "2-digit",
  //         year: "numeric",
  //       }),
  //       status:
  //         video.visibilite === "PUBLIC"
  //           ? "Publié"
  //           : video.visibilite === "PRIVATE"
  //           ? "Privé"
  //           : "Brouillon",
  //       views: video.vues_count || 0,
  //       duration: video.duration || "00:00",
  //       thumbnail: video.affichage_url || "/placeholder.svg?height=120&width=200",
  //     }))
  //     setVideos(mappedVideos)
  //   } catch (error) {
  //     console.error("Error fetching videos:", error)
  //     alert("Erreur lors du chargement des vidéos")
  //   }
  // }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }
    const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}/videos/?token=${token}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log("WebSocket connected for Dashboard")
      ws.send(JSON.stringify({ type: "list_my_videos", params: {} }))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.status === "success") {
        const mappedVideos = data.data.map((video) => ({
          id: video.id,
          title: video.titre,
          description: video.description,
          category: video.categorie || "Non catégorisé",
          visibility: video.visibilite.toLowerCase(),
          tags: video.tags.map((tag) => tag.name),
          fileName: video.fichier_url ? video.fichier_url.split("/").pop() : "unknown.mp4",
          fileSize: video.taille || "Unknown",
          uploadDate: new Date(video.uploaded_at).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          status:
            video.visibilite === "PUBLIC"
              ? "Publié"
              : video.visibilite === "PRIVATE"
              ? "Privé"
              : "Brouillon",
          views: video.vues_count || 0,
          duration: video.duration || "00:00",
          thumbnail: video.affichage_url || "/placeholder.svg?height=120&width=200",
        }))
        setVideos(mappedVideos)
      } else if (data.type === "video_created") {
        const newVideo = {
          id: data.video.id,
          title: data.video.titre,
          description: data.video.description,
          category: data.video.categorie || "Non catégorisé",
          visibility: data.video.visibilite.toLowerCase(),
          tags: data.video.tags.map((tag) => tag.name),
          fileName: data.video.fichier_url ? data.video.fichier_url.split("/").pop() : "unknown.mp4",
          fileSize: data.video.taille || "Unknown",
          uploadDate: new Date(data.video.uploaded_at).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          status:
            data.video.visibilite === "PUBLIC"
              ? "Publié"
              : data.video.visibilite === "PRIVATE"
              ? "Privé"
              : "Brouillon",
          views: data.video.vues_count || 0,
          duration: data.video.duration || "00:00",
          thumbnail: data.video.affichage_url || "/placeholder.svg?height=120&width=200",
        }
        setVideos((prev) => {
          const exists = prev.some((v) => v.id === newVideo.id)
          if (exists) {
            return prev.map((v) => (v.id === newVideo.id ? newVideo : v))
          } else {
            return [newVideo, ...prev]
          }
        })
      } else if (data.type === "video_updated") {
        const updatedVideo = {
          id: data.video.id,
          title: data.video.titre,
          description: data.video.description,
          category: data.video.categorie || "Non catégorisé",
          visibility: data.video.visibilite.toLowerCase(),
          tags: data.video.tags.map((tag) => tag.name),
          fileName: data.video.fichier_url ? data.video.fichier_url.split("/").pop() : "unknown.mp4",
          fileSize: data.video.taille || "Unknown",
          uploadDate: new Date(data.video.uploaded_at).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          status:
            data.video.visibilite === "PUBLIC"
              ? "Publié"
              : data.video.visibilite === "PRIVATE"
              ? "Privé"
              : "Brouillon",
          views: data.video.vues_count || 0,
          duration: data.video.duration || "00:00",
          thumbnail: data.video.affichage_url || "/placeholder.svg?height=120&width=200",
        }
        setVideos((prev) => prev.map((v) => (v.id === updatedVideo.id ? updatedVideo : v)))
      } else if (data.type === "video_deleted") {
        const videoId = data.video_id
        setVideos((prev) => prev.filter((v) => v.id !== videoId))
      }
    }

    ws.onclose = () => console.log("WebSocket disconnected")
    ws.onerror = (error) => console.error("WebSocket error:", error)

    return () => {
      ws.close()
    }
  }, [])

  // Removed useEffect that called fetchVideos
  // useEffect(() => {
  //   fetchVideos()
  // }, [video_length])

  const handleUploadComplete = (newVideo) => {
    const mappedVideo = {
      id: newVideo.id,
      title: newVideo.titre,
      description: newVideo.description,
      category: newVideo.categorie || "Non catégorisé",
      visibility: newVideo.visibilite.toLowerCase(),
      tags: newVideo.tags.map((tag) => tag.name),
      fileName: newVideo.fichier_url ? newVideo.fichier_url.split("/").pop() : "unknown.mp4",
      fileSize: newVideo.taille || "Unknown",
      uploadDate: new Date(newVideo.uploaded_at).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      status:
        newVideo.visibilite === "PUBLIC"
          ? "Publié"
          : newVideo.visibilite === "PRIVATE"
          ? "Privé"
          : "Brouillon",
      views: newVideo.vues_count || 0,
      duration: newVideo.duration || "00:00",
      thumbnail: newVideo.affichage_url || "/placeholder.svg?height=120&width=200",
    }
    setVideos((prev) => {
      const exists = prev.some((v) => v.id === mappedVideo.id)
      if (!exists) {
        return [mappedVideo, ...prev]
      }
      return prev
    })
  }

  const handleEditVideo = (video) => {
    console.log("Edit video:", video)
    // Placeholder for future implementation
  }

  const handleDeleteVideo = async (video) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${video.title}" ?`)) {
      try {
        const token = localStorage.getItem("token")
        await axios.delete(`/api/videos/${video.id}/delete/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        // List will refresh via WebSocket broadcast
      } catch (error) {
        console.error("Error deleting video:", error)
        alert("Erreur lors de la suppression de la vidéo")
      }
    }
  }

  const handleToggleStatus = async (video) => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }
    const newStatus = video.status === "Publié" ? "Privé" : "Publié"
    const newVisibilite = newStatus === "Publié" ? "PUBLIC" : "PRIVATE"
    try {
      await axios.patch(
        `/api/videos/${video.id}/update/`,
        { visibilite: newVisibilite },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      // List will refresh via WebSocket broadcast
    } catch (error) {
      console.error("Error updating video status:", error)
      alert("Erreur lors de la mise à jour du statut")
    }
  }

  const getStats = () => {
    const totalViews = videos.reduce((sum, video) => sum + video.views, 0)
    const publishedVideos = videos.filter((v) => v.status === "Publié").length
    const draftVideos = videos.filter((v) => v.status === "Brouillon").length
    return { totalViews, publishedVideos, draftVideos }
  }

  const stats = getStats()

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Tableau de bord créateur</h1>
          <p>Gérez vos vidéos et suivez vos performances</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-value">{videos.length}</div>
            <div className="stat-label">Vidéos totales</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.publishedVideos}</div>
            <div className="stat-label">Publiées</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalViews.toLocaleString()}</div>
            <div className="stat-label">Vues totales</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.draftVideos}</div>
            <div className="stat-label">Brouillons</div>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <VideoUploadTriggerTwoSteps onUploadComplete={handleUploadComplete} />
      </div>

      <div className="dashboard-content">
        <VideoManagementTable
          videos={videos}
          onEdit={handleEditVideo}
          onDelete={handleDeleteVideo}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </div>
  )
}

export default FinalUserDashboard