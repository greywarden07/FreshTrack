import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Fade,
  Zoom,
  IconButton,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/authContext';
import { dataService } from '../firebase/serviceSwitcher';
import ocrService from '../services/ocr';
import { useNavigate } from 'react-router-dom';

// Custom animations
const pulseAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(117, 93, 255, 0.4); }
  70% { transform: scale(1.03); box-shadow: 0 0 0 10px rgba(117, 93, 255, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(117, 93, 255, 0); }
`;

const scanLine = keyframes`
  0% { top: 0%; }
  100% { top: 100%; }
`;

const glowEffect = keyframes`
  0% { box-shadow: 0 0 5px rgba(117, 93, 255, 0.4); }
  50% { box-shadow: 0 0 20px rgba(117, 93, 255, 0.7); }
  100% { box-shadow: 0 0 5px rgba(117, 93, 255, 0.4); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const FileUpload = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [dragActive, setDragActive] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [extractedItems, setExtractedItems] = useState([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [savingToDashboard, setSavingToDashboard] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(new Date());

  // Colors
  const darkBg = '#1e2233';
  const cardBg = '#0f1424';
  const primaryPurple = '#755dff';
  const secondaryGreen = '#4aeabc';
  const accentOrange = '#ff9757';
  const textPrimary = '#ffffff';
  const textSecondary = 'rgba(255, 255, 255, 0.6)';

  // Reset success state after 5 seconds
  useEffect(() => {
    let timer;
    if (uploadComplete) {
      timer = setTimeout(() => setUploadComplete(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [uploadComplete]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadComplete(false);
      setMessage({ type: '', text: '' });
      setProcessingComplete(false);
      setExtractedItems([]);
      
      // Create a preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
        setMessage({ type: 'error', text: 'Please select an image file.' });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a receipt image first!' });
      return;
    }

    if (!currentUser) {
      setMessage({ type: 'error', text: 'You must be logged in to upload receipts!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    setProcessingComplete(false);
    
    try {
      // We'll still use the same method, but it's now just a pass-through that doesn't store the image
      console.log("Preparing image for processing...");
      const imageResult = await dataService.saveReceiptImage(currentUser.uid, file);
      
      if (imageResult.error) {
        console.error("Image preparation error:", imageResult);
        throw new Error(imageResult.error);
      }
      
      console.log("Receipt ready for processing:", imageResult);
      
      // 2. Process the receipt with OCR directly from the file, not the saved image
      console.log("Starting OCR processing...");
      const receiptData = await ocrService.processReceipt(file);
      
      if (!receiptData) {
        throw new Error("Failed to process receipt - OCR service returned no data");
      }
      
      console.log("OCR processing complete:", receiptData);
      
      // 3. Instead of saving to the database, store the data for editing
      if (receiptData && receiptData.items && receiptData.items.length > 0) {
        console.log("Extracted items:", receiptData.items);
        // Set purchase date if available from receipt
        if (receiptData.date) {
          setPurchaseDate(receiptData.date);
        }
        
        // Add unique IDs to items for editing
        const itemsWithIds = receiptData.items.map((item, index) => {
          // Calculate days left based on expiry date
          let daysLeft = null;
          if (item.isPerishable && item.expiryDate) {
            const today = new Date();
            const expiryDate = new Date(item.expiryDate);
            const timeDiff = expiryDate.getTime() - today.getTime();
            daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
          }
          
          return {
            ...item,
            tempId: `temp-${Date.now()}-${index}`,
            purchaseDate: receiptData.date || new Date(),
            // daysLeft: daysLeft
          };
        });
        
        setExtractedItems(itemsWithIds);
        setProcessingComplete(true);
        setMessage({ 
          type: 'success', 
          text: `Receipt processed successfully! Found ${receiptData.items.length} items. You can now edit them before saving.` 
        });
      } else {
        console.warn("No items found in receipt data");
        setMessage({ 
          type: 'warning', 
          text: 'Receipt processed, but no items were detected. Try a clearer image.' 
        });
        return;
      }
      
      setUploadComplete(true);
    } catch (error) {
      console.error('Error processing receipt:', error);
      let errorMessage = error.message;
      
      // Friendly error messages for common issues
      if (errorMessage.includes('network')) {
        errorMessage = "Network error: Check your internet connection and try again.";
      } else if (errorMessage.includes('permission')) {
        errorMessage = "Permission denied: You don't have access to upload files. Please log out and log in again.";
      }
      
      setMessage({ 
        type: 'error', 
        text: `Error: ${errorMessage}` 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle saving items to dashboard
  const handleSaveToDashboard = async () => {
    if (!currentUser) {
      setMessage({ type: 'error', text: 'You must be logged in to save items!' });
      return;
    }

    if (!extractedItems || extractedItems.length === 0) {
      setMessage({ type: 'error', text: 'No items to save. Please process a receipt first.' });
      return;
    }

    setSavingToDashboard(true);
    
    try {
      // Format items for saving (remove temporary IDs)
      const itemsToSave = extractedItems.map(item => {
        const { tempId, ...rest } = item;
        return rest;
      });
      
      // Now save to the database
      await dataService.saveItems(currentUser.uid, purchaseDate, itemsToSave);
      
      setMessage({ 
        type: 'success', 
        text: `${itemsToSave.length} items saved to dashboard successfully!` 
      });
      
      // Clear form for new upload
      setTimeout(() => {
        setFile(null);
        setPreview(null);
        setExtractedItems([]);
        setProcessingComplete(false);
        
        // Navigate to dashboard to see the saved items
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error saving items to dashboard:', error);
      setMessage({ 
        type: 'error', 
        text: `Error saving to dashboard: ${error.message}` 
      });
    } finally {
      setSavingToDashboard(false);
    }
  };

  // Open the edit dialog for an item
  const handleEditItem = (item) => {
    setCurrentItem({...item});
    setShowEditDialog(true);
  };

  // Delete an item from the list
  const handleDeleteItem = (itemToDelete) => {
    setExtractedItems(extractedItems.filter(item => item.tempId !== itemToDelete.tempId));
  };

  // Save edited item
  const handleSaveEdit = () => {
    if (!currentItem) return;
    
    setExtractedItems(extractedItems.map(item => 
      item.tempId === currentItem.tempId ? currentItem : item
    ));
    
    setShowEditDialog(false);
    setCurrentItem(null);
  };

  // Update expiry date when purchase date changes
  const updatePurchaseDateForAllItems = (newPurchaseDate) => {
    // Don't proceed if there are no items
    if (!extractedItems.length) return;
    
    console.log('Updating purchase date for all items:', newPurchaseDate);
    
    // Update all items with the new purchase date and recalculate expiry dates
    const updatedItems = extractedItems.map(item => {
      if (!item.isPerishable) {
        return { ...item, purchaseDate: newPurchaseDate };
      }
      
      // Calculate new expiry date based on expiryDays from the new purchase date
      const newExpiryDate = new Date(newPurchaseDate);
      newExpiryDate.setDate(newExpiryDate.getDate() + item.expiryDays);
      
      // Calculate days left
      const today = new Date();
      const timeDiff = newExpiryDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      return {
        ...item,
        purchaseDate: newPurchaseDate,
        expiryDate: newExpiryDate,
        // daysLeft: daysLeft
      };
    });
    
    setExtractedItems(updatedItems);
  };

  // Calculate days left for an item
  const calculateDaysLeft = (expiryDate) => {
    if (!expiryDate) return null;
    
    const today = new Date();
    const expiry = expiryDate instanceof Date ? expiryDate : new Date(expiryDate);
    const timeDiff = expiry.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // Get color based on days left
  const getDaysLeftColor = (daysLeft) => {
    if (daysLeft === null) return 'default';
    if (daysLeft <= 0) return 'error';
    if (daysLeft <= 3) return 'warning';
    if (daysLeft <= 7) return 'info';
    return 'success';
  };

  // Add a new empty item
  const handleAddItem = () => {
    const today = new Date();
    const expiryDate = new Date(purchaseDate);
    expiryDate.setDate(expiryDate.getDate() + 7); // 7 days expiry by default
    
    const timeDiff = expiryDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    const newItem = {
      tempId: `temp-${Date.now()}`,
      name: '',
      category: 'uncategorized',
      quantity: '1',
      price: '$0.00',
      isPerishable: true,
      expiryDays: 7,
      purchaseDate: purchaseDate,
      expiryDate: expiryDate,
      // daysLeft: daysLeft
    };
    
    setExtractedItems([...extractedItems, newItem]);
    setCurrentItem({...newItem});
    setShowEditDialog(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setUploadComplete(false);
      setMessage({ type: '', text: '' });
      
      if (droppedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(droppedFile);
      } else {
        setPreview(null);
        setMessage({ type: 'error', text: 'Please upload an image file.' });
      }
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setMessage({ type: '', text: '' });
  };

  return (
    <Box 
      sx={{ 
        width: '100%', 
        maxWidth: '600px',
        mx: 'auto', 
        p: 2, 
        bgcolor: darkBg,
        borderRadius: 4,
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)'
      }}
    >
      {/* Header - with fixed spacing and alignment */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        px: 1 // Add some horizontal padding
      }}>
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            color: textPrimary, 
            fontWeight: 500,
            fontSize: '1.3rem'
          }}
        >
          Scan Receipt
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            bgcolor: 'rgba(255,255,255,0.05)',
            borderRadius: 2,
            px: 1.5,
            py: 0.7 // Increase vertical padding slightly
          }}
        >
          <Box 
            sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: secondaryGreen 
            }}
          />
          <Typography 
            variant="body2" 
            sx={{ 
              color: textSecondary,
              fontSize: '0.75rem',
              fontWeight: 500 // Add some weight to make it more legible
            }}
          >
            Ready to scan
          </Typography>
        </Box>
      </Box>
      
      {/* Main upload area */}
      <Paper
        elevation={0}
        component="label"
        htmlFor="receipt-upload"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 3,
          p: 3,
          mb: 2,
          minHeight: '220px',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: cardBg,
          border: `1px solid ${dragActive ? primaryPurple : 'rgba(255,255,255,0.1)'}`,
          transition: 'all 0.3s ease',
          ...(dragActive && {
            animation: `${glowEffect} 1.5s infinite`
          })
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Loading scan line effect */}
        {loading && (
          <Box 
            sx={{
              position: 'absolute',
              height: '2px',
              width: '100%',
              background: `linear-gradient(90deg, ${cardBg}, ${primaryPurple}, ${cardBg})`,
              backgroundSize: '200% 100%',
              animation: `${scanLine} 1.5s infinite ease-in-out`,
              zIndex: 2
            }}
          />
        )}
        
        {preview ? (
          <Fade in={true}>
            <Box 
              component={motion.div}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              sx={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {/* Close button to clear selection */}
              <IconButton
                size="small"
                onClick={clearFile}
                sx={{
                  position: 'absolute',
                  top: -12,
                  right: -12,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  zIndex: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              
              {/* Receipt preview with enhanced animations */}
              <Box 
                component="img"
                src={preview}
                alt="Receipt preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  borderRadius: 2,
                  filter: loading 
                    ? 'brightness(0.7) contrast(1.1)' 
                    : 'brightness(0.85)',
                  transition: 'all 0.5s ease',
                  animation: `${fadeInUp} 0.5s ease-out`,
                  ...(loading && {
                    boxShadow: '0 0 8px rgba(117,93,255,0.5)'
                  })
                }}
              />
              
              {/* Success overlay with enhanced animations */}
              {uploadComplete && (
                <Zoom in={uploadComplete}>
                  <Box 
                    component={motion.div}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      bgcolor: 'rgba(0,0,0,0.7)',
                      borderRadius: '50%',
                      p: 1.5,
                      animation: `${pulseAnimation} 2s infinite`,
                    }}
                  >
                    <CheckCircleIcon 
                      sx={{ 
                        fontSize: 50,
                        color: secondaryGreen
                      }}
                    />
                  </Box>
                </Zoom>
              )}
            </Box>
          </Fade>
        ) : (
          <Box
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              animation: `${fadeInUp} 0.5s ease-out`
            }}
          >
            <Box 
              sx={{ 
                p: 2.5, 
                borderRadius: '50%', 
                bgcolor: 'rgba(117,93,255,0.1)',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ReceiptLongIcon 
                sx={{ 
                  fontSize: 40, 
                  color: primaryPurple
                }} 
              />
            </Box>
            
            <Typography 
              variant="body1" 
              align="center" 
              sx={{ 
                color: textPrimary,
                fontWeight: 500,
                mb: 1
              }}
            >
              {dragActive ? 'Drop to Upload' : 'Upload Receipt'}
            </Typography>
            
            <Typography 
              variant="body2" 
              align="center"
              sx={{ 
                color: textSecondary,
                fontSize: '0.75rem',
                maxWidth: '80%'
              }}
            >
              Drag & drop or click to browse
            </Typography>
          </Box>
        )}
        
        <input
          id="receipt-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </Paper>
      
      {/* Mobile upload options */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          mb: 3
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          startIcon={<PhotoCameraIcon />}
          onClick={() => document.getElementById('receipt-upload').click()}
          sx={{
            borderColor: 'rgba(255,255,255,0.1)',
            color: textPrimary,
            textTransform: 'none',
            borderRadius: 2,
            py: 1
          }}
        >
          Take Photo
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading || !file}
          onClick={handleUpload}
          component={motion.button}
          whileHover={!loading && file ? { scale: 1.03 } : {}}
          whileTap={!loading && file ? { scale: 0.97 } : {}}
          sx={{
            bgcolor: primaryPurple,
            color: textPrimary,
            textTransform: 'none',
            borderRadius: 2,
            py: 1,
            '&:hover': {
              bgcolor: '#8672ff'
            },
            '&:disabled': {
              bgcolor: 'rgba(117,93,255,0.2)',
              color: 'rgba(255,255,255,0.3)'
            },
            ...(loading && {
              background: `linear-gradient(90deg, ${primaryPurple}, #8672ff, ${primaryPurple})`,
              backgroundSize: '200% 100%',
              animation: `${shimmer} 1.5s infinite linear`
            })
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={16} sx={{ color: 'white', mr: 1 }} />
              Scanning...
            </Box>
          ) : uploadComplete ? (
            'View Results'
          ) : (
            'Process Receipt'
          )}
        </Button>
      </Box>
      
      {/* Status card */}
      <Box
        sx={{
          bgcolor: cardBg,
          borderRadius: 3,
          p: 2,
          mb: 2
        }}
      >
        <Typography 
          variant="body2"
          sx={{ 
            color: textSecondary,
            fontSize: '0.75rem',
            mb: 1
          }}
        >
          STATUS
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              bgcolor: loading 
                ? primaryPurple 
                : uploadComplete 
                  ? secondaryGreen 
                  : file 
                    ? accentOrange 
                    : 'rgba(255,255,255,0.3)',
              mr: 1.5
            }}
          />
          <Typography 
            variant="body1"
            sx={{ 
              color: textPrimary,
              fontWeight: 500
            }}
          >
            {loading 
              ? 'Processing Receipt...' 
              : uploadComplete 
                ? 'Ready to Track' 
                : file 
                  ? 'Ready to Process' 
                  : 'Waiting for Receipt'}
          </Typography>
        </Box>
      </Box>
      
      {/* Message alert */}
      {message.text && (
        <Fade in={!!message.text}>
          <Alert 
            severity={message.type} 
            icon={false}
            sx={{ 
              mb: 2, 
              borderRadius: 2,
              bgcolor: message.type === 'success' 
                ? 'rgba(74, 234, 188, 0.1)' 
                : message.type === 'warning' 
                  ? 'rgba(255, 255, 0, 0.1)' 
                  : 'rgba(255, 86, 86, 0.1)',
              color: message.type === 'success' 
                ? secondaryGreen 
                : message.type === 'warning' 
                  ? accentOrange 
                  : '#ff5656',
              border: '1px solid',
              borderColor: message.type === 'success' 
                ? 'rgba(74, 234, 188, 0.2)' 
                : message.type === 'warning' 
                  ? 'rgba(255, 255, 0, 0.2)' 
                  : 'rgba(255, 86, 86, 0.2)',
            }}
          >
            {message.text}
          </Alert>
        </Fade>
      )}
      
      {/* Feature hints */}
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 1 }}>
        <Box 
          sx={{ 
            textAlign: 'center',
            opacity: 0.7,
            transition: 'opacity 0.2s',
            '&:hover': { opacity: 1 }
          }}
        >
          <Box 
            sx={{ 
              mb: 0.5, 
              width: 36, 
              height: 36, 
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto'
            }}
          >
            <Typography sx={{ color: primaryPurple, fontWeight: 'bold' }}>1</Typography>
          </Box>
          <Typography 
            variant="caption" 
            sx={{ 
              color: textSecondary,
              fontSize: '0.7rem'
            }}
          >
            Upload
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            textAlign: 'center',
            opacity: file ? 0.7 : 0.4,
            transition: 'opacity 0.2s',
            '&:hover': { opacity: file ? 1 : 0.4 }
          }}
        >
          <Box 
            sx={{ 
              mb: 0.5, 
              width: 36, 
              height: 36, 
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto'
            }}
          >
            <Typography sx={{ color: primaryPurple, fontWeight: 'bold' }}>2</Typography>
          </Box>
          <Typography 
            variant="caption" 
            sx={{ 
              color: textSecondary,
              fontSize: '0.7rem'
            }}
          >
            Process
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            textAlign: 'center',
            opacity: uploadComplete ? 0.7 : 0.4,
            transition: 'opacity 0.2s',
            '&:hover': { opacity: uploadComplete ? 1 : 0.4 }
          }}
        >
          <Box 
            sx={{ 
              mb: 0.5, 
              width: 36, 
              height: 36, 
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto'
            }}
          >
            <Typography sx={{ color: primaryPurple, fontWeight: 'bold' }}>3</Typography>
          </Box>
          <Typography 
            variant="caption" 
            sx={{ 
              color: textSecondary,
              fontSize: '0.7rem'
            }}
          >
            Track
          </Typography>
        </Box>
      </Box>
      
      {/* Show items for editing if processing is complete */}
      {processingComplete && extractedItems.length > 0 && (
        <Fade in={processingComplete}>
          <Box sx={{ mt: 4 }}>
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.1)',
                bgcolor: 'background.paper',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Extracted Items
                </Typography>
                <Button 
                  startIcon={<SaveIcon />} 
                  variant="contained" 
                  color="primary"
                  onClick={handleSaveToDashboard}
                  disabled={savingToDashboard}
                >
                  {savingToDashboard ? 'Saving...' : 'Save to Dashboard'}
                </Button>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Receipt Date:</Typography>
                <TextField
                  type="date"
                  value={purchaseDate instanceof Date ? purchaseDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setPurchaseDate(newDate);
                    updatePurchaseDateForAllItems(newDate);
                  }}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                />
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Item Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="center">Type</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Expiry Date</TableCell>
                      <TableCell align="center">Days Left</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {extractedItems.map((item) => (
                      <TableRow key={item.tempId}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={item.category} 
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(255,255,255,0.1)',
                              color: 'text.secondary'
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={item.isPerishable ? 'Perishable' : 'Non-perishable'} 
                            size="small"
                            color={item.isPerishable ? 'warning' : 'success'}
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>
                          {item.isPerishable ? (
                            item.expiryDate instanceof Date 
                            ? item.expiryDate.toLocaleDateString() 
                            : new Date(item.expiryDate).toLocaleDateString()
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {item.isPerishable ? (
                            <Chip 
                              label={calculateDaysLeft(item.expiryDate)} 
                              size="small"
                              color={getDaysLeftColor(calculateDaysLeft(item.expiryDate))}
                              sx={{ minWidth: '36px', fontSize: '0.7rem' }}
                            />
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleEditItem(item)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteItem(item)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button onClick={handleAddItem} variant="outlined">
                  Add Item
                </Button>
              </Box>
            </Paper>
          </Box>
        </Fade>
      )}
      
      {/* Edit Item Dialog */}
      <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentItem?.name ? `Edit ${currentItem.name}` : 'Add New Item'}
        </DialogTitle>
        <DialogContent>
          {currentItem && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Item Name"
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={currentItem.category}
                    label="Category"
                    onChange={(e) => setCurrentItem({...currentItem, category: e.target.value})}
                  >
                    <MenuItem value="dairy">Dairy</MenuItem>
                    <MenuItem value="meat">Meat</MenuItem>
                    <MenuItem value="produce">Produce</MenuItem>
                    <MenuItem value="bakery">Bakery</MenuItem>
                    <MenuItem value="pantry">Pantry</MenuItem>
                    <MenuItem value="frozen">Frozen</MenuItem>
                    <MenuItem value="canned">Canned</MenuItem>
                    <MenuItem value="snacks">Snacks</MenuItem>
                    <MenuItem value="beverages">Beverages</MenuItem>
                    <MenuItem value="toiletries">Toiletries</MenuItem>
                    <MenuItem value="household">Household</MenuItem>
                    <MenuItem value="pet">Pet</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                    <MenuItem value="uncategorized">Uncategorized</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={currentItem.isPerishable}
                    label="Type"
                    onChange={(e) => setCurrentItem({...currentItem, isPerishable: e.target.value})}
                  >
                    <MenuItem value={true}>Perishable</MenuItem>
                    <MenuItem value={false}>Non-Perishable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Quantity"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({...currentItem, quantity: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price"
                  value={currentItem.price}
                  onChange={(e) => setCurrentItem({...currentItem, price: e.target.value})}
                  fullWidth
                />
              </Grid>
              {/* Only show expiry options if the item is perishable */}
              {currentItem.isPerishable && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Expiry Days"
                      type="number"
                      value={currentItem.expiryDays}
                      onChange={(e) => {
                        const days = parseInt(e.target.value);
                        const newExpiryDate = new Date(purchaseDate);
                        newExpiryDate.setDate(newExpiryDate.getDate() + days);
                        
                        // Calculate days left
                        const today = new Date();
                        const timeDiff = newExpiryDate.getTime() - today.getTime();
                        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        
                        setCurrentItem({
                          ...currentItem, 
                          expiryDays: days,
                          expiryDate: newExpiryDate,
                          // daysLeft: daysLeft
                        });
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Expiry Date"
                      type="date"
                      value={currentItem.expiryDate instanceof Date 
                        ? currentItem.expiryDate.toISOString().split('T')[0] 
                        : new Date(currentItem.expiryDate).toISOString().split('T')[0]}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        const purchaseTime = purchaseDate instanceof Date ? purchaseDate : new Date(purchaseDate);
                        const timeDiff = newDate.getTime() - purchaseTime.getTime();
                        const daysDiff = Math.round(timeDiff / (1000 * 3600 * 24));
                        
                        // Calculate days left
                        const today = new Date();
                        const daysLeftTimeDiff = newDate.getTime() - today.getTime();
                        const daysLeft = Math.ceil(daysLeftTimeDiff / (1000 * 3600 * 24));
                        
                        setCurrentItem({
                          ...currentItem,
                          expiryDate: newDate,
                          expiryDays: daysDiff,
                          // daysLeft: daysLeft
                        });
                      }}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mt: 1, 
                        p: 1,
                        bgcolor: 'rgba(0,0,0,0.03)',
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        Days until expiry:
                      </Typography>
                      <Chip 
                        label={calculateDaysLeft(currentItem.expiryDate)} 
                        size="small"
                        color={getDaysLeftColor(calculateDaysLeft(currentItem.expiryDate))}
                        sx={{ minWidth: '36px', fontSize: '0.7rem' }}
                      />
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileUpload;