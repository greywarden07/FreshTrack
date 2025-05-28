import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Container, 
  Box, 
  Typography, 
  AppBar, 
  Toolbar,
  Button,
  Alert,
  Snackbar
} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';
import Dashboard from './components/Dashboard';
import UploadPage from './components/UploadPage';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { useAuth } from './contexts/authContext';
import { auth } from './firebase/firebase';

// Layout component that handles conditional rendering of header/footer
const AppLayout = ({ children }) => {
  const location = useLocation();
  const { currentUser, authError } = useAuth();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  // Theme colors for use in components
  const cardBg = '#0f1424';
  const primaryPurple = '#755dff';
  const secondaryGreen = '#4aeabc';
  
  // Add this gradient animation for the logo
  const logoGradient = {
    backgroundImage: `linear-gradient(90deg, ${primaryPurple}, ${secondaryGreen})`,
    backgroundSize: '200% 100%',
    animation: `${keyframes`
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    `} 8s ease infinite`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
    display: 'inline-block'
  };
  
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Only show header on non-auth pages */}
      {!isAuthPage && (
        <AppBar position="sticky" sx={{ bgcolor: cardBg, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Toolbar>
            <Typography 
              variant="h6" 
              component={Link} 
              to="/"
              sx={{ 
                flexGrow: 1, 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                fontSize: '1.3rem',
                textDecoration: 'none',
                color: 'inherit',
                letterSpacing: '-0.02em',
                transition: 'all 0.3s ease'
              }}
            >
              <Box 
                sx={{ 
                  background: `linear-gradient(135deg, ${primaryPurple}44, ${secondaryGreen}22)`,
                  p: 0.9, 
                  borderRadius: '10px',
                  mr: 1.5,
                  display: 'flex',
                  boxShadow: `0 4px 12px rgba(117,93,255,0.2)`,
                  border: '1px solid',
                  borderColor: 'rgba(117,93,255,0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 14px rgba(117,93,255,0.25)`,
                  }
                }}
              >
                <ReceiptLongIcon sx={{ color: primaryPurple }} />
              </Box>
              <Box component="span" sx={logoGradient}>Fresh</Box>
              <Box component="span" sx={{ fontWeight: 800, color: 'white' }}>Track</Box>
            </Typography>
            
            {/* Navigation Links */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                component={Link} 
                to="/"
                color="inherit"
                sx={{ 
                  opacity: 0.8,
                  '&:hover': { opacity: 1 }
                }}
              >
                Home
              </Button>
              <Button 
                component={Link} 
                to="/dashboard"
                color="inherit"
                sx={{ 
                  opacity: 0.8,
                  '&:hover': { opacity: 1 }
                }}
              >
                Dashboard
              </Button>
              <Button 
                component={Link} 
                to="/upload"
                color="inherit"
                sx={{ 
                  opacity: 0.8,
                  '&:hover': { opacity: 1 }
                }}
              >
                Upload
              </Button>
              
              {currentUser ? (
                <Button 
                  color="inherit"
                  variant="outlined"
                  size="small"
                  onClick={() => auth.signOut()}
                  sx={{ 
                    ml: 2,
                    borderColor: 'rgba(255,255,255,0.2)'
                  }}
                >
                  Log out
                </Button>
              ) : (
                <Button 
                  component={Link} 
                  to="/login"
                  color="inherit"
                  variant="outlined"
                  size="small"
                  sx={{ 
                    ml: 2,
                    borderColor: 'rgba(255,255,255,0.2)'
                  }}
                >
                  Log in
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      )}
      
      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>
      
      {/* Only show footer on non-auth pages */}
      {!isAuthPage && (
        <Box 
          component="footer" 
          sx={{ 
            py: 3,
            bgcolor: cardBg,
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              Food Expiry Tracker &copy; {new Date().getFullYear()}
            </Typography>
          </Container>
        </Box>
      )}
    </Box>
  );
};

function App() {
  const { authError } = useAuth();
  const [firebaseError, setFirebaseError] = useState(null);
  const [showFirebaseError, setShowFirebaseError] = useState(false);
  
  useEffect(() => {
    // Check if Firebase auth is initialized
    const checkFirebase = async () => {
      try {
        if (!auth) {
          throw new Error('Firebase authentication is not initialized.');
        }
        
        // Check if we can access the current user
        await auth.currentUser;
        console.log('Firebase auth is properly initialized');
      } catch (error) {
        console.error('Firebase initialization error:', error);
        setFirebaseError(error.message);
        setShowFirebaseError(true);
      }
    };
    
    checkFirebase();
  }, []);
  
  // If auth error is present in the context, show it
  useEffect(() => {
    if (authError) {
      setFirebaseError(authError.message);
      setShowFirebaseError(true);
    }
  }, [authError]);
  
  // Define theme colors
  const darkBg = '#1e2233';
  const cardBg = '#0f1424';
  const primaryPurple = '#755dff';
  const secondaryGreen = '#4aeabc';
  const accentOrange = '#ff9757';
  const textPrimary = '#ffffff';
  const textSecondary = 'rgba(255, 255, 255, 0.6)';

  // Create custom theme
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: primaryPurple,
      },
      secondary: {
        main: secondaryGreen,
      },
      warning: {
        main: accentOrange,
      },
      background: {
        default: darkBg,
        paper: cardBg,
      },
      text: {
        primary: textPrimary,
        secondary: textSecondary,
      },
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        letterSpacing: '-0.5px',
        lineHeight: 1.2,
      },
      h4: {
        fontWeight: 500,
        letterSpacing: '-0.3px',
      },
      h5: {
        fontWeight: 500,
        letterSpacing: '-0.2px',
      },
      h6: {
        fontWeight: 500,
        letterSpacing: '-0.2px',
      },
      body1: {
        lineHeight: 1.7,
        letterSpacing: '0.1px',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: 8,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            },
          },
          outlined: {
            borderColor: 'rgba(255,255,255,0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.05)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            backgroundImage: 'none',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(255,255,255,0.1)',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      
      {/* Error Snackbar for Firebase errors */}
      <Snackbar
        open={showFirebaseError}
        autoHideDuration={6000}
        onClose={() => setShowFirebaseError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowFirebaseError(false)} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {firebaseError || 'Firebase initialization error. Please check console for details.'}
        </Alert>
      </Snackbar>
      
      <Router>
        <AppLayout>
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Main routes */}
            <Route path="/" element={
              <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <HomePage />
                </motion.div>
              </Container>
            } />
            <Route path="/dashboard" element={
              <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dashboard />
                </motion.div>
              </Container>
            } />
            <Route path="/upload" element={
              <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flex: 1 }}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <UploadPage />
                </motion.div>
              </Container>
            } />
          </Routes>
        </AppLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App; 