import React from 'react';
import { 
  Box, 
  Typography, 
  Button,
  Paper,
  Divider,
  Grid,
  useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import FileUpload from './FileUpload';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const UploadPage = () => {
  const theme = useTheme();
  
  // Theme colors
  const primaryPurple = theme.palette.primary.main;
  const secondaryGreen = theme.palette.secondary.main;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box sx={{ width: '100%', p: { xs: 2, md: 3 } }}>
        {/* Enhanced Page Header */}
        <Box 
          sx={{ 
            mb: 4, 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ x: -5 }}
            >
              <Button 
                component={Link} 
                to="/dashboard"
                startIcon={<ArrowBackIcon />}
                variant="outlined"
                size="small"
                sx={{ 
                  mr: 2,
                  borderRadius: '8px',
                  borderColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { 
                    borderColor: primaryPurple,
                    backgroundColor: 'rgba(117,93,255,0.08)'
                  }
                }}
              >
                Dashboard
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Box 
                sx={{
                  background: `linear-gradient(135deg, ${primaryPurple}44, ${secondaryGreen}22)`,
                  p: 1.2,
                  borderRadius: '12px',
                  mr: 2,
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                <ReceiptLongIcon sx={{ color: primaryPurple }} />
              </Box>
              <Box>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700,
                    background: `linear-gradient(90deg, ${primaryPurple}, ${secondaryGreen})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 0.5
                  }}
                >
                  Upload Receipt
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add items to your inventory by scanning your receipt
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Box>
        
        {/* Upload Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* FileUpload component with enhanced animation wrapper */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  p: 0,
                  overflow: 'hidden',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.08)',
                  height: '100%',
                  bgcolor: 'background.paper'
                }}
              >
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Receipt Scanner
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upload your grocery receipt to automatically extract items and track expiration dates
                  </Typography>
                </Box>
                
                <FileUpload />
              </Paper>
            </motion.div>
          </Grid>
          
          {/* New: Helpful tips section */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 90 }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.08)',
                  bgcolor: 'background.paper'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    bgcolor: 'rgba(74,234,188,0.1)', 
                    p: 1, 
                    borderRadius: '10px', 
                    mr: 2 
                  }}>
                    <TipsAndUpdatesOutlinedIcon sx={{ color: secondaryGreen }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Scanning Tips
                  </Typography>
                </Box>
                
                <Divider sx={{ mb: 2, opacity: 0.1 }} />
                
                <Box component="ul" sx={{ pl: 2, mt: 2 }}>
                  <Box component="li" sx={{ mb: 1.5 }}>
                    <Typography variant="body2">
                      Make sure the receipt is clear and well-lit for best results
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1.5 }}>
                    <Typography variant="body2">
                      Flatten out any wrinkles or folds before scanning
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1.5 }}>
                    <Typography variant="body2">
                      Avoid shadows or glare on the receipt surface
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography variant="body2">
                      Include the entire receipt in the frame for complete item extraction
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  mt: 3, 
                  p: 2, 
                  borderRadius: 2,
                  bgcolor: 'rgba(117,93,255,0.08)',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}>
                  <InfoOutlinedIcon sx={{ color: primaryPurple, mr: 1.5, mt: 0.3, fontSize: '1.2rem' }} />
                  <Typography variant="body2" color="text.secondary">
                    After scanning, you'll be able to verify all extracted items before they're added to your inventory.
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ 
                    width: 48, 
                    height: 48, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${primaryPurple}44, ${secondaryGreen}22)`,
                  }}>
                    <ShoppingCartIcon sx={{ color: primaryPurple }} />
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default UploadPage;