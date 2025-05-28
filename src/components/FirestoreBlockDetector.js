import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  AlertTitle,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Link,
  IconButton,
  Switch,
  FormControlLabel
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShieldIcon from '@mui/icons-material/Shield';
import BusinessIcon from '@mui/icons-material/Business';
import BugReportIcon from '@mui/icons-material/BugReport';
import ExtensionIcon from '@mui/icons-material/Extension';
import DataObjectIcon from '@mui/icons-material/DataObject';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebase/firebase';
import mockDataService from '../services/mockDataService';

// Initialize Firestore
const db = getFirestore(app);

/**
 * Component that detects if Firestore requests are being blocked by ad blockers
 * or other privacy extensions and helps users resolve the issue
 */
const FirestoreBlockDetector = () => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [error, setError] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [useMockData, setUseMockData] = useState(() => mockDataService.isMockEnabled());

  // Run a test to see if Firestore is blocked
  const testFirestoreConnection = async () => {
    setIsTesting(true);
    setError(null);
    setTestComplete(false);

    try {
      // Try to make a simple Firestore request
      await getDocs(collection(db, 'test_connection'));
      // If we get here, connection is not blocked
      setIsBlocked(false);
      console.log('Firestore connection test successful');
    } catch (error) {
      console.error('Firestore connection test failed:', error);
      
      // Check if the error is related to being blocked by client
      if (
        error.message?.includes('blocked by client') ||
        error.message?.includes('ERR_BLOCKED_BY_CLIENT') ||
        error.code === 'unavailable' ||
        // Network errors that might be caused by blockers
        error.message?.includes('network') ||
        error.message?.includes('connection')
      ) {
        setIsBlocked(true);
      }
      
      setError(error);
    } finally {
      setIsTesting(false);
      setTestComplete(true);
    }
  };

  // Toggle mock data usage
  const handleToggleMockData = (event) => {
    const enabled = event.target.checked;
    setUseMockData(enabled);
    mockDataService.setMockEnabled(enabled);
    
    // If enabling mock data, make sure it's initialized
    if (enabled) {
      mockDataService.resetMockData();
    }
    
    // Auto-expand when enabling mock data
    if (enabled && !expanded) {
      setExpanded(true);
    }
  };
  
  // Reset mock data to defaults
  const handleResetMockData = () => {
    mockDataService.resetMockData();
    alert('Mock data has been reset to defaults.');
  };

  // Automatically test connection on mount
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV === 'development') {
      testFirestoreConnection();
    }
  }, []);

  // If we're not in development or no issues detected, don't render anything
  if (process.env.NODE_ENV !== 'development' || (!isBlocked && testComplete && !useMockData)) {
    return null;
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        mb: 3, 
        border: '1px solid',
        borderColor: isBlocked ? 'error.light' : useMockData ? 'success.light' : 'info.light',
        overflow: 'hidden'
      }}
    >
      <Alert 
        severity={isBlocked ? "error" : useMockData ? "success" : "info"}
        icon={isBlocked ? <BlockIcon /> : useMockData ? <DataObjectIcon /> : <BugReportIcon />}
        action={
          <IconButton 
            onClick={() => setExpanded(!expanded)}
            size="small"
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }
      >
        <AlertTitle>
          {isBlocked 
            ? "Firestore Connections Blocked" 
            : useMockData
              ? "Using Mock Data (Development Mode)"
              : isTesting 
                ? "Testing Firestore Connection..." 
                : "Checking Firestore Connectivity"}
        </AlertTitle>
        {isBlocked ? (
          <Typography variant="body2">
            Your browser's ad blocker or privacy extension is blocking connections to Firebase Firestore. 
            Click for instructions on how to fix this issue.
          </Typography>
        ) : useMockData ? (
          <Typography variant="body2">
            Using local mock data for development. Firestore operations are being simulated with localStorage.
          </Typography>
        ) : isTesting ? (
          <Typography variant="body2">
            Running diagnostics to check if your browser is blocking Firestore connections...
          </Typography>
        ) : (
          <Typography variant="body2">
            Firestore connection status is being verified. Expand for details.
          </Typography>
        )}
      </Alert>

      <Collapse in={expanded}>
        <Box sx={{ p: 3 }}>
          {/* Mock Data Controls */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={useMockData}
                  onChange={handleToggleMockData}
                  color="primary"
                />
              }
              label="Use Mock Data for Development"
            />
            <Typography variant="caption" sx={{ display: 'block', ml: 2, color: 'text.secondary' }}>
              When enabled, your app will use locally stored mock data instead of connecting to Firebase Firestore.
              This lets you continue development when Firestore is blocked.
            </Typography>
            
            {useMockData && (
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button 
                  startIcon={<RefreshIcon />}
                  variant="outlined" 
                  size="small"
                  onClick={handleResetMockData}
                >
                  Reset Mock Data
                </Button>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Restores default mock items and user data
                </Typography>
              </Box>
            )}
          </Box>
          
          {isBlocked && !useMockData && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                How to Fix Firestore Connection Issues
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 2 }}>
                Your browser is blocking connections to Firebase Firestore, which prevents the app from saving or retrieving data.
                This is commonly caused by ad blockers, privacy extensions, or network restrictions.
              </Typography>
              
              <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                Solutions:
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <ExtensionIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Disable Ad Blockers Temporarily" 
                    secondary="Turn off extensions like uBlock Origin, AdBlock Plus, Privacy Badger, etc."
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <ShieldIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Whitelist This Application" 
                    secondary={`Add ${window.location.origin} and firestore.googleapis.com to your ad blocker's whitelist`}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <DataObjectIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Use Mock Data (Recommended for Development)" 
                    secondary="Toggle the switch above to use locally stored mock data instead of Firestore"
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Network Restrictions" 
                    secondary="If you're on a corporate/school network, check with your IT department about firewall rules"
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Common Extensions That Block Firestore:
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                <Box component="span" sx={{ px: 1, py: 0.5, bgcolor: 'grey.100', borderRadius: 1 }}>uBlock Origin</Box>
                <Box component="span" sx={{ px: 1, py: 0.5, bgcolor: 'grey.100', borderRadius: 1 }}>AdBlock Plus</Box>
                <Box component="span" sx={{ px: 1, py: 0.5, bgcolor: 'grey.100', borderRadius: 1 }}>Privacy Badger</Box>
                <Box component="span" sx={{ px: 1, py: 0.5, bgcolor: 'grey.100', borderRadius: 1 }}>Ghostery</Box>
                <Box component="span" sx={{ px: 1, py: 0.5, bgcolor: 'grey.100', borderRadius: 1 }}>DuckDuckGo Privacy</Box>
              </Box>
            </>
          )}
          
          {!isBlocked && testComplete && !useMockData && (
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
              <CheckCircleIcon sx={{ color: 'success.main', mr: 2 }} />
              <Typography>
                Firestore connection is working correctly! No ad blocker issues detected.
              </Typography>
            </Box>
          )}
          
          {useMockData && (
            <Alert severity="success" variant="outlined" sx={{ mt: 3 }}>
              <AlertTitle>Mock Data Enabled</AlertTitle>
              <Typography variant="body2" sx={{ mb: 2 }}>
                You are now using locally stored mock data instead of Firebase Firestore. 
                This is a development-only feature that simulates Firebase operations.
              </Typography>
              
              <Typography variant="body2">
                Mock data includes:
                <ul>
                  <li>10 sample food items with various expiry dates</li>
                  <li>Simulated user authentication</li>
                  <li>Simulated storage operations</li>
                </ul>
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Note: Data will persist in your browser's localStorage between sessions.
              </Typography>
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button 
              variant="outlined" 
              color="primary"
              onClick={testFirestoreConnection}
              disabled={isTesting}
            >
              {isTesting ? "Testing..." : "Test Connection Again"}
            </Button>
            
            <Button 
              variant="contained" 
              color="primary"
              component={Link}
              href="https://firebase.google.com/docs/emulator-suite"
              target="_blank"
              rel="noopener"
            >
              Firebase Emulator Docs
            </Button>
          </Box>
          
          {error && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="error">
                Error Details:
              </Typography>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  mt: 1, 
                  bgcolor: 'grey.50',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {error.toString()}
                {error.code && `\nCode: ${error.code}`}
              </Paper>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FirestoreBlockDetector; 