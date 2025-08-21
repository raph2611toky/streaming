"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fade,
  Slide,
  Chip,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  VideoCall as VideoCallIcon,
  LiveTv as LiveTvIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Upload as UploadIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material"
import VideoUploadPortalTwoSteps from "./videoUpload"

function Header({
  setSearchQuery,
  toggleSidebar,
  isLoggedIn,
  handleLogin,
  handleLogout,
  userProfile,
  onUploadComplete,
  onUploadClose,
  onSearchRedirect
}) {
  const [searchInput, setSearchInput] = useState("")
  const [userMenuAnchor, setUserMenuAnchor] = useState(null)
  const [createMenuAnchor, setCreateMenuAnchor] = useState(null)
  const [showLiveModal, setShowLiveModal] = useState(false)
  const [liveTitle, setLiveTitle] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState(null)
  const [showUploadPortal, setShowUploadPortal] = useState(false)
  const [notifications] = useState([
    { id: 1, title: "Nouvelle vidéo de TechChannel", time: "Il y a 2h", read: false },
    { id: 2, title: "Votre vidéo a atteint 1000 vues", time: "Il y a 5h", read: false },
    { id: 3, title: "Nouveau commentaire sur votre vidéo", time: "Il y a 1j", read: true },
    { id: 4, title: "GameChannel a publié une nouvelle vidéo", time: "Il y a 2j", read: true },
  ])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = () => {
    if (searchInput.trim()) {
      if (onSearchRedirect) {
        onSearchRedirect(searchInput)
      } else {
        setSearchQuery(searchInput)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleGoLive = () => {
    if (liveTitle.trim()) {
      alert(`Going live: ${liveTitle}`)
      setShowLiveModal(false)
      setLiveTitle("")
    }
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  const handleCreateMenuClose = () => {
    setCreateMenuAnchor(null)
  }

  const handleNotificationMenuClose = () => {
    setNotificationMenuAnchor(null)
  }

  const handleUploadClick = () => {
    setShowUploadPortal(true)
    handleCreateMenuClose()
  }

  const handleUploadComplete = (newVideo) => {
    if (onUploadComplete) {
      onUploadComplete(newVideo)
    }
  }

  // Determine avatar content: profile image, first letter of name, or default
  const avatarContent = () => {
    if (!isLoggedIn || !userProfile) {
      return "U"
    }
    if (userProfile.profile_url && !userProfile.profile_url.includes("default.png")) {
      return (
        <img
          src={userProfile.profile_url || "/placeholder.svg"}
          alt="Profile"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )
    }
    return userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"
  }

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
          zIndex: 1300,
          padding: "10px",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: "64px !important",
            px: { xs: 2, md: 3 },
          }}
        >
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 200 }}>
            <IconButton
              onClick={toggleSidebar}
              sx={{
                color: "#fff",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.95)",
                  color: "#0f0f0f",
                  backdropFilter: "blur(10px)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              onClick={() => navigate("/")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                "&:hover": {
                  "& .logo-text": {
                    color: "#fff",
                  },
                },
              }}
            >
              <Box
                sx={{
                  fontSize: "24px",
                  color: "#ff0000",
                  fontWeight: 700,
                  alignItems: "center",
                }}
              >
                <img
                  src="/logo.svg"
                  alt="PlayerStreaming Logo"
                  style={{
                    height: "25px",
                    width: "auto",
                  }}
                />
              </Box>
              <Box
                className="logo-text"
                sx={{
                  fontSize: "20px",
                  fontWeight: 500,
                  color: "#fff",
                  fontFamily: "'Roboto', sans-serif",
                  transition: "color 0.2s ease",
                }}
              >
                PlayerStreaming
              </Box>
            </Box>
          </Box>

          {/* Search Section */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              maxWidth: 600,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                maxWidth: 540,
              }}
            >
              <InputBase
                placeholder="Rechercher..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                sx={{
                  flex: 1,
                  bgcolor: "#121212",
                  border: searchFocused ? "1px solid #1c62b9" : "1px solid #303030",
                  borderRadius: "20px 0 0 20px",
                  borderRight: "none",
                  px: 2,
                  py: 0.75,
                  color: "#fff",
                  fontSize: "16px",
                  fontFamily: "'Roboto', sans-serif",
                  "&::placeholder": {
                    color: "#aaa",
                  },
                }}
              />
              <IconButton
                onClick={handleSearch}
                sx={{
                  bgcolor: "#303030",
                  border: searchFocused ? "1px solid #1c62b9" : "1px solid #303030",
                  borderLeft: "none",
                  borderRadius: "0 20px 20px 0",
                  color: "#fff",
                  px: 2.5,
                  py: 1.25,
                  "&:hover": {
                    bgcolor: "#404040",
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Right Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 200, justifyContent: "flex-end" }}>
            {isLoggedIn && (
              <>
                <IconButton
                  onClick={(e) => setCreateMenuAnchor(e.currentTarget)}
                  sx={{
                    color: "#fff",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.95)",
                      color: "#0f0f0f",
                      backdropFilter: "blur(10px)",
                    },
                  }}
                >
                  <VideoCallIcon />
                </IconButton>
              </>
            )}

            {isLoggedIn ? (
              <IconButton onClick={(e) => setUserMenuAnchor(e.currentTarget)} sx={{ p: 0.5 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#606060",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {avatarContent()}
                </Avatar>
              </IconButton>
            ) : (
              <Button
                onClick={handleLogin}
                startIcon={<PersonIcon />}
                sx={{
                  color: "#ffd700",
                  border: "1px solid #ffd700",
                  borderRadius: "18px",
                  px: 2,
                  py: 0.5,
                  fontWeight: 500,
                  textTransform: "none",
                  fontSize: "14px",
                  fontFamily: "'Roboto', sans-serif",
                  "&:hover": {
                    bgcolor: "rgba(255, 215, 0, 0.1)",
                  },
                }}
              >
                Se connecter
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Create Menu */}
      <Menu
        anchorEl={createMenuAnchor}
        open={Boolean(createMenuAnchor)}
        onClose={handleCreateMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            bgcolor: "rgba(33, 33, 33, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 2,
            mt: 1,
            minWidth: 200,
          },
        }}
      >
        <MenuItem
          onClick={handleUploadClick}
          sx={{
            color: "#fff",
            py: 1.5,
            px: 2,
            fontFamily: "'Roboto', sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.95)",
              color: "#0f0f0f",
              backdropFilter: "blur(10px)",
            },
          }}
        >
          <UploadIcon sx={{ mr: 2, fontSize: "20px" }} />
          Importer une vidéo
        </MenuItem>
        <MenuItem
          onClick={() => {
            setShowLiveModal(true)
            handleCreateMenuClose()
          }}
          sx={{
            color: "#fff",
            py: 1.5,
            px: 2,
            fontFamily: "'Roboto', sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.95)",
              color: "#0f0f0f",
              backdropFilter: "blur(10px)",
            },
          }}
        >
          <LiveTvIcon sx={{ mr: 2, fontSize: "20px" }} />
          Passer en direct
        </MenuItem>
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            bgcolor: "rgba(33, 33, 33, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 2,
            mt: 1,
            minWidth: 280,
            maxHeight: 400,
            overflowY: "auto",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            // navigate("/settings")
            handleUserMenuClose()
          }}
          sx={{
            color: "#fff",
            py: 1.5,
            px: 2,
            fontFamily: "'Roboto', sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.95)",
              color: "#0f0f0f",
              backdropFilter: "blur(10px)",
            },
          }}
        >
          <SettingsIcon sx={{ mr: 2, fontSize: "20px" }} />
          Paramètres
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleLogout()
            handleUserMenuClose()
          }}
          sx={{
            color: "#fff",
            py: 1.5,
            px: 2,
            fontFamily: "'Roboto', sans-serif",
            fontSize: "14px",
            fontWeight: 400,
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.95)",
              color: "#0f0f0f",
              backdropFilter: "blur(10px)",
            },
          }}
        >
          <LogoutIcon sx={{ mr: 2, fontSize: "20px" }} />
          Se déconnecter
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationMenuAnchor}
        open={Boolean(notificationMenuAnchor)}
        onClose={handleNotificationMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            bgcolor: "rgba(33, 33, 33, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 2,
            mt: 1,
            minWidth: 360,
            maxHeight: 400,
            overflowY: "auto",
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <Box sx={{ color: "#fff", fontWeight: 500, fontSize: "16px", fontFamily: "'Roboto', sans-serif" }}>
            Notifications
          </Box>
        </Box>
        {notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={handleNotificationMenuClose}
            sx={{
              color: "#fff",
              py: 1.5,
              px: 2,
              borderLeft: notification.read ? "none" : "3px solid #3ea6ff",
              bgcolor: notification.read ? "transparent" : "rgba(62, 166, 255, 0.05)",
              fontFamily: "'Roboto', sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.95)",
                color: "#0f0f0f",
                backdropFilter: "blur(10px)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, width: "100%" }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#606060",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {notification.title.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    fontSize: "14px",
                    fontWeight: notification.read ? 400 : 500,
                    lineHeight: 1.3,
                    mb: 0.5,
                  }}
                >
                  {notification.title}
                </Box>
                <Box
                  sx={{
                    fontSize: "12px",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  {notification.time}
                </Box>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* Live Modal */}
      <Dialog
        open={showLiveModal}
        onClose={() => setShowLiveModal(false)}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
        PaperProps={{
          sx: {
            bgcolor: "#212121",
            color: "#fff",
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#fff",
            fontWeight: 500,
            fontSize: "20px",
            fontFamily: "'Roboto', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 2,
            pb: 1,
          }}
        >
          <LiveTvIcon />
          Passer en direct
          <Chip
            label="LIVE"
            size="small"
            sx={{
              bgcolor: "#ff0000",
              color: "#fff",
              fontWeight: 600,
              fontSize: "10px",
            }}
          />
          <IconButton
            onClick={() => setShowLiveModal(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#aaa",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            placeholder="Titre du direct"
            value={liveTitle}
            onChange={(e) => setLiveTitle(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                bgcolor: "#121212",
                fontFamily: "'Roboto', sans-serif",
                "& fieldset": {
                  borderColor: "#303030",
                },
                "&:hover fieldset": {
                  borderColor: "#aaa",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3ea6ff",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setShowLiveModal(false)}
            sx={{
              color: "#aaa",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleGoLive}
            disabled={!liveTitle.trim()}
            sx={{
              bgcolor: "#ff0000",
              color: "#fff",
              fontWeight: 500,
              fontFamily: "'Roboto', sans-serif",
              px: 3,
              "&:hover": {
                bgcolor: "#cc0000",
              },
              "&:disabled": {
                bgcolor: "#404040",
                color: "#666",
              },
            }}
          >
            Commencer
          </Button>
        </DialogActions>
      </Dialog>

     
      <VideoUploadPortalTwoSteps
        isOpen={showUploadPortal}
        onClose={() => {
        setShowUploadPortal(false)
        onUploadClose()
      }}
        onUploadComplete={handleUploadComplete}
      />
    </>
  )
}

export default Header
