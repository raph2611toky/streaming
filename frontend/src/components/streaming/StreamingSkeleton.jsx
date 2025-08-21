import React from 'react';
import { Box, Skeleton } from '@mui/material';

function StreamingSkeleton() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {/* Header Skeleton */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '80px',
          backgroundColor: '#1a1a1a',
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: '50%', mr: 2 }} />
        <Skeleton variant="text" width={150} height={24} sx={{ mr: 3 }} />
        <Skeleton variant="rectangular" width={300} height={36} sx={{ borderRadius: '18px', flex: 1 }} />
        <Skeleton variant="circular" width={32} height={32} sx={{ ml: 2 }} />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          gap: 3,
          padding: '20px',
          maxWidth: '1600px',
          margin: '20px 120px 0 120px',
          flexDirection: { xs: 'column', lg: 'row' },
          pt: '84px',
        }}
      >
        <Box sx={{ flex: 2.5, minWidth: 0 }}>
          <Skeleton
            variant="rectangular"
            sx={{
              width: 'auto',
              height: '60vh', 
              borderRadius: '12px',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              mb: 2,
            }}
          />

          {/* Video Title Skeleton */}
          <Skeleton
            variant="text"
            sx={{
              width: '85%',
              height: '32px',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              mb: 2,
              borderRadius: '4px',
            }}
          />

          {/* Channel Info Skeleton */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Skeleton
              variant="circular"
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton
                variant="text"
                sx={{
                  width: '30%',
                  height: '20px',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  mb: 0.5,
                  borderRadius: '4px',
                }}
              />
              <Skeleton
                variant="text"
                sx={{
                  width: '20%',
                  height: '16px',
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '4px',
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  sx={{
                    width: '80px',
                    height: '36px',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '18px',
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Description Skeleton */}
          <Skeleton
            variant="rectangular"
            sx={{
              width: '100%',
              height: '80px',
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              mb: 4,
            }}
          />

          {/* Comments Section Skeleton */}
          <Box>
            <Skeleton
              variant="text"
              sx={{
                width: '200px',
                height: '24px',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                mb: 3,
                borderRadius: '4px',
              }}
            />

            {/* Comment Form Skeleton */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Skeleton
                variant="circular"
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }}
              />
              <Skeleton
                variant="rectangular"
                sx={{
                  flex: 1,
                  height: '40px',
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '4px',
                }}
              />
            </Box>

            {/* Comments List Skeleton */}
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Skeleton
                  variant="circular"
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    sx={{
                      width: '25%',
                      height: '16px',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      mb: 1,
                      borderRadius: '4px',
                    }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{
                      width: '90%',
                      height: '16px',
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                      mb: 0.5,
                      borderRadius: '4px',
                    }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{
                      width: '70%',
                      height: '16px',
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '4px',
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Suggestions Section Skeleton */}
        <Box sx={{ flex: 1, minWidth: '300px' }}>
          <Skeleton
            variant="text"
            sx={{
              width: '150px',
              height: '20px',
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              mb: 2,
              borderRadius: '4px',
            }}
          />

          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Skeleton
                variant="rectangular"
                sx={{
                  width: '160px',
                  height: '90px',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  flexShrink: 0,
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Skeleton
                  variant="text"
                  sx={{
                    width: '95%',
                    height: '16px',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    mb: 0.5,
                    borderRadius: '4px',
                  }}
                />
                <Skeleton
                  variant="text"
                  sx={{
                    width: '80%',
                    height: '16px',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    mb: 0.5,
                    borderRadius: '4px',
                  }}
                />
                <Skeleton
                  variant="text"
                  sx={{
                    width: '60%',
                    height: '14px',
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    mb: 0.5,
                    borderRadius: '4px',
                  }}
                />
                <Skeleton
                  variant="text"
                  sx={{
                    width: '50%',
                    height: '14px',
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '4px',
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default StreamingSkeleton;