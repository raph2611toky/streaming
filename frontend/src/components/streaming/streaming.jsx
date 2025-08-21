"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/Api";
import StreamingSkeleton from "./StreamingSkeleton";
import Header from "../home/Header";
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  Heart,
  ThumbsDown,
  Share2,
  Download,
  Settings,
  Subtitles,
  Loader2,
  MoreVertical,
  Bell,
  BellRing,
  Search,
  SkipBack,
  SkipForward,
  CheckCircle
} from "lucide-react";
import DownloadPortal from "./downloadPortal";
import DownloadOptionsModal from "./downloadModalOptions";
import "./streaming.css";

export default function Streaming() {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const wsRef = useRef(null);
  const [searchParams] = useSearchParams();
  const codeId = searchParams.get("code_id");
  const navigate = useNavigate();

  // États pour la gestion de la vidéo et des interactions utilisateur
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState("auto");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showDownloadPortal, setShowDownloadPortal] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [playlistAutoplay, setPlaylistAutoplay] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [downloadTimeRemaining, setDownloadTimeRemaining] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedSize, setDownloadedSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [selectedDownloadQuality, setSelectedDownloadQuality] = useState("480p");
  const [selectedDownloadLanguage, setSelectedDownloadLanguage] = useState("fr");
  const [videoData, setVideoData] = useState(null);
  const [downloadOptions, setDownloadOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [notification, setNotification] = useState(null);
  const [videoHistory, setVideoHistory] = useState([]);
  const [playedProgress, setPlayedProgress] = useState(0);
  const [selectedSubtitle, setSelectedSubtitle] = useState(null);
  const [selectedAudioLanguage, setSelectedAudioLanguage] = useState(null);
  const [lastVolume, setLastVolume] = useState(1);
  const [lastPlaybackSpeed, setLastPlaybackSpeed] = useState(1);
  const [lastQuality, setLastQuality] = useState("auto");
  const [showCopyToast, setShowCopyToast] = useState(false);

  // Vérification de la connexion de l'utilisateur
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserProfile(token);
    } else {
      setIsLoggedIn(false);
      setUserProfile(null);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await api.get("/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération du profil :", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserProfile(null);
        navigate("/login");
      }
    }
  };

  const handleLogin = () => navigate("/login");

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    }).catch((err) => {
      console.error("Erreur lors de la copie du lien :", err);
    });
  };

  const handleLogout = async () => {
    try {
      await api.post(
        "/logout/",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUserProfile(null);
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  const setSearchQuery = (query) => console.log("Recherche :", query);

  const toggleSidebar = () => {};

  // Envoi du compteur de vues
  useEffect(() => {
    const sendViewCount = async () => {
      if (!videoData?.id) return;
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        await api.post(
          `/videos/${videoData.id}/view/`,
          {},
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
              "X-CSRFToken": "ISgXFWCeoxc3vs2pkPezjN3n8qw22zbW",
            },
          }
        );
      } catch (err) {
        console.error("Erreur lors de l'enregistrement de la vue :", err);
      }
    };

    if (videoData) sendViewCount();
  }, [videoData]);

  // Récupération des données vidéo
  useEffect(() => {
    const fetchVideoData = async () => {
      if (!codeId) {
        setError("Aucun code_id fourni dans l'URL");
        setIsLoading(false);
        return;
      }
      let headers = {
        Accept: "application/json",
        "X-CSRFToken": "ISgXFWCeoxc3vs2pkPezjN3n8qw22zbW",
      };
      const token = localStorage.getItem("token");
      if (token) headers["Authorization"] = `Bearer ${token}`;

      try {
        setIsLoading(true);
        const response = await api.get(`/videos/${codeId}/details/`, { headers });
        setVideoData(response.data);
        setComments(response.data.commentaires || []);
        setQuality(response.data.qualite || "auto");
        setSelectedSubtitle(response.data.subtitle_languages?.[0] || null);
        setSelectedAudioLanguage(response.data.audio_languages?.[0] || null);
        setIsLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement de la vidéo.");
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchVideoData();
  }, [codeId]);

  const fetchDownloadOptions = async () => {
    if (!videoData?.id) return;
    try {
      const response = await api.get(`/videos/${videoData.id}/download/`, {
        headers: {
          Accept: "application/json",
          "X-CSRFToken": "ISgXFWCeoxc3vs2pkPezjN3n8qw22zbW",
        },
      });
      setDownloadOptions(response.data.qualities);
    } catch (err) {
      console.error("Erreur lors de la récupération des options de téléchargement :", err);
    }
  };

  // Gestion des événements vidéo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setPlayedProgress(progress);
      setCurrentTime(video.currentTime);
    };

    const updateDuration = () => setDuration(video.duration);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleEnded = () => {};

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("ended", handleEnded);

    // Appliquer les sous-titres et la langue audio sélectionnés
    if (selectedSubtitle && video.textTracks) {
      for (let i = 0; i < video.textTracks.length; i++) {
        video.textTracks[i].mode = video.textTracks[i].language === selectedSubtitle ? "showing" : "hidden";
      }
    }
    if (selectedAudioLanguage && video.audioTracks) {
      for (let i = 0; i < video.audioTracks.length; i++) {
        video.audioTracks[i].enabled = video.audioTracks[i].language === selectedAudioLanguage;
      }
    }

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("ended", handleEnded);
    };
  }, [quality, playbackRate, volume, isPlaying, selectedSubtitle, selectedAudioLanguage]);

  // Connexion WebSocket pour le streaming
  useEffect(() => {
    if (isLoggedIn && videoData?.id) {
      const token = localStorage.getItem("token");
      const wsUrl = `${import.meta.env.VITE_WEBSOCKET_URL}/videowatch/${videoData.id}/?token=${token}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("Connecté au WebSocket");
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "segment_info") {
          const manifestUrl = data.manifest_url;
          const lastPosition = data.last_position;
          const lastVolume = data.last_volume;
          const lastPlaybackSpeed = data.last_playback_speed;
          const lastQuality = data.last_quality;

          setLastVolume(lastVolume);
          setLastPlaybackSpeed(lastPlaybackSpeed);
          setLastQuality(lastQuality);
          setVolume(lastVolume);
          setPlaybackRate(lastPlaybackSpeed);
          setQuality(lastQuality);

          if (videoRef.current) {
            if (Hls.isSupported()) {
              const hls = new Hls({
                debug: true,
              });
              hls.loadSource(manifestUrl);
              hls.attachMedia(videoRef.current);
              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log("HLS Levels:", hls.levels);
                videoRef.current.currentTime = lastPosition;
                videoRef.current.volume = lastVolume;
                videoRef.current.playbackRate = lastPlaybackSpeed;
                // Sélectionner la qualité
                const levels = hls.levels;
                const qualityIndex = levels.findIndex(level => level.name === lastQuality);
                if (qualityIndex >= 0) {
                  hls.currentLevel = qualityIndex;
                  console.log(`Initial quality set to ${lastQuality} (index: ${qualityIndex})`);
                } else {
                  console.error(`Quality ${lastQuality} not found in HLS levels`, levels);
                  hls.currentLevel = 0;
                }
                // Sélectionner les pistes audio et sous-titres
                if (selectedAudioLanguage && data.audio_tracks) {
                  const audioIndex = data.audio_tracks.findIndex(track => track.language === selectedAudioLanguage);
                  console.log(audioIndex, hls.audioTrack)
                  if (audioIndex >= 0) hls.audioTrack = audioIndex;
                }
                if (selectedSubtitle && data.subtitle_tracks) {
                  const subtitleIndex = data.subtitle_tracks.findIndex(track => track.language === selectedSubtitle);
                  if (subtitleIndex >= 0) hls.subtitleTrack = subtitleIndex;
                }
                videoRef.current.play().catch((err) => console.error("Erreur de lecture :", err));
              });
              hls.on(Hls.Events.ERROR, (event, data) => {
                console.error("Erreur HLS.js :", data);
              });
              hlsRef.current = hls;
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
              videoRef.current.src = manifestUrl;
              videoRef.current.addEventListener('loadedmetadata', () => {
                videoRef.current.currentTime = lastPosition;
                videoRef.current.volume = lastVolume;
                videoRef.current.playbackRate = lastPlaybackSpeed;
                videoRef.current.play().catch((err) => console.error("Erreur de lecture :", err));
              });
            } else {
              console.error("HLS non supporté par ce navigateur.");
            }
          }
        } else if (data.type === "error") {
          console.error("Erreur WebSocket :", data.message);
        }
      };

      wsRef.current.onerror = (error) => console.error("Erreur WebSocket :", error);
      wsRef.current.onclose = () => console.log("Déconnecté du WebSocket");

      return () => {
        if (wsRef.current) wsRef.current.close();
        if (hlsRef.current) hlsRef.current.destroy();
      };
    }
  }, [isLoggedIn, videoData, selectedSubtitle, selectedAudioLanguage]);

  // Mise à jour WebSocket
  useEffect(() => {
    if (!wsRef.current || !videoRef.current) return;

    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: "update",
              data: {
                position: videoRef.current.currentTime,
                quality: quality,
                speed: playbackRate,
                volume: volume,
                selectedSubtitle: selectedSubtitle,
                selectedAudioLanguage: selectedAudioLanguage,
              },
            })
          );
        }
      }, 5000);
    } else {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "update",
            data: {
              position: videoRef.current.currentTime,
              quality: quality,
              speed: playbackRate,
              volume: volume,
              selectedSubtitle: selectedSubtitle,
              selectedAudioLanguage: selectedAudioLanguage,
            },
          })
        );
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, quality, playbackRate, volume, selectedSubtitle, selectedAudioLanguage]);

  // Gestionnaires d'événements
  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
        setNotification("pause");
      } else {
        video.play().catch((err) => console.error("Erreur de lecture :", err));
        setNotification("play");
      }
      setIsPlaying(!isPlaying);
      setTimeout(() => setNotification(null), 1500);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) videoRef.current.volume = newVolume;
  };

  const handleSeek = (e) => {
    const newProgress = parseFloat(e.target.value);
    const newTime = (newProgress / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setPlayedProgress(newProgress);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "update",
            data: {
              position: newTime,
              quality: quality,
              speed: playbackRate,
              volume: volume,
              selectedSubtitle: selectedSubtitle,
              selectedAudioLanguage: selectedAudioLanguage,
            },
          })
        );
      }
    }
  };

  const handleQualityChange = (e) => {
    const newQuality = e.target.value;
    setQuality(newQuality);
    if (hlsRef.current) {
      const levels = hlsRef.current.levels;
      console.log("Available levels:", levels);
      const qualityIndex = levels.findIndex(level => level.name === newQuality);
      if (qualityIndex >= 0) {
        hlsRef.current.currentLevel = qualityIndex;
        console.log(`Switched to quality: ${newQuality} (index: ${qualityIndex})`);
      } else {
        console.error(`Quality ${newQuality} not found in HLS levels`, levels);
        hlsRef.current.currentLevel = -1; // Fallback to auto quality
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "update",
            data: {
              position: videoRef.current.currentTime,
              quality: newQuality,
              speed: playbackRate,
              volume: volume,
              selectedSubtitle: selectedSubtitle,
              selectedAudioLanguage: selectedAudioLanguage,
            },
          })
        );
      }
    }
  };

  const skipBackward = () => {
    if (videoHistory.length > 1) {
      const prevVideo = videoHistory[videoHistory.length - 2];
      navigate(`/stream?code_id=${prevVideo.code_id}`);
      setVideoHistory((prev) => prev.slice(0, -1));
    }
  };

  const skipForward = () => {
    if (videoData.suggested_videos.length > 0) {
      const nextVideo = videoData.suggested_videos[0];
      navigate(`/stream?code_id=${nextVideo.code_id}`);
    }
  };

  const handleVideoClick = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = video.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (e.detail === 1) {
      togglePlay();
    } else if (e.detail === 2) {
      if (clickX < width / 2) skipBackward();
      else skipForward();
    }
  };

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      if (!document.fullscreenElement) {
        video.requestFullscreen().catch((err) =>
          console.error(`Erreur de plein écran : ${err.message}`)
        );
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const getBufferedProgress = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return 0;
    const buffered = video.buffered;
    if (buffered.length === 0) return 0;
    const end = buffered.end(buffered.length - 1);
    return (end / video.duration) * 100;
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === Infinity) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatSpeed = (bytesPerSecond) => formatBytes(bytesPerSecond) + "/s";

  const formatTimeRemaining = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleLike = async () => {
    if (!videoData?.id) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await api.post(
        `/videos/${videoData.id}/like/`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "X-CSRFToken": "ISgXFWCeoxc3vs2pkPezjN3n8qw22zbW",
          },
        }
      );
      if (response.status === 200) {
        setLiked(!liked);
        if (disliked) {
          setDisliked(false);
          setVideoData((prev) => ({
            ...prev,
            dislikes_count: prev.dislikes_count - 1,
          }));
        }
        setVideoData((prev) => ({
          ...prev,
          likes_count: liked ? prev.likes_count - 1 : prev.likes_count + 1,
        }));
      }
    } catch (err) {
      console.error("Erreur lors du Like :", err);
    }
  };

  const handleDislike = async () => {
    if (!videoData?.id) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await api.post(
        `/videos/${videoData.id}/dislike/`,
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "X-CSRFToken": "ISgXFWCeoxc3vs2pkPezjN3n8qw22zbW",
          },
        }
      );
      if (response.status === 200) {
        setDisliked(!disliked);
        if (liked) {
          setLiked(false);
          setVideoData((prev) => ({
            ...prev,
            likes_count: prev.likes_count - 1,
          }));
        }
        setVideoData((prev) => ({
          ...prev,
          dislikes_count: disliked ? prev.dislikes_count - 1 : prev.dislikes_count + 1,
        }));
      }
    } catch (err) {
      console.error("Erreur lors du dislike :", err);
    }
  };

  const handleSubscribe = () => setSubscribed(!subscribed);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim()) {
      try {
        const newComment = {
          author: userProfile?.name || "Utilisateur Anonyme",
          text: comment,
          date: new Date().toISOString().split("T")[0],
          likes: 0,
        };
        setComments([newComment, ...comments]);
        setComment("");
      } catch (err) {
        console.error("Erreur lors de l'envoi du commentaire :", err);
      }
    }
  };

  const handleDownloadClick = () => {
    setShowDownloadOptions(true);
    fetchDownloadOptions();
  };

  const handleDownloadConfirm = async (quality, language) => {
    setSelectedDownloadQuality(quality);
    setSelectedDownloadLanguage(language);
    setShowDownloadOptions(false);
    setIsDownloading(true);
    setShowDownloadPortal(true);

    const selectedOption = downloadOptions.find((option) => option.quality === quality);
    if (!selectedOption) {
      console.error("Option de téléchargement non trouvée");
      setIsDownloading(false);
      return;
    }

    try {
      const startTime = Date.now();
      let downloadedBytes = 0;

      const response = await fetch(selectedOption.url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-CSRFToken": "ISgXFWCeoxc3vs2pkPezjN3n8qw22zbW",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const contentLength = response.headers.get("content-length");
      setTotalSize(contentLength ? parseInt(contentLength) : 0);

      const reader = response.body.getReader();
      const stream = new ReadableStream({
        start(controller) {
          function push() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              downloadedBytes += value.byteLength;
              setDownloadedSize(downloadedBytes);
              const elapsedTime = (Date.now() - startTime) / 1000;
              const speed = downloadedBytes / elapsedTime;
              setDownloadSpeed(speed);
              if (contentLength) {
                const remainingBytes = contentLength - downloadedBytes;
                const timeRemaining = remainingBytes / speed;
                setDownloadTimeRemaining(timeRemaining);
                setDownloadProgress((downloadedBytes / contentLength) * 100);
              }
              controller.enqueue(value);
              push();
            }).catch((err) => {
              console.error("Erreur lors du streaming :", err);
              controller.error(err);
              setIsDownloading(false);
            });
          }
          push();
        },
      });

      const newResponse = new Response(stream);
      const blob = await newResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${videoData.titre}_${quality}.${selectedOption.extension || "mp4"}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setIsDownloading(false);
      setShowDownloadPortal(false);
    } catch (err) {
      console.error("Erreur lors du téléchargement :", err);
      setIsDownloading(false);
      setShowDownloadPortal(false);
    }
  };

  const handleSuggestionClick = (suggestedCodeId) => {
    navigate(`/stream?code_id=${suggestedCodeId}`);
  };

  // Rendu conditionnel pour le chargement et les erreurs
  if (isLoading) return <StreamingSkeleton />;

  if (error) {
    return (
      <div className="text-center text-red-500 p-6">
        <p>{error}</p>
      </div>
    );
  }

  const bufferedProgress = getBufferedProgress();

  // Rendu principal
  return (
    <div className="app-container">
      <Header
        setSearchQuery={setSearchQuery}
        toggleSidebar={toggleSidebar}
        isLoggedIn={isLoggedIn}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        userProfile={userProfile}
        showSidebarToggle={false}
      />
      {showCopyToast && (
        <div className="toast" style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#4caf4f53",
          color: "white",
          padding: "10px 20px",
          borderRadius: "4px",
          zIndex: 1000,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }}>
          <CheckCircle size={20} />
          <span>Lien copié avec succès !</span>
        </div>
      )}
      <div className="main-layout" style={{ paddingTop: "64px" }}>
        <div className="video-content-area">
          <div className="video-player-container" style={{ height: "60vh" }}>
            <video
              ref={videoRef}
              className="video-player"
              onClick={handleVideoClick}
              onDoubleClick={(e) => e.preventDefault()}
              style={{ height: "100%" }}
            >
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>

            {notification && (
              <div
                className="notification"
                style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
              >
                {notification === "play" ? <Play size={48} /> : <Pause size={48} />}
              </div>
            )}

            {isBuffering && (
              <div className="buffering-overlay">
                <Loader2 className="loader-icon" />
              </div>
            )}

            <div className="video-controls-overlay">
              {/* Barre de progression vidéo */}
              <div className="progress-bar-container">
                <div className="progress-bar-bg"></div>
                <div
                  className="progress-bar-buffered"
                  style={{ width: `${bufferedProgress}%` }}
                ></div>
                <div
                  className="progress-bar-played"
                  style={{ width: `${playedProgress}%` }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={playedProgress || 0}
                  onChange={handleSeek}
                  className="video-progress-slider"
                />
              </div>
              <div className="controls-bottom-row">
                <div className="controls-left-group">
                  <button onClick={skipBackward} className="control-btn">
                    <SkipBack size={20} />
                  </button>
                  <button onClick={togglePlay} className="control-btn">
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button onClick={skipForward} className="control-btn">
                    <SkipForward size={20} />
                  </button>
                  <div className="volume-control-group">
                    <Volume2 className="volume-icon" />
                    <div className="volume-bar-container">
                      <div className="volume-bar-bg"></div>
                      <div
                        className="volume-bar-filled"
                        style={{ width: `${volume * 100}%` }}
                      ></div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="volume-slider"
                      />
                    </div>
                  </div>
                  <span className="time-display">
                    {formatTime(currentTime)} / {videoData?.duration || "0:00"}
                  </span>
                </div>
                <div className="controls-right-group">
                  <div className="quality-selector">
                    <select value={quality} onChange={handleQualityChange} className="quality-select">
                      <option value="auto">Auto</option>
                      {videoData?.qualites_disponibles?.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button onClick={() => setShowSettingsDropdown(!showSettingsDropdown)} className="control-btn">
                    <Settings size={20} />
                  </button>
                  {showSettingsDropdown && (
                    <div className="settings-dropdown">
                      <div className="settings-dropdown-header">Paramètres</div>
                      <ul className="settings-dropdown-list">
                        <li className="settings-dropdown-item">
                          Vitesse de lecture:
                          <select
                            value={playbackRate}
                            onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                            className="custom-select"
                          >
                            <option value={0.5}>0.5x</option>
                            <option value={0.75}>0.75x</option>
                            <option value={1}>1x</option>
                            <option value={1.25}>1.25x</option>
                            <option value={1.5}>1.5x</option>
                            <option value={2}>2x</option>
                          </select>
                        </li>
                        <li className="settings-dropdown-item">
                          Langue audio:
                          <select
                            value={selectedAudioLanguage || ""}
                            onChange={(e) => setSelectedAudioLanguage(e.target.value || null)}
                            className="custom-select"
                          >
                            <option value="">Défaut</option>
                            {videoData?.audio_languages?.map((lang) => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                            ))}
                          </select>
                        </li>
                        <li className="settings-dropdown-item">
                          Sous-titres:
                          <select
                            value={selectedSubtitle || ""}
                            onChange={(e) => setSelectedSubtitle(e.target.value || null)}
                            className="custom-select"
                          >
                            <option value="">Aucun</option>
                            {videoData?.subtitle_languages?.map((lang) => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                            ))}
                          </select>
                        </li>
                      </ul>
                    </div>
                  )}
                  <button onClick={handleDownloadClick} className="control-btn" disabled={isDownloading}>
                    {isDownloading ? <Loader2 className="download-loader-icon" /> : <Download className="download-icon" />}
                  </button>
                  <button onClick={toggleFullscreen} className="control-btn">
                    <Maximize className="fullscreen-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="video-details-section">
            <h1 className="video-title">{videoData.titre}</h1>
            <div className="video-meta-actions-row">
              <div className="channel-info-group">
                <img
                  src={videoData.envoyeur.profile_url}
                  alt="Channel"
                  width={40}
                  height={40}
                  className="channel-avatar"
                />
                <div className="channel-text-info">
                  <h3 className="channel-name">{videoData.envoyeur.name}</h3> 
                  {/* <span className="subscriber-count">1.2M abonnés</span> */}
                </div>
                <button className={`subscribe-btn ${subscribed ? "subscribed" : ""}`} onClick={handleSubscribe}>
                  {subscribed ? (
                    <>
                      <BellRing className="subscribe-icon" />
                      Abonné
                    </>
                  ) : (
                    <>
                      <Bell className="subscribe-icon" />
                      S'abonner
                    </>
                  )}
                </button>
              </div>
              <div className="action-buttons-group">
                <button className={`action-btn ${liked ? "active" : ""}`} onClick={handleLike}>
                  <Heart className="action-icon" />
                  {videoData.likes_count}
                </button>
                <button className={`action-btn ${disliked ? "active" : ""}`} onClick={handleDislike}>
                  <ThumbsDown className="action-icon" />
                  {videoData.dislikes_count}
                </button>
                <button className="action-btn" onClick={handleCopyLink}>
                  <Share2 className="action-icon" />
                  Partager
                </button>
                <button className="action-btn" onClick={handleDownloadClick}>
                  <Download className="action-icon" />
                  Télécharger
                </button>
              </div>
            </div>

            <div className="description-box">
              <p className={`description-text ${!showFullDescription ? "line-clamp-2" : ""}`}>
                {videoData.description}
              </p>
              <button onClick={() => setShowFullDescription(!showFullDescription)} className="description-toggle-btn">
                {showFullDescription ? "moins" : "plus"}
              </button>
            </div>
          </div>

          <div className="comments-section">
            <h3 className="comments-heading">{comments.length} commentaires</h3>
            {comments.length > 0 && <p className="comments-intro">Voici ce que les utilisateurs en pensent :</p>}
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <img
                src={userProfile?.profile_url || "https://randomuser.me/api/portraits/men/32.jpg"}
                alt="User"
                width={32}
                height={32}
                className="comment-avatar"
              />
              <div className="comment-input-area">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="comment-input"
                />
                <div className="comment-form-actions">
                  <button type="button" onClick={() => setComment("")} className="comment-cancel-btn">
                    Annuler
                  </button>
                  <button type="submit" className="comment-submit-btn" disabled={!comment.trim()}>
                    Commenter
                  </button>
                </div>
              </div>
            </form>
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <img
                    src="https://via.placeholder.com/32x32/333/fff?text=U"
                    alt="User"
                    width={32}
                    height={32}
                    className="comment-avatar"
                  />
                  <div className="comment-details">
                    <div className="comment-header">
                      <span className="comment-author">{comment.author}</span>
                      <span className="comment-date">{comment.date}</span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                    <div className="comment-actions">
                      <button className="comment-action-btn">
                        <Heart className="comment-action-icon" /> {comment.likes}
                      </button>
                      <button className="comment-action-btn">
                        <ThumbsDown className="comment-action-icon" />
                      </button>
                      <button className="comment-action-btn">Répondre</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="suggestions-section">
          <div className="suggestions-videos-section">
            <h3 className="section-title">Suggestions</h3>
            <div className="suggestions-list">
              {videoData.suggested_videos.map((video) => (
                <div
                  key={video.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(video.code_id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="suggestion-thumbnail">
                    <img
                      src={video.affichage_url || "/placeholder.svg"}
                      alt={video.titre}
                      width={180}
                      height={100}
                      className="suggestion-thumbnail-img"
                    />
                  </div>
                  <div className="suggestion-info">
                    <p className="suggestion-title">{video.titre}</p>
                    <p className="suggestion-channel">{video.envoyeur.name}</p>
                    <p className="suggestion-meta">
                      {video.vues_count} vues • {video.elapsed_time}
                    </p>
                    <span className="suggestion-duration">{video.duration}</span>
                  </div>
                  <button className="suggestion-action-btn">
                    <MoreVertical className="action-dots-icon" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showDownloadOptions && (
        <DownloadOptionsModal
          qualities={downloadOptions.map((option) => ({
            value: option.quality,
            label: option.quality,
            size: option.taille,
          }))}
          languages={videoData?.audio_languages?.map((lang) => ({ code: lang, name: lang })) || []}
          selectedQuality={selectedDownloadQuality}
          selectedLanguage={selectedDownloadLanguage}
          onConfirm={handleDownloadConfirm}
          onCancel={() => setShowDownloadOptions(false)}
          fichierNom={videoData?.titre}
        />
      )}

      {showDownloadPortal && (
        <DownloadPortal
          progress={downloadProgress}
          speed={downloadSpeed}
          timeRemaining={downloadTimeRemaining}
          downloadedSize={downloadedSize}
          totalSize={totalSize}
          isDownloading={isDownloading}
          quality={selectedDownloadQuality}
          language={selectedDownloadLanguage}
          onCancel={() => setShowDownloadPortal(false)}
          formatBytes={formatBytes}
          formatSpeed={formatSpeed}
          formatTimeRemaining={formatTimeRemaining}
        />
      )}
    </div>
  );
}