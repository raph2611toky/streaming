import { Card, CardMedia, CardContent, Typography, Box, Avatar, Chip } from "@mui/material"
import { Link } from "react-router-dom"
import { PlayArrow as PlayIcon, Verified as VerifiedIcon } from "@mui/icons-material"

function VideoCard({ video }) {
  const formatViewCount = (count) => {
    if (count === "En direct") return count
    const num = Number.parseInt(count.replace(/[^\d]/g, ""))
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return count
  }

  return (
    <Card
      sx={{
        bgcolor: "transparent",
        boxShadow: "none",
        width: "100%", 
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px) scale(1.02)",
          "& .thumbnail": {
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          },
          "& .play-overlay": {
            opacity: 1,
          },
          "& .video-info": {
            transform: "translateY(-2px)",
          },
        },
      }}
    >
      <Link to={`/stream?code_id=${video.code_id}`} style={{ textDecoration: "none", color: "inherit" }}>
        {/* Thumbnail avec aspect ratio 16:9 */}
        <Box sx={{ position: "relative", mb: 1.5 }}>
          <CardMedia
            component="img"
            image={video.thumbnail}
            alt={video.title}
            className="thumbnail"
            sx={{
              width: "100%",
              aspectRatio: "16/9",
              borderRadius: "12px",
              objectFit: "cover",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
            }}
          />

          {/* Play Overlay amélioré */}
          <Box
            className="play-overlay"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 0, 0, 0.7)",
              borderRadius: "12px",
              opacity: 0,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              backdropFilter: "blur(4px)",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: "scale(0.8)",
                transition: "transform 0.3s ease",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                "&:hover": {
                  transform: "scale(1)",
                },
              }}
            >
              <PlayIcon sx={{ fontSize: 32, color: "#0f0f0f", ml: 0.5 }} />
            </Box>
          </Box>

          {/* Duration améliorée */}
          <Chip
            label={video.isLive ? "EN DIRECT" : video.duration}
            size="small"
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              bgcolor: video.isLive ? "rgba(255, 0, 0, 0.9)" : "rgba(0, 0, 0, 0.8)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "'Roboto', sans-serif",
              backdropFilter: "blur(10px)",
              border: video.isLive ? "1px solid rgba(255, 0, 0, 0.5)" : "none",
              animation: video.isLive ? "livePulse 2s ease-in-out infinite" : "none",
              "@keyframes livePulse": {
                "0%, 100%": { opacity: 0.9 },
                "50%": { opacity: 1 },
              },
            }}
          />

          {/* Short Badge */}
          {video.isShort && (
            <Chip
              label="SHORT"
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                bgcolor: "rgba(255, 68, 68, 0.9)",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: "'Roboto', sans-serif",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 68, 68, 0.5)",
              }}
            />
          )}

          {/* New Badge */}
          {video.uploadTime.includes("heure") ||
          (video.uploadTime.includes("jour") && !video.uploadTime.includes("semaine")) ? (
            <Chip
              label="NOUVEAU"
              size="small"
              sx={{
                position: "absolute",
                top: video.isShort ? 50 : 8,
                left: 8,
                bgcolor: "rgba(76, 175, 80, 0.9)",
                color: "#fff",
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: "'Roboto', sans-serif",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(76, 175, 80, 0.5)",
              }}
            />
          ) : null}
        </Box>

        {/* Video Info améliorée */}
        <CardContent
          className="video-info"
          sx={{
            p: 0,
            "&:last-child": { pb: 0 },
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Box sx={{ display: "flex", gap: 1.5 }}>
            {/* Channel Avatar amélioré */}
            <Avatar
              src={video.channelAvatar}
              alt={video.channelTitle}
              sx={{
                width: 36,
                height: 36,
                bgcolor: "linear-gradient(135deg, #606060 0%, #808080 100%)",
                fontSize: "14px",
                fontWeight: 500,
                flexShrink: 0,
                border: "2px solid rgba(255, 255, 255, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              {video.channelTitle?.charAt(0)}
            </Avatar>

            {/* Video Details */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Title */}
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: 1.3,
                  color: "#fff",
                  mb: 0.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  transition: "color 0.2s ease",
                  "&:hover": {
                    color: "#f1f1f1",
                  },
                }}
              >
                {video.title}
              </Typography>

              {/* Channel Name */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.25 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#aaa",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: "#fff",
                    },
                  }}
                >
                  {video.channelTitle}
                </Typography>
                {video.isVerified && (
                  <VerifiedIcon
                    sx={{
                      fontSize: "14px",
                      color: "#aaa",
                      transition: "color 0.2s ease",
                    }}
                  />
                )}
              </Box>

              {/* Views and Upload Time */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#aaa",
                  }}
                >
                  {formatViewCount(video.viewCount)} vues
                </Typography>
                <Box
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    bgcolor: "#aaa",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "#aaa",
                  }}
                >
                  {video.uploadTime}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Link>
    </Card>
  )
}

export default VideoCard