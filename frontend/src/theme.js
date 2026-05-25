import { createTheme } from '@mui/material/styles';

// Builds a restrained disaster-response theme with high contrast surfaces.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#8b1d3d'
    },
    secondary: {
      main: '#1f5f8b'
    },
    background: {
      default: '#f6f8fb',
      paper: '#ffffff'
    }
  },
  shape: {
    borderRadius: 14
  },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'sans-serif'].join(',')
  }
});

export default theme;
