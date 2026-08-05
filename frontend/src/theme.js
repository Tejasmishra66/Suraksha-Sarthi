import { createTheme } from '@mui/material/styles';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/outfit/800.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

// ─── Design Tokens ────────────────────────────────────────────────
const NAVY    = '#0B1A3E';   // Deep navy for headings
const BLUE    = '#1D4ED8';   // Action blue
const ORANGE  = '#EA580C';   // SDRF orange accent
const RED     = '#DC2626';   // Alert / emergency red
const SURFACE = '#FFFFFF';
const BG      = '#F4F6FB';   // Pale blue-grey canvas

const theme = createTheme({
  palette: {
    mode: 'light',
    primary:    { main: BLUE,   dark: '#1E40AF', light: '#BFDBFE', contrastText: '#ffffff' },
    secondary:  { main: ORANGE, dark: '#C2410C',                   contrastText: '#ffffff' },
    error:      { main: RED,    dark: '#B91C1C' },
    success:    { main: '#16A34A' },
    warning:    { main: '#D97706' },
    background: { default: BG, paper: SURFACE },
    text:       { primary: NAVY, secondary: '#475569' },
    divider:    'rgba(11,26,62,0.08)',
  },
  typography: {
    fontFamily: ['"Inter"', 'sans-serif'].join(','),
    h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: NAVY, letterSpacing: '-0.04em' },
    h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: NAVY, letterSpacing: '-0.03em' },
    h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: NAVY, letterSpacing: '-0.02em' },
    h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: NAVY, letterSpacing: '-0.01em' },
    h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: NAVY },
    h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: NAVY },
    subtitle1: { fontWeight: 600, color: '#1E293B' },
    subtitle2: { fontWeight: 600, color: '#475569', letterSpacing: '0.02em' },
    body1: { lineHeight: 1.65, color: '#334155' },
    body2: { lineHeight: 1.6,  color: '#64748B' },
    button:   { fontFamily: '"Outfit", sans-serif', fontWeight: 700, textTransform: 'none', letterSpacing: '0.01em' },
    overline: { fontFamily: '"Outfit", sans-serif', fontWeight: 800, letterSpacing: '0.15em', fontSize: '0.72rem' },
    caption:  { color: '#64748B', fontWeight: 500 },
  },
  shape: { borderRadius: 14 },
  shadows: [
    'none',
    '0 1px 3px rgba(11,26,62,0.06), 0 1px 2px rgba(11,26,62,0.04)',
    '0 4px 6px -1px rgba(11,26,62,0.06), 0 2px 4px -1px rgba(11,26,62,0.04)',
    '0 10px 15px -3px rgba(11,26,62,0.07), 0 4px 6px -2px rgba(11,26,62,0.04)',
    '0 20px 25px -5px rgba(11,26,62,0.08), 0 10px 10px -5px rgba(11,26,62,0.03)',
    '0 25px 50px -12px rgba(11,26,62,0.18)',
    ...Array(19).fill('none'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*, *::before, *::after': { boxSizing: 'border-box' },
        'html, body, #root': {
          height: '100%',
          margin: 0,
          backgroundColor: BG,
          color: NAVY,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        a: { color: BLUE, textDecoration: 'none', transition: 'color 0.2s', '&:hover': { color: '#1E40AF' } },
        '::-webkit-scrollbar':       { width: '6px' },
        '::-webkit-scrollbar-track': { background: BG },
        '::-webkit-scrollbar-thumb': { background: '#CBD5E1', borderRadius: '3px' },
        '::-webkit-scrollbar-thumb:hover': { background: '#94A3B8' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 22px',
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 700,
          textTransform: 'none',
          transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:active': { transform: 'scale(0.97)' },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${BLUE} 0%, #1E3A8A 100%)`,
          boxShadow: '0 4px 14px rgba(29,78,216,0.30)',
          '&:hover': { boxShadow: '0 6px 20px rgba(29,78,216,0.40)', transform: 'translateY(-1px)' },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${ORANGE} 0%, #C2410C 100%)`,
          boxShadow: '0 4px 14px rgba(234,88,12,0.30)',
          '&:hover': { boxShadow: '0 6px 20px rgba(234,88,12,0.40)', transform: 'translateY(-1px)' },
        },
        containedError: {
          background: `linear-gradient(135deg, ${RED} 0%, #991B1B 100%)`,
          boxShadow: '0 4px 14px rgba(220,38,38,0.30)',
          '&:hover': { boxShadow: '0 6px 20px rgba(220,38,38,0.40)', transform: 'translateY(-1px)' },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': { borderWidth: '2px' },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 1 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: SURFACE,
          borderRadius: 16,
          border: '1px solid rgba(11,26,62,0.07)',
          boxShadow: '0 4px 20px -4px rgba(11,26,62,0.06), 0 0 0 1px rgba(11,26,62,0.04)',
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 1 },
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: SURFACE,
          border: '1px solid rgba(11,26,62,0.07)',
          boxShadow: '0 4px 20px -4px rgba(11,26,62,0.06)',
          overflow: 'hidden',
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(244,246,251,0.9)',
          backdropFilter: 'blur(20px)',
          color: NAVY,
          borderBottom: '1px solid rgba(11,26,62,0.08)',
          boxShadow: '0 1px 12px rgba(11,26,62,0.06)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, borderRadius: 8 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: SURFACE,
            transition: 'all 0.2s',
            '&:hover fieldset': { borderColor: BLUE },
            '&.Mui-focused': {
              boxShadow: '0 0 0 4px rgba(29,78,216,0.10)',
              '& fieldset': { borderColor: BLUE },
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(11,26,62,0.08)' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 700,
          textTransform: 'none',
          fontSize: '0.9rem',
        },
      },
    },
  },
});

export default theme;
