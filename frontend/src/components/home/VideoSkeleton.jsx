import { Box, Skeleton } from "@mui/material"

function VideoSkeleton() {
  return (
    <Box
      sx={{
        width: "100%",
        animation: "pulse 1.5s ease-in-out infinite",
        "@keyframes pulse": {
          "0%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0.7,
          },
          "100%": {
            opacity: 1,
          },
        },
      }}
    >
      {/* Thumbnail Skeleton */}
      <Skeleton
        variant="rectangular"
        sx={{
          width: "100%",
          height: "202px", // Ratio 16:9 pour la largeur responsive
          borderRadius: "12px",
          bgcolor: "rgba(255, 255, 255, 0.1)",
          mb: 1.5,
          animation: "shimmer 2s infinite",
          "@keyframes shimmer": {
            "0%": {
              backgroundPosition: "-200% 0",
            },
            "100%": {
              backgroundPosition: "200% 0",
            },
          },
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 100%)",
          backgroundSize: "200% 100%",
        }}
      />

      {/* Info Section */}
      <Box sx={{ display: "flex", gap: 1.5 }}>
        {/* Avatar Skeleton */}
        <Skeleton
          variant="circular"
          sx={{
            width: 36,
            height: 36,
            bgcolor: "rgba(255, 255, 255, 0.1)",
            flexShrink: 0,
          }}
        />

        {/* Text Skeletons */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Title Skeleton */}
          <Skeleton
            variant="text"
            sx={{
              width: "90%",
              height: "20px",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              mb: 0.5,
              borderRadius: "4px",
            }}
          />
          <Skeleton
            variant="text"
            sx={{
              width: "70%",
              height: "20px",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              mb: 1,
              borderRadius: "4px",
            }}
          />

          {/* Channel Name Skeleton */}
          <Skeleton
            variant="text"
            sx={{
              width: "50%",
              height: "16px",
              bgcolor: "rgba(255, 255, 255, 0.08)",
              mb: 0.5,
              borderRadius: "4px",
            }}
          />

          {/* Views and Time Skeleton */}
          <Skeleton
            variant="text"
            sx={{
              width: "60%",
              height: "16px",
              bgcolor: "rgba(255, 255, 255, 0.08)",
              borderRadius: "4px",
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default VideoSkeleton