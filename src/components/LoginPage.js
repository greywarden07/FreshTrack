import React, { useState } from 'react';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../firebase/auth'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Container,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';

// Animations
const gradientShift = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

const LoginPage = () => {
  const { currentUser, authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: ''
  });

  // Theme colors
  const primaryPurple = '#755dff';
  const secondaryGreen = '#4aeabc';
  const accentOrange = '#ff9757';
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const errors = {
      email: '',
      password: ''
    };
    let isValid = true;

    // Validate email
    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
      isValid = false;
    }

    // Validate password
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous error
    setErrorMessage('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        console.log('Attempting to sign in with email:', email);
        await doSignInWithEmailAndPassword(email, password);
        console.log('Sign in successful');
      } catch (error) {
        console.error("Sign in error:", error.code);
        if (error.code === 'auth/invalid-email') {
            setErrorMessage('Invalid email address. Please check your email.');
        } else if (error.code === 'auth/invalid-credential') {
            setErrorMessage('Incorrect email or password. Please try again.');
        } else {
            setErrorMessage('An error occurred during email sign in');
        }
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    
    // Clear previous error
    setErrorMessage('');
    
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        console.log('Attempting to sign in with Google');
        await doSignInWithGoogle();
        console.log('Google sign in successful');
      } catch (error) {
        console.error("Google sign in error:", error);
        setErrorMessage('An error occurred during Google sign in');
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        style={{ width: '100%' }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, sm: 5 }, 
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: '1px solid rgba(255,255,255,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle gradient background */}
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              opacity: 0.03,
              background: `radial-gradient(circle at 30% 40%, ${primaryPurple}88 0%, transparent 50%),
                         radial-gradient(circle at 70% 60%, ${secondaryGreen}88 0%, transparent 50%)`,
              zIndex: 0,
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <motion.div variants={fadeInUp}>
              <Box sx={{ textAlign: 'center', mb: 4, position: 'relative' }}>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  sx={{ 
                    mb: 1,
                    fontWeight: 500,
                    background: `linear-gradient(90deg, ${primaryPurple}, ${secondaryGreen})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '200% 100%',
                    animation: `${gradientShift} 4s ease infinite`,
                  }}
                >
                  Welcome Back
                </Typography>

                {/* Hand-drawn underline - bolder, thicker and wider */}
                <Box 
                  sx={{ 
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bottom: '-5px', 
                    width: '180px',  // Increased from 100px to 180px for wider appearance
                    height: '15px',  // Increased height from 10px to 15px to accommodate thicker stroke
                    pointerEvents: 'none',
                    zIndex: 0
                  }}
                >
                  <motion.svg 
                    width="100%" 
                    height="100%" 
                    viewBox="0 0 180 15"  // Adjusted viewBox to match new dimensions
                    style={{ overflow: 'visible' }}
                  >
                    <motion.path
                      d="M0,7.5 C30,13.5 60,3 90,7.5 C120,12 150,4.5 180,7.5"  // Adjusted path coordinates for wider line
                      fill="transparent"
                      stroke={primaryPurple}
                      strokeWidth="4"  // Increased from 2 to 4 for thickness
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.85 }}  // Increased opacity from 0.5 to 0.85 for boldness
                      transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
                    />
                  </motion.svg>
                </Box>
              </Box>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
            >
              <Typography 
                variant="body1" 
                color="text.secondary"
                align="center"
                sx={{ mb: 4 }}
              >
                Sign in to track your food expiry dates
              </Typography>
            </motion.div>
            
            {/* Display error message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  {errorMessage}
                </Alert>
              </motion.div>
            )}

            <motion.form 
              onSubmit={handleSubmit}
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                  },
                  '& input:-webkit-autofill': {
                    paddingLeft: '14px',
                  }
                }}
              />

              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handlePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                  },
                  '& input:-webkit-autofill': {
                    paddingLeft: '14px',
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ 
                  mb: 3,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 10px rgba(0,0,0,0.1)'
                  }
                }}
              >
                Sign In
              </Button>

              <Button
                type="submit"
                onClick={(e) => { onGoogleSignIn(e) }}
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ 
                  mb: 3,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 10px rgba(0,0,0,0.1)'
                  }
                }}
              >
                Sign in with Google
              </Button>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <MuiLink 
                    component={Link} 
                    to="/signup" 
                    sx={{ 
                      color: secondaryGreen,
                      textDecoration: 'none',
                      position: 'relative',
                      '&:hover': {
                        textDecoration: 'none'
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: '100%',
                        height: '1px',
                        bottom: 0,
                        left: 0,
                        backgroundColor: secondaryGreen,
                        opacity: 0.5
                      }
                    }}
                  >
                    Sign up
                  </MuiLink>
                </Typography>
              </Box>
            </motion.form>

            {/* Hand-drawn doodle (its supposed to be a radish :skull:) in bottom corner */}
            <Box sx={{ 
              position: 'absolute', 
              bottom: '-30px', 
              right: '15px', 
              opacity: 0.1, 
              zIndex: 0, 
              pointerEvents: 'none' 
            }}>
              <motion.svg width="60" height="60" viewBox="0 0 60 60">
                <defs>
                  <mask id="appleMaskLogin">
                    <rect width="60" height="60" fill="white" />
                    <motion.path
                      d="M42,25 C46,28 46,38 42,41"
                      fill="black"
                      stroke="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1.2, duration: 0.6 }}
                    />
                  </mask>
                </defs>
                
                <motion.path
                  d="M30,55 C10,35 10,20 30,15 C50,20 50,35 30,55 Z"
                  fill="none"
                  stroke={secondaryGreen}
                  strokeWidth="1.5"
                  mask="url(#appleMaskLogin)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 1.2 }}
                />
                
                <motion.path
                  d="M29,12 C29.5,8 32,6 34,5"
                  fill="none"
                  stroke={secondaryGreen}
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 2.2, duration: 0.4 }}
                />
                
                <motion.path
                  d="M34,5 C38,3 42,7 38,10"
                  fill="none"
                  stroke={secondaryGreen}
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 2.6, duration: 0.5 }}
                />
              </motion.svg>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default LoginPage;