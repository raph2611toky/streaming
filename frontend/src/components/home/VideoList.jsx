// VideoList.jsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Box, Chip, Typography } from "@mui/material"
import VideoCard from "./VideoCard"
import VideoSkeleton from "./VideoSkeleton"
import api from "../../services/Api"

function VideoList({ searchQuery, category, setCategory, apiEndpoint }) {
  const [allVideos, setAllVideos] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [categories, setCategories] = useState(["Tous"])
  const [loading, setLoading] = useState(true)
  const wsRef = useRef(null)

  // Fetch videos via HTTP
  const fetchVideos = async () => {
    setLoading(true)
    try {
      let response
      const params = {}
      const headers = {}
      const token = localStorage.getItem("token")
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      // Handle special endpoints that don't use searchQuery or category
      if (["/historique/vues/", "/videos/liked/", "/videos/watch-later/"].includes(apiEndpoint)) {
        if (!token) {
          setFilteredVideos([])
          setCategories(["Tous"])
          setLoading(false)
          return
        }
        response = await api.get(apiEndpoint, { headers })
      } else {
        if (searchQuery) params.search_term = searchQuery
        if (category !== "Tous") params.categorie = category

        response = await api.get('/videos/search', {
          params,
          headers,
        })
      }

      const videos = response.data
      setAllVideos(videos)
      const uniqueCategories = ["Tous", ...new Set(videos.map((video) => video.categorie))]
      setCategories(apiEndpoint === "/videos/" ? uniqueCategories : ["Tous"]) // Only show categories for /videos/
      setFilteredVideos(
        videos.map((video) => ({
          id: video.id,
          code_id: video.code_id,
          thumbnail: video.affichage_url,
          title: video.titre,
          channelAvatar: video.envoyeur.profile_url,
          channelTitle: video.envoyeur.name,
          viewCount: video.vues_formatted,
          uploadTime: video.elapsed_time,
          duration: video.duration,
          isLive: video.visibilite === "LIVE",
          isShort: parseDuration(video.duration) < 60,
          isVerified: false,
        }))
      )
    } catch (error) {
      console.error("Error fetching videos:", error)
      if (error.response?.status === 401) {
        setFilteredVideos([])
        setCategories(["Tous"])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [searchQuery, category, apiEndpoint])

  // WebSocket for real-time updates
  useEffect(() => {
    const token = localStorage.getItem("token")
    let wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}/videos/`
    if (token) {
      wsUrl += `?token=${token}`
    }
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log("WebSocket connected for VideoList")
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (["video_created", "video_updated", "video_deleted"].includes(data.type)) {
        fetchVideos()
      }
    }

    ws.onclose = () => console.log("WebSocket disconnected")
    ws.onerror = (error) => console.error("WebSocket error:", error)

    return () => {
      ws.close()
    }
  }, [])

  const parseDuration = (duration) => {
    const [hours, minutes, seconds] = duration.split(":").map(Number)
    return hours * 3600 + minutes * 60 + seconds
  }

  const handleCategoryClick = (item) => {
    setCategory(item)
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
        minHeight: "calc(100vh - 64px)",
        width: "100%",
      }}
      
    >
      {/* Filters Section (only show for /videos/ endpoint) */}
      {apiEndpoint === "/videos/" && (
        <Box
          sx={{
            px: 3,
            py: 2,
            position: "sticky",
            top: "64px",
            zIndex: 10,
            background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              maxWidth: "1280px",
              margin: "20px auto 0 auto",
              pb: 1,
              overflowX: "auto",
              "&::-webkit-scrollbar": {
                height: "4px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(255, 255, 255, 0.2)",
                borderRadius: "2px",
              },
            }}
          >
            {categories.map((item) => (
              <Chip
                key={item}
                label={item}
                clickable
                onClick={() => handleCategoryClick(item)}
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "14px",
                  fontWeight: 400,
                  height: "32px",
                  borderRadius: "16px",
                  bgcolor: category === item ? "#fff" : "rgba(255, 255, 255, 0.1)",
                  color: category === item ? "#0f0f0f" : "#fff",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    bgcolor: category === item ? "#f1f1f1" : "rgba(0, 0, 0, 0.9)",
                    color: category === item ? "#0f0f0f" : "#fff",
                    backdropFilter: "blur(10px)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Videos Grid */}
      <Box sx={{ px: 3, py: 3 }}>
        {loading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
              gap: "24px",
              maxWidth: "1280px",
              margin: "0 auto",
            }}
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <VideoSkeleton key={index} />
            ))}
          </Box>
        ) : filteredVideos.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 400,
                textAlign: "center",
              }}
            >
              Aucune vidéo trouvée
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
              gap: "34px",
              maxWidth: "1280px",
              margin: "0 auto",
            }}
          >
            {filteredVideos.map((video, index) => (
              <Box
                key={video.id}
                sx={{
                  opacity: 1,
                  transform: "translateY(0)",
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  "@keyframes fadeInUp": {
                    from: {
                      opacity: 0,
                      transform: "translateY(30px)",
                    },
                    to: {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                }}
              >
                <VideoCard video={video} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default VideoList