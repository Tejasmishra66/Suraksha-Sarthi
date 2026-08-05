import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#003366', // Official Government Blue
    primaryContainer: '#E8F0FE', // Light blue background for active/selected items
    secondary: '#E65100', // Alert Orange
    secondaryContainer: '#FFF3E0', // Light orange background
    error: '#D32F2F', // Red for critical items
    background: '#F5F7FA', // Clean, light grey background
    surface: '#FFFFFF', // Clean white for cards
    surfaceVariant: '#F8FAFC',
    text: '#1A2027', // Dark text for readability
    onSurface: '#1A2027',
    onSurfaceVariant: '#3E5060',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    elevation: {
      ...DefaultTheme.colors.elevation,
      level1: '#FFFFFF',
      level2: '#FFFFFF',
    },
    backdrop: 'rgba(0, 51, 102, 0.4)', // Slightly blue-tinted dark backdrop
  },
  roundness: 8, // Modern, slightly sharper look for an official vibe
};
