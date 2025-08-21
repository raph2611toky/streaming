// Sidebar.jsx
"use client"

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  Box,
  Typography,
} from "@mui/material"
import {
  Home as HomeIcon,
  PlayArrow as ShortsIcon,
  Subscriptions as SubscriptionsIcon,
  History as HistoryIcon,
  VideoLibrary as VideoLibraryIcon,
  WatchLater as WatchLaterIcon,
  ThumbUp as LikedIcon,
  TrendingUp as TrendingIcon,
  MusicNote as MusicIcon,
  SportsEsports as GamingIcon,
  Movie as MoviesIcon,
  LiveTv as LiveIcon,
} from "@mui/icons-material"

const drawerWidth = 240
const miniDrawerWidth = 72

function Sidebar({ isSidebarOpen, setSearchQuery, setCategory, category, handleViewChange, currentView }) {
  const mainItems = [
    { text: "Accueil", icon: <HomeIcon />, category: "Tous", apiEndpoint: "/videos/" },
    // { text: "Shorts", icon: <ShortsIcon />, category: "Shorts", apiEndpoint: "/videos/search/" },
    { text: "Abonnements", icon: <SubscriptionsIcon />, category: "Subscriptions", apiEndpoint: "/videos/search/" },
  ]

  const libraryItems = [
    { text: "Historique", icon: <HistoryIcon />, category: "History", apiEndpoint: "/historique/vues/" },
    { text: "Mes vidéos", icon: <VideoLibraryIcon />, category: "My Videos", apiEndpoint: null }, 
    // { text: "À regarder plus tard", icon: <WatchLaterIcon />, category: "Watch Later", apiEndpoint: "/videos/watch-later/" },
    { text: "Vidéos likées", icon: <LikedIcon />, category: "Liked", apiEndpoint: "/videos/liked/" },
  ]

  const exploreItems = [
    { text: "Tendances", icon: <TrendingIcon />, category: "Trending", apiEndpoint: "/videos/search/" },
    { text: "Musique", icon: <MusicIcon />, category: "Musique", apiEndpoint: "/videos/search/" },
    { text: "Gaming", icon: <GamingIcon />, category: "Gaming", apiEndpoint: "/videos/search/" },
    { text: "Films", icon: <MoviesIcon />, category: "Movies", apiEndpoint: "/videos/search/" },
    { text: "En direct", icon: <LiveIcon />, category: "Live", apiEndpoint: "/videos/search/" },
  ]

  const handleItemClick = (item) => {
    if (item.text === "Accueil") {
      setSearchQuery("")
      setCategory("Tous")
      handleViewChange("videos", item.apiEndpoint)
    } else if (item.text === "Mes vidéos") {
      handleViewChange("dashboard")
    } else {
      setCategory(item.category)
      handleViewChange("videos", item.apiEndpoint)
    }
  }

  const isActive = (item) => {
    if (currentView === "dashboard" && item.text === "Mes vidéos") {
      return true
    } else if (currentView === "videos") {
      return item.category === category
    }
    return false
  }

  const renderMenuSection = (items, title = null) => (
    <>
      {title && isSidebarOpen && (
        <Box sx={{ px: 3, py: 1 }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: "#aaa",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: "'Roboto', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {title}
          </Typography>
        </Box>
      )}
      {items.map((item) => (
        <ListItem key={item.text} disablePadding>
          <Tooltip
            title={!isSidebarOpen ? item.text : ""}
            placement="right"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "rgba(97, 97, 97, 0.95)",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 400,
                  fontFamily: "'Roboto', sans-serif",
                  backdropFilter: "blur(10px)",
                },
              },
            }}
          >
            <ListItemButton
              onClick={() => handleItemClick(item)}
              sx={{
                minHeight: 40,
                justifyContent: isSidebarOpen ? "initial" : "center",
                px: isSidebarOpen ? 3 : 2,
                mx: 1,
                borderRadius: 2,
                transition: "all 0.2s ease",
                bgcolor: isActive(item) ? "rgba(255, 255, 255, 0.2)" : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  transform: "translateX(4px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  "& .MuiListItemIcon-root": {
                    color: "#ffd700",
                    transform: "scale(1.1)",
                  },
                  "& .MuiListItemText-primary": {
                    color: "#ffd700",
                    fontWeight: 400,
                  },
                },
                "&:focus": {
                  "& .MuiListItemIcon-root": {
                    color: "#ffd700",
                    transform: "scale(1.1)",
                  },
                  "& .MuiListItemText-primary": {
                    color: "#ffd700",
                    fontWeight: 400,
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isSidebarOpen ? 3 : "auto",
                  justifyContent: "center",
                  color: isActive(item) ? "#ffd700" : "rgba(255, 255, 255, 0.8)",
                  transition: "all 0.2s ease",
                  "& svg": {
                    fontSize: "20px",
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
              {isSidebarOpen && (
                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiListItemText-primary": {
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: isActive(item) ? "#ffd700" : "rgba(255, 255, 255, 0.8)",
                      transition: "all 0.2s ease",
                    },
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      ))}
    </>
  )

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isSidebarOpen ? drawerWidth : miniDrawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isSidebarOpen ? drawerWidth : miniDrawerWidth,
          boxSizing: "border-box",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
          border: "none",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          transition: "width 0.2s ease",
          overflowX: "hidden",
          mt: "64px",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "2px",
          },
        },
      }}
    >
      <List sx={{ padding: "8px 0", paddingTop: "35px" }}>
        {renderMenuSection(mainItems)}
        {isSidebarOpen && <Divider sx={{ my: 1, bgcolor: "rgba(255, 255, 255, 0.1)" }} />}
        {renderMenuSection(libraryItems, isSidebarOpen ? "Bibliothèque" : null)}
        {isSidebarOpen && <Divider sx={{ my: 1, bgcolor: "rgba(255, 255, 255, 0.1)" }} />}
        {renderMenuSection(exploreItems, isSidebarOpen ? "Explorer" : null)}
      </List>
    </Drawer>
  )
}

export default Sidebar