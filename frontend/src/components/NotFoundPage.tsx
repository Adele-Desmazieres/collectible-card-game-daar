import React from 'react';
import { Box, Typography, Button } from '@mui/joy';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        bgcolor: 'background.level1',
        color: 'text.primary',
        padding: 2,
      }}
    >
      <Typography
        level="h1"
        fontSize="4rem"
        fontWeight="bold"
        sx={{ mb: 1 }}
      >
        404
      </Typography>
      <Typography level="h1" sx={{ mb: 2 }}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Button
        variant="solid"
        color="primary"
        onClick={handleGoHome}
        sx={{
          mt: 2,
          padding: '8px 16px',
          fontSize: '1rem',
          fontWeight: 'medium',
          borderRadius: 'md',
        }}
      >
        Go Back Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
