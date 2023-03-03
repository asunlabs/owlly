import { Box, Button, Typography } from '@mui/material';
import { brown } from '@mui/material/colors';
import { Link } from 'react-router-dom';

const primary = brown[400];
export function Page404() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: primary,
      }}
    >
      <Typography variant="h1" style={{ color: 'white' }}>
        404
      </Typography>
      <Typography variant="h6" style={{ color: 'white' }}>
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button
        sx={{
          backgroundColor: '#DED29E',
          color: '#5e433c',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#5e433c',
            color: '#DED29E',
          },
        }}
        variant="contained"
      >
        <Link to={'/'}>Back Home</Link>
      </Button>
    </Box>
  );
}
