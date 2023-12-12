// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  
  palette: {
    mode: 'dark',
    background: {
      default: 'rgb(38, 38, 38)', // Background color for the entire app
    },
    primary: {
      main: 'rgb(84, 116, 116)', // Your custom primary color
      contrastText: '#fff', // Text color for contrast (change if needed)
    },
    // You can add other customizations here
  },
  typography: {
    fontFamily: 'Basel, sans-serif',
  },
  // Additional theme customizations can be added here
});

export default theme;
