import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    primary: {
      main: '#0f4a30', // Mockup's very dark green
      dark: '#0a3622',
      light: '#175e3c',
    },
    secondary: {
      main: '#d32f2f', // Red for emergency
      dark: '#b71c1c',
      light: '#f44336',
    },
    text: {
      primary: '#1a202c',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    h1: { fontSize: '3.5rem', fontWeight: 800, color: '#1a202c' },
    h2: { fontSize: '2.5rem', fontWeight: 800, color: '#1a202c' },
    h3: { fontSize: '2rem', fontWeight: 700 },
    h4: { fontSize: '1.5rem', fontWeight: 700 },
    h5: { fontSize: '1.25rem', fontWeight: 700 },
    h6: { fontSize: '1.1rem', fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '8px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }
        },
      },
    },
  },
});

export default theme;
