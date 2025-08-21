"use client"

import { useState } from "react"
import "./sidebar.css"

function Sidebar() {
  const [activeSection, setActiveSection] = useState("home")
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: "home", icon: "🏠", label: "Accueil" },
    { id: "trending", icon: "🔥", label: "Tendances" },
    { id: "subscriptions", icon: "📺", label: "Abonnements" },
    { id: "library", icon: "📚", label: "Bibliothèque" },
    { id: "history", icon: "🕒", label: "Historique" },
    { id: "watchlater", icon: "⏰", label: "À regarder plus tard" },
    { id: "liked", icon: "👍", label: "Vidéos likées" },
    { id: "downloads", icon: "⬇️", label: "Téléchargements" },
  ]

  const categories = [
    { id: "music", icon: "🎵", label: "Musique" },
    { id: "gaming", icon: "🎮", label: "Gaming" },
    { id: "news", icon: "📰", label: "Actualités" },
    { id: "sports", icon: "⚽", label: "Sport" },
    { id: "education", icon: "🎓", label: "Éducation" },
    { id: "movies", icon: "🎬", label: "Films" },
    { id: "tech", icon: "💻", label: "Technologie" },
    { id: "cooking", icon: "👨‍🍳", label: "Cuisine" },
  ]

  const subscriptions = [
    { id: 1, name: "Dev Academy", avatar: "/placeholder.svg?height=24&width=24", isLive: false },
    { id: 2, name: "Code Master", avatar: "/placeholder.svg?height=24&width=24", isLive: true },
    { id: 3, name: "Web Design Pro", avatar: "/placeholder.svg?height=24&width=24", isLive: false },
    { id: 4, name: "Tech Reviews", avatar: "/placeholder.svg?height=24&width=24", isLive: false },
    { id: 5, name: "JavaScript Ninja", avatar: "/placeholder.svg?height=24&width=24", isLive: true },
    { id: 6, name: "React Tutorials", avatar: "/placeholder.svg?height=24&width=24", isLive: false },
  ]

  const playlists = [
    { id: 1, name: "Tutoriels React", count: 25 },
    { id: 2, name: "JavaScript Avancé", count: 18 },
    { id: 3, name: "CSS Animations", count: 12 },
    { id: 4, name: "Node.js Backend", count: 30 },
    { id: 5, name: "Projets Complets", count: 8 },
  ]

  const recentVideos = [
    {
      id: 1,
      title: "React Hooks Explained",
      channel: "Dev Academy",
      thumbnail: "/placeholder.svg?height=60&width=100",
      duration: "15:30",
      views: "125K",
    },
    {
      id: 2,
      title: "CSS Grid Layout",
      channel: "Web Design Pro",
      thumbnail: "/placeholder.svg?height=60&width=100",
      duration: "12:45",
      views: "89K",
    },
    {
      id: 3,
      title: "JavaScript ES6",
      channel: "Code Master",
      thumbnail: "/placeholder.svg?height=60&width=100",
      duration: "18:20",
      views: "67K",
    },
  ]

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          ☰
        </button>
        {!isCollapsed && (
          <div className="logo">
            <span className="logo-icon">📺</span>
            <span className="logo-text">StreamTube</span>
          </div>
        )}
      </div>

      <div className="sidebar-content">
        <nav className="sidebar-nav">
          <div className="nav-section">
            {menuItems.slice(0, 4).map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isCollapsed && <span className="nav-label">{item.label}</span>}
              </button>
            ))}
          </div>

          {!isCollapsed && (
            <>
              <div className="nav-divider"></div>

              <div className="nav-section">
                <h3 className="section-title">Vous</h3>
                {menuItems.slice(4).map((item) => (
                  <button
                    key={item.id}
                    className={`nav-item ${activeSection === item.id ? "active" : ""}`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="nav-divider"></div>

              <div className="nav-section">
                <h3 className="section-title">Abonnements</h3>
                <div className="subscriptions-list">
                  {subscriptions.map((sub) => (
                    <button key={sub.id} className="subscription-item">
                      <img src={sub.avatar || "/placeholder.svg"} alt={sub.name} className="subscription-avatar" />
                      <span className="subscription-name">{sub.name}</span>
                      {sub.isLive && <span className="live-indicator">🔴</span>}
                    </button>
                  ))}
                </div>
                <button className="show-more-btn">Afficher plus</button>
              </div>

              <div className="nav-divider"></div>

              <div className="nav-section">
                <h3 className="section-title">Explorer</h3>
                {categories.map((category) => (
                  <button key={category.id} className="nav-item" onClick={() => setActiveSection(category.id)}>
                    <span className="nav-icon">{category.icon}</span>
                    <span className="nav-label">{category.label}</span>
                  </button>
                ))}
              </div>

              <div className="nav-divider"></div>

              <div className="nav-section">
                <h3 className="section-title">Playlists</h3>
                <div className="playlists-list">
                  {playlists.map((playlist) => (
                    <button key={playlist.id} className="playlist-item">
                      <span className="playlist-icon">📋</span>
                      <div className="playlist-info">
                        <span className="playlist-name">{playlist.name}</span>
                        <span className="playlist-count">{playlist.count} vidéos</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="nav-divider"></div>

              <div className="nav-section">
                <h3 className="section-title">Récemment regardées</h3>
                <div className="recent-videos">
                  {recentVideos.map((video) => (
                    <div key={video.id} className="recent-video-item">
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="recent-video-thumbnail"
                      />
                      <div className="recent-video-info">
                        <h4 className="recent-video-title">{video.title}</h4>
                        <p className="recent-video-channel">{video.channel}</p>
                        <p className="recent-video-meta">
                          {video.views} vues • {video.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="nav-divider"></div>

              <div className="nav-section">
                <div className="sidebar-footer">
                  <p className="footer-text">À propos Presse Droits d'auteur</p>
                  <p className="footer-text">Nous contacter Créateurs</p>
                  <p className="footer-text">Publicité Développeurs</p>
                  <p className="footer-text">Conditions Confidentialité</p>
                  <p className="footer-text">Règles et sécurité</p>
                  <p className="footer-text">© 2024 StreamTube</p>
                </div>
              </div>
            </>
          )}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
