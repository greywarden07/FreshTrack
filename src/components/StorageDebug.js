import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Alert, 
  CircularProgress, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  Link,
  Switch,
  FormControlLabel
} from '@mui/material';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { app } from "../firebase/firebase";
import { useAuth } from '../contexts/authContext';

const storage = getStorage(app);

const StorageDebug = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [useLocalStorageFallback, setUseLocalStorageFallback] = useState(
    localStorage.getItem('useLocalStorageFallback') === 'true'
  );

  const testFirebaseStorage = async () => {
    setLoading(true);
    setResults(null);
    
    const testResults = {
      success: false,
      steps: [],
      error: null
    };
    
    try {
      if (!currentUser) {
        throw new Error("You must be logged in to test storage");
      }
      
      // Step 1: Create a test text file
      testResults.steps.push({
        name: "Creating test data",
        status: "success"
      });
      
      // Step 2: Upload to Firebase Storage
      testResults.steps.push({
        name: "Uploading test data to Firebase Storage",
        status: "running"
      });
      
      const testString = "Test data: " + new Date().toISOString();
      const storageRef = ref(storage, `debug/${currentUser.uid}/${Date.now()}_test.txt`);
      
      const snapshot = await uploadString(storageRef, testString, 'raw');
      
      testResults.steps[1].status = "success";
      testResults.steps[1].details = "Uploaded test file successfully";
      
      // Step 3: Get download URL
      testResults.steps.push({
        name: "Getting download URL",
        status: "running"
      });
      
      const downloadUrl = await getDownloadURL(snapshot.ref);
      
      testResults.steps[2].status = "success";
      testResults.steps[2].details = `Download URL: ${downloadUrl}`;
      
      // Success!
      testResults.success = true;
      
    } catch (error) {
      console.error("Storage debug test failed:", error);
      
      // Mark current step as failed
      const currentStep = testResults.steps.find(step => step.status === "running");
      if (currentStep) {
        currentStep.status = "error";
        currentStep.details = error.message;
      }
      
      testResults.error = {
        message: error.message,
        code: error.code || "unknown",
        serverResponse: error.serverResponse || null
      };
      
      // Check if CORS error
      if (error.message && error.message.includes('CORS')) {
        testResults.corsIssue = true;
      }
    } finally {
      setLoading(false);
      setResults(testResults);
    }
  };
  
  const toggleLocalStorageFallback = (event) => {
    const newValue = event.target.checked;
    setUseLocalStorageFallback(newValue);
    localStorage.setItem('useLocalStorageFallback', newValue ? 'true' : 'false');
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Firebase Storage Diagnostics</Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Test Firebase Storage Connection</Typography>
        
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          This utility will test your Firebase Storage connection by uploading a small text file.
          Use this to diagnose CORS and permission issues with Firebase Storage.
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch 
                checked={useLocalStorageFallback}
                onChange={toggleLocalStorageFallback}
                color="primary"
              />
            }
            label="Use localStorage fallback for development"
          />
          <Typography variant="caption" sx={{ display: 'block', ml: 2, color: 'text.secondary' }}>
            When enabled, images will be temporarily stored in browser's localStorage instead of Firebase Storage.
            This is useful for development when Firebase Storage has CORS issues.
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          onClick={testFirebaseStorage}
          disabled={loading || (!currentUser && !useLocalStorageFallback)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Run Storage Test"}
        </Button>
        
        {!currentUser && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            You must be logged in to test Firebase Storage.
          </Alert>
        )}
        
        {results && (
          <Box sx={{ mt: 3 }}>
            <Alert 
              severity={results.success ? "success" : "error"}
              sx={{ mb: 2 }}
            >
              {results.success 
                ? "Firebase Storage is working correctly!" 
                : "Firebase Storage test failed. See details below."}
            </Alert>
            
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Test Steps:</Typography>
            <List dense>
              {results.steps.map((step, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={step.name}
                    secondary={step.details}
                    primaryTypographyProps={{
                      color: step.status === 'error' 
                        ? 'error.main' 
                        : step.status === 'success' 
                          ? 'success.main' 
                          : 'inherit'
                    }}
                  />
                </ListItem>
              ))}
            </List>
            
            {results.error && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, color: 'error.main' }}>
                  Error Details:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.100' }}>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(results.error, null, 2)}
                  </Typography>
                </Paper>
              </>
            )}
            
            {results.corsIssue && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>CORS Issue Detected!</strong> Your Firebase Storage CORS settings need to be configured to allow uploads from {window.location.origin}.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  To fix this, you need to:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText primary="1. Go to the Firebase Console" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="2. Navigate to Storage > Rules" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="3. Make sure your Storage Rules allow write access for your user" />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="4. Configure CORS for your bucket through Firebase CLI or Google Cloud Console" />
                  </ListItem>
                </List>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Development Workaround:</strong> You can enable the "Use localStorage fallback" option above to continue testing your app without fixing the CORS issue.
                </Typography>
              </Alert>
            )}
          </Box>
        )}
      </Paper>
      
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="subtitle2" sx={{ mt: 2, color: 'text.secondary' }}>
        Firebase Configuration:
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'grey.50' }}>
        <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
          {JSON.stringify({
            projectId: app.options.projectId,
            storageBucket: app.options.storageBucket,
            authDomain: app.options.authDomain
          }, null, 2)}
        </Typography>
      </Paper>
      
      <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
        Note: This is a development tool only. If you're experiencing Firebase Storage issues in production,
        please check your Firebase Console for proper configuration.
      </Typography>
    </Box>
  );
};

export default StorageDebug; 