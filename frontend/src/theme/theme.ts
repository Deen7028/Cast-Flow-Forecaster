import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#080a0f',
      paper: '#0e1117',  
    },
    primary: {
      main: '#00e5a0',   
      light: 'rgba(0, 229, 160, 0.08)', 
    },
    secondary: {
      main: '#3d9eff',   
    },
    error: {
      main: '#ff4d6d',    
    },
    warning: {
      main: '#f5c542',    
    },
    info: {
      main: '#a78bfa',    
    },
    success: {
      main: '#00e5a0',    
    },
    text: {
      primary: '#dde3f0',   
      secondary: '#7a8499',
      disabled: '#3d4560', 
    },
    divider: '#1c2233',   
  },
  typography: {
    fontFamily: "'Sarabun', sans-serif", 
    h4: {
      fontFamily: "'Syne', sans-serif", 
      fontWeight: 700,
    },
    h5: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 700,
    },
    h6: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 700,
    },
    subtitle1: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 700,
    },
    subtitle2: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 700,
    },
    caption: {
      fontFamily: "'DM Mono', monospace", 
    },
    button: {
      fontFamily: "'Sarabun', sans-serif",
      fontWeight: 600,
      textTransform: 'none', 
    }
  },
  shape: {
    borderRadius: 10, 
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 7, 
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', 
          border: '1px solid #1c2233', 
        },
      },
    },
  },
});