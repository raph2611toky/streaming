// Home.jsx
"use client"

import { useState, useEffect } from "react"
import { Box, Button, Typography } from "@mui/material"
import Header from "./Header"
import Sidebar from "./Sidebar"
import VideoList from "./VideoList"
import FinalUserDashboard from "./final-user-dashboard"
import { useNavigate } from "react-router-dom"
import api from "../../services/Api"
import "./Home.css"

function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("Tous")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [currentView, setCurrentView] = useState("videos")
  const [apiEndpoint, setApiEndpoint] = useState("/videos/") // Default endpoint
  const [videos, setVideos] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true)
      fetchUserProfile(token)
    } else {
      setIsLoggedIn(false)
      setUserProfile(null)
    }
  }, [])

  const fetchVideos = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
      return
    }
    try {
      const response = await api.get("/videos/mes/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const mappedVideos = response.data.map((video) => ({
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
    } catch (error) {
      console.error("Error fetching videos:", error)
      alert("Erreur lors du chargement des vidéos")
    }
  }

  const fetchUserProfile = async (token) => {
    try {
      const response = await api.get("/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUserProfile(response.data)
    } catch (error) {
      console.error("Error fetching user profile:", error)
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        setIsLoggedIn(false)
        setUserProfile(null)
        navigate("/login")
      }
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleLogin = () => {
    navigate("/login")
  }

  const handleLogout = async () => {
    try {
      await api.post("/logout/", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
      localStorage.removeItem("token")
      setIsLoggedIn(false)
      setUserProfile(null)
      navigate("/")
    }
  }

  const handleViewChange = (view, endpoint = "/videos/") => {
    setCurrentView(view)
    setApiEndpoint(endpoint)
  }

  const handleUploadClose = () => {
    fetchVideos()
    setCurrentView("dashboard")
  }

  const handleSearchRedirect = (query) => {
    setSearchQuery(query)
    setCurrentView("videos")
    setApiEndpoint("/videos/")
    setCategory("Tous")
  }

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#0f0f0f",
        minHeight: "100vh",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <Header
        setSearchQuery={setSearchQuery}
        toggleSidebar={toggleSidebar}
        isLoggedIn={isLoggedIn}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        userProfile={userProfile}
        onUploadClose={handleUploadClose}
        onSearchRedirect={handleSearchRedirect}
      />

      <div className="Video-list-container">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setSearchQuery={setSearchQuery}
          setCategory={setCategory}
          category={category}
          handleViewChange={handleViewChange}
          currentView={currentView}
        />

        <Box
          component="main"
          sx={{
            flex: 1,
            ml: { xs: 0, sm: isSidebarOpen ? "240px" : "72px" },
            transition: "margin-left 0.2s ease",
            background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
            minHeight: "100vh",
            pt: "64px",
            pl: 0,
          }}
        >
          {currentView === "videos" ? (
            <VideoList
              searchQuery={searchQuery}
              category={category}
              setCategory={setCategory}
              apiEndpoint={apiEndpoint}
            />
          ) : isLoggedIn ? (
            <FinalUserDashboard videos={videos} />
          ) : (
            <Box sx={{ p: 3, color: "#fff" }}>
              <Typography variant="h6">Veuillez vous connecter pour voir vos vidéos.</Typography>
              <Button onClick={handleLogin} variant="contained" sx={{ mt: 2 }}>
                Se connecter
              </Button>
            </Box>
          )}
        </Box>
      </div>
    </Box>
  )
}

export default Home