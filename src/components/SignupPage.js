import React, { useState } from 'react';
import { doCreateUserWithEmailAndPassword } from '../firebase/auth';
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
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { keyframes } from '@emotion/react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// Animations
const gradientShift = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

const SignupPage = () => {
  const { currentUser, authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Theme colors
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
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

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
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
    
    if (!isSigningUp) {
      setIsSigningUp(true);
      try {
        console.log('Creating user account with email:', email);
        await doCreateUserWithEmailAndPassword(email, password, name);
        console.log('User account created successfully');
      } catch (error) {
        console.error("Error during signup:", error);
        setErrorMessage(error.message || 'An error occurred during signup');
      } finally {
        setIsSigningUp(false);
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
              background: `radial-gradient(circle at 30% 40%, ${accentOrange}88 0%, transparent 50%),
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
                    background: `linear-gradient(90deg, ${accentOrange}, ${secondaryGreen})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundSize: '200% 100%',
                    animation: `${gradientShift} 4s ease infinite`,
                  }}
                >
                  Create Account
                </Typography>

                {/* Hand-drawn underline - bolder, thicker and wider */}
                <Box 
                  sx={{ 
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bottom: '-5px', 
                    width: '220px',  // Made even wider than login page (was 150px)
                    height: '15px',  // Increased height from 10px to 15px
                    pointerEvents: 'none',
                    zIndex: 0
                  }}
                >
                  <motion.svg 
                    width="100%" 
                    height="100%" 
                    viewBox="0 0 220 15"  // Adjusted viewBox to match new dimensions
                    style={{ overflow: 'visible' }}
                  >
                    <motion.path
                      d="M0,7.5 C36,13.5 73,3 110,7.5 C147,12 183,4.5 220,7.5"  // Adjusted path coordinates for wider line
                      fill="transparent"
                      stroke={accentOrange}  // Kept the original orange color from signup page
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
                Join us to reduce food waste and save money
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
                label="Full Name"
                variant="outlined"
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!formErrors.name}
                helperText={formErrors.name}
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
                  }
                }}
              />

              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!formErrors.email}
                helperText={formErrors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: 'text.secondary' }} />
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
                error={!!formErrors.password}
                helperText={formErrors.password}
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
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                  }
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
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
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={isSigningUp}
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
                {isSigningUp ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Creating Account...
                  </Box>
                ) : (
                  'Create Account'
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <MuiLink 
                    component={Link} 
                    to="/login" 
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
                    Sign in
                  </MuiLink>
                </Typography>
              </Box>
            </motion.form>
          </Box>
          
          {/* Hand-drawn doodle in bottom corner */}
          <Box sx={{ 
            position: 'absolute', 
            bottom: '15px', 
            right: '15px', 
            opacity: 0.1, 
            zIndex: 0, 
            pointerEvents: 'none' 
          }}>
            <motion.svg width="60" height="60" viewBox="0 0 60 60">
              <defs>
                <mask id="appleMask">
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
                mask="url(#appleMask)"
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
        </Paper>
      </motion.div>
    </Container>
  );
};

export default SignupPage;