import React, { useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button,
  Container,
  Grid, 
  Paper, 
  Divider,
  Stack,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme
} from '@mui/material';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import NatureIcon from '@mui/icons-material/Nature';
import AlarmIcon from '@mui/icons-material/Alarm';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import DevicesIcon from '@mui/icons-material/Devices';
import { keyframes } from '@emotion/react';
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  LineChart, Line, 
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar,
  ReferenceLine
} from 'recharts';
import foodWasteProblemImage from '../images/food-waste.jpg';

// Gradient animation for the title text
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Arrow animation
const bounceAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// Create a reusable animated section component
const AnimatedSection = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
            duration: 0.8, 
            ease: "easeOut",
            delay: delay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Decorative hand-drawn underline component
const HandDrawnUnderline = ({ width = 180, color = '#4aeabc', delay = 0 }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (inView) {
      controls.start({ 
        pathLength: 1, 
      opacity: 1,
        transition: { duration: 1, ease: "easeInOut", delay } 
      });
    }
  }, [controls, inView, delay]);
  
  return (
    <Box
      ref={ref}
      component="svg"
      sx={{
        position: 'absolute',
        bottom: -12,
        left: '50%',
        transform: 'translateX(-50%)',
        width: width,
        height: 20,
        zIndex: 0,
        overflow: 'visible'
      }}
      viewBox="0 0 180 20"
    >
      <motion.path
        d="M6,10 C30,4 75,4 170,10"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={controls}
      />
    </Box>
  );
};

// Decorative arrow component
const DecorativeArrow = ({ direction = 'down', color = '#755dff', size = 40, top, right, bottom, left }) => {
  return (
    <Box
      component="svg"
      sx={{
        position: 'absolute',
        top,
        right,
        bottom,
        left,
        width: size,
        height: size,
        animation: `${bounceAnimation} 2s infinite ease-in-out`,
        zIndex: 1
      }}
      viewBox="0 0 24 24"
    >
      {direction === 'down' && (
        <path
          d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
          fill={color}
        />
      )}
      {direction === 'right' && (
        <path
          d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
          fill={color}
        />
      )}
    </Box>
  );
};

// Decorative apple component
const AppleDecoration = ({ size = 30, top, right, bottom, left, rotation = 0, color = '#ff6b6b' }) => {
  return (
    <Box
      component="svg"
      sx={{
        position: 'absolute',
        top,
        right,
        bottom,
        left,
        width: size,
        height: size,
        transform: `rotate(${rotation}deg)`,
        zIndex: 1
      }}
      viewBox="0 0 24 24"
    >
      <path
        d="M20,10C22,13 17,22 15,22C13,22 13,21 12,21C11,21 11,22 9,22C7,22 2,13 4,10C6,7 9,7 11,8V5C5.38,8.07 4.11,3.78 4.11,3.78C4.11,3.78 6.77,0.19 11,5V3H13V8C15,7 18,7 20,10Z"
        fill={color}
      />
    </Box>
  );
};

// Mobile phone mockup component
const PhoneMockup = ({ width = 280, height = 550 }) => {
  const theme = useTheme();
  const primaryPurple = '#755dff';
  const secondaryGreen = '#4aeabc';
  const accentOrange = '#ff9757';
  
  return (
    <Box
      sx={{
        width: width,
        height: height,
        position: 'relative',
        mx: 'auto'
      }}
    >
      {/* Phone frame */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '36px',
          border: '12px solid #2a2f45',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          position: 'relative',
          bgcolor: '#161b2c'
        }}
      >
        {/* Notch */}
        <Box
          sx={{
            width: '120px',
            height: '25px',
            bgcolor: '#2a2f45',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10
          }}
        />
        
        {/* App UI */}
        <Box
          sx={{
            p: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Status bar */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2,
              pt: 3
            }}
          >
            <Typography variant="caption" color="white">9:41</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: secondaryGreen, mr: 1 }} />
              <Box sx={{ width: 15, height: 10, borderRadius: 4, bgcolor: 'white', mr: 1 }} />
              <Typography variant="caption" color="white">100%</Typography>
            </Box>
          </Box>
          
          {/* App header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 3
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: `linear-gradient(45deg, ${primaryPurple}, ${secondaryGreen})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <InventoryIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>FreshTrack</Typography>
          </Box>
          
          {/* Food items section */}
          <Typography variant="subtitle2" sx={{ color: 'white', mb: 2 }}>Expiring Soon</Typography>
          
          {/* Food item cards */}
          {[1, 2, 3].map((item) => (
            <Box
              key={item}
              sx={{
                bgcolor: 'rgba(255,255,255,0.08)',
                borderRadius: '12px',
                p: 2,
                mb: 2,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  bgcolor: item === 1 ? 'rgba(117,93,255,0.2)' : 
                           item === 2 ? 'rgba(74,234,188,0.2)' : 'rgba(255,151,87,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                {item === 1 && <FastfoodIcon sx={{ color: primaryPurple }} />}
                {item === 2 && <RestaurantIcon sx={{ color: secondaryGreen }} />}
                {item === 3 && <ShoppingCartIcon sx={{ color: accentOrange }} />}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  {item === 1 ? 'Milk' : item === 2 ? 'Spinach' : 'Chicken Breast'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  Expires in {item === 1 ? '2' : item === 2 ? '3' : '1'} days
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: item === 1 ? primaryPurple : 
                          item === 2 ? secondaryGreen : accentOrange,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <NotificationsActiveIcon sx={{ color: 'white', fontSize: 18 }} />
              </Box>
            </Box>
          ))}
          
          {/* Bottom navigation */}
          <Box
            sx={{
              mt: 'auto',
              display: 'flex',
              justifyContent: 'space-around',
              py: 2,
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <InventoryIcon sx={{ color: primaryPurple, mb: 0.5 }} />
              <Typography variant="caption" color="white">Pantry</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ReceiptLongIcon sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5 }} />
              <Typography variant="caption" color="rgba(255,255,255,0.5)">Scan</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TrendingUpIcon sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5 }} />
              <Typography variant="caption" color="rgba(255,255,255,0.5)">Analytics</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Stat counter animation
const CounterAnimation = ({ end, duration = 2, label, icon, color }) => {
  const [count, setCount] = React.useState(0);
  const counterRef = useRef(null);
  const inView = useInView(counterRef, { once: true });
  
  useEffect(() => {
    if (inView) {
      let startTime;
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, end, duration]);
  
  return (
    <Box 
      ref={counterRef}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        position: 'relative'
      }}
    >
      <Box
        sx={{
          bgcolor: `${color}.dark`,
          width: 60,
          height: 60,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 25px ${color === 'primary' ? '#755dff33' : color === 'secondary' ? '#4aeabc33' : '#ff975733'}`,
          mb: 2
        }}
      >
        {icon}
      </Box>
      <Typography 
        variant="h3" 
        component="div" 
        sx={{ 
          fontWeight: 700, 
          color: color === 'primary' ? 'primary.main' : color === 'secondary' ? 'secondary.main' : 'warning.main',
          mb: 1
        }}
      >
        {count}%
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary" 
        align="center" 
        sx={{ 
          fontSize: '0.9rem', 
          maxWidth: '180px' 
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

// Feature card component
const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
            duration: 0.5, 
            ease: "easeOut",
            delay: delay
          }
        }
      }}
    >
      <Card 
        sx={{ 
          height: '100%',
          bgcolor: 'background.paper',
          border: '1px solid rgba(255,255,255,0.05)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 20px rgba(0,0,0,0.2)'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2 
            }}
          >
            <Box 
              sx={{ 
                bgcolor: 'rgba(117,93,255,0.1)', 
                p: 1.2, 
                borderRadius: '12px',
                mr: 2
              }}
            >
              {icon}
            </Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Step card for how it works section
const StepCard = ({ number, title, description, delay = 0 }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
      <motion.div
      ref={ref}
      animate={controls}
        initial="hidden"
      variants={{
        hidden: { opacity: 0, x: number % 2 === 0 ? 50 : -50 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { 
            duration: 0.7, 
            ease: "easeOut",
            delay: delay
          }
        }
      }}
      >
        <Box
          sx={{
          display: 'flex',
          alignItems: 'flex-start',
          mb: 6,
          position: 'relative'
        }}
      >
        {number < 4 && (
          <DecorativeArrow
            direction="down"
            top="100%"
            left={40}
            size={30}
            color="#755dff80"
          />
        )}
          <Box 
            sx={{
            bgcolor: 'primary.main', 
            color: 'white',
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            flexShrink: 0,
            mr: 2,
            boxShadow: '0 0 15px rgba(117,93,255,0.5)'
          }}
        >
          {number}
        </Box>
        <Box>
                  <Typography 
            variant="h6" 
            component="div" 
                    sx={{ 
              mb: 1,
              fontWeight: 500
            }}
          >
            {title}
                  </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ maxWidth: '500px' }}
          >
            {description}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

// Replace the current EnvironmentalImpactGraph component with this simplified version
const EnvironmentalImpactGraph = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.2 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const primaryPurple = '#755dff';
  const secondaryGreen = '#4aeabc';
  const accentOrange = '#ff9757';
  
  // Simplified data showing food waste reduction over time with FreshTrack
  const wasteReductionData = [
    { month: 'Starting', percentage: 0, label: 'Before FreshTrack' },
    { month: 'Month 1', percentage: 15, label: '15% reduction' },
    { month: 'Month 2', percentage: 28, label: '28% reduction' },
    { month: 'Month 3', percentage: 40, label: '40% reduction' },
    { month: 'Month 4', percentage: 45, label: '45% reduction' },
    { month: 'Month 5', percentage: 52, label: '52% reduction' },
    { month: 'Month 6', percentage: 58, label: '58% reduction' }
  ];

  return (
    <Box 
      ref={ref} 
                    sx={{ 
        bgcolor: 'background.paper',
        p: 4,
        borderRadius: 4,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.05)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Food Waste Reduction Over Time with FreshTrack
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Average percentage of food waste reduced by FreshTrack users over their first 6 months.
        Most users achieve significant results within the first 3 months.
      </Typography>

      {/* This Box has a fixed height to ensure the chart is visible */}
      <Box sx={{ height: 400, width: '100%', mb: 3 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={wasteReductionData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month"
              tickMargin={10}
              angle={0}
              textAnchor="middle"
            />
            <YAxis 
              tickFormatter={(value) => `${value}%`}
              label={{ 
                value: 'Waste Reduction', 
                angle: -90, 
                position: 'insideLeft', 
                fill: '#fff',
                offset: -5
              }}
            />
            <Tooltip 
              formatter={(value) => [`${value}% Waste Reduction`, 'Impact']}
              contentStyle={{ 
                backgroundColor: '#1e2233', 
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
              labelStyle={{ fontWeight: 600, marginBottom: '5px' }}
            />
            <Bar 
              dataKey="percentage" 
              name="Food Waste Reduction" 
              fill={secondaryGreen}
              radius={[8, 8, 0, 0]}
              animationDuration={1500}
              label={{
                position: 'top',
                formatter: (value) => `${value}%`,
                fill: secondaryGreen,
                fontSize: 12
              }}
            />
            {/* Highlight the average 40% result at 3 months */}
            <ReferenceLine 
              x="Month 3" 
                        stroke={primaryPurple}
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{ 
                value: 'Average User Result', 
                position: 'insideTopRight',
                fill: primaryPurple,
                fontSize: 12
              }}
            />
          </BarChart>
        </ResponsiveContainer>
                  </Box>
      
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 18, mr: 1, color: secondaryGreen }} />
          FreshTrack users reduce their food waste by an average of 40% within just 3 months
        </Typography>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <CheckCircleIcon sx={{ fontSize: 18, mr: 1, color: secondaryGreen }} />
          This represents a savings of approximately $600-$800 annually for a family of four
        </Typography>
                </Box>
    </Box>
  );
};

// Notifications mockup component for hero section
const NotificationsMockup = () => {
  const primaryPurple = '#755dff';
  const secondaryGreen = '#4aeabc';
  const accentOrange = '#ff9757';
  
  // Sample notification data
  const notifications = [
    { 
      title: 'Milk expires tomorrow', 
      message: 'Use it soon to avoid waste', 
      icon: <FastfoodIcon />, 
      time: 'Just now',
      color: accentOrange,
      urgent: true
    },
    { 
      title: 'Spinach expires in 3 days', 
      message: 'Perfect for tonight\'s dinner', 
      icon: <RestaurantIcon />, 
      time: '2 hours ago',
      color: secondaryGreen,
      urgent: false
    },
    { 
      title: 'Added 12 new items', 
      message: 'From your shopping trip', 
      icon: <ShoppingCartIcon />, 
      time: 'Yesterday',
      color: primaryPurple,
      urgent: false
    },
    { 
      title: 'Saved $32 this month', 
      message: 'By reducing food waste', 
      icon: <MonetizationOnIcon />, 
      time: '3 days ago',
      color: secondaryGreen,
      urgent: false
    }
  ];
  
  return (
    <Box
      sx={{
        width: { xs: '100%', sm: '340px' },
        bgcolor: 'background.paper',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        mx: 'auto'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: `linear-gradient(45deg, ${primaryPurple}22, ${secondaryGreen}22)`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: `linear-gradient(45deg, ${primaryPurple}, ${secondaryGreen})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5
            }}
          >
            <NotificationsActiveIcon sx={{ color: 'white', fontSize: 18 }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            FreshTrack Alerts
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Today
        </Typography>
      </Box>
      
      {/* Notifications */}
      <Box sx={{ maxHeight: '400px' }}>
        {notifications.map((notification, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                position: 'relative',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.03)'
                }
              }}
            >
              {notification.urgent && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    left: 0, 
                    top: 0, 
                    bottom: 0, 
                    width: '3px', 
                    bgcolor: accentOrange 
                  }} 
                />
              )}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  bgcolor: `${notification.color}22`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  flexShrink: 0
                }}
              >
                {React.cloneElement(notification.icon, { sx: { color: notification.color, fontSize: 20 } })}
              </Box>
              
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {notification.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1, flexShrink: 0 }}>
                    {notification.time}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {notification.message}
                </Typography>
              </Box>
            </Box>
          </motion.div>
        ))}
      </Box>
      
      {/* Footer */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'center',
          bgcolor: 'rgba(255,255,255,0.02)'
        }}
      >
        <Typography 
          variant="body2" 
          color="primary" 
          sx={{ 
            cursor: 'pointer', 
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          View All Notifications
          <ArrowForwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
        </Typography>
      </Box>
    </Box>
  );
};

const HomePage = () => {
  const theme = useTheme();
  
  // Colors from the theme
  const primaryPurple = '#755dff';
  const secondaryGreen = '#4aeabc';
  const accentOrange = '#ff9757';
  
  // Hero section parallax effect
  const [scrollY, setScrollY] = React.useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      {/* Hero Section with Parallax Effect */}
      <Box 
        sx={{ 
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'background.default'
        }}
      >
        {/* Animated background shapes */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            zIndex: 0
          }}
        >
          {/* Shape 1 */}
          <motion.div 
            animate={{
              y: [0, 20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              background: `linear-gradient(45deg, ${primaryPurple}22, ${primaryPurple}00)`,
              top: '20%',
              right: '-5%',
              zIndex: 0
            }}
          />
          
          {/* Shape 2 */}
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              rotate: [0, -8, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%',
              background: `linear-gradient(45deg, ${secondaryGreen}11, ${secondaryGreen}00)`,
              bottom: '-10%',
              left: '-5%',
              zIndex: 0
            }}
          />
        </Box>
        
        {/* Apple decorations */}
        <AppleDecoration top="15%" right="15%" size={40} rotation={-15} />
        <AppleDecoration top="65%" left="10%" size={35} rotation={25} color="#ff9f43" />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <Typography 
                  variant="overline" 
                  component="div"
                  sx={{ 
                    color: secondaryGreen,
                    fontWeight: 600,
                    letterSpacing: 1.5,
                    mb: 1,
                    position: 'relative',
                    display: 'inline-block'
                  }}
                >
                  INTRODUCING FreshTrack
                  <HandDrawnUnderline width={240} color={secondaryGreen} />
                </Typography>
                
                <Typography 
                  variant="h2" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.6,
                    mb: 2,
                    position: 'relative',
                    backgroundImage: `linear-gradient(90deg, ${primaryPurple}, ${secondaryGreen}, ${accentOrange}, ${primaryPurple})`,
                    backgroundSize: '300% 100%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: `${gradientAnimation} 6s ease infinite`,
                    display: 'inline-block'
                  }}
                >
                  Never waste food again
                </Typography>
                
                <Typography 
                  variant="h5" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 4,
                    maxWidth: '600px',
                    lineHeight: 1.6
                  }}
                >
                  The smart way to track your groceries, reduce waste, and save money with expiry date management.
                </Typography>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button 
                    component={RouterLink} 
                    to="/signup" 
                    variant="contained" 
                    color="primary"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ 
                      py: 1.5,
                      px: 3, 
                      borderRadius: 2,
                      fontWeight: 500,
                      boxShadow: '0 8px 20px rgba(117,93,255,0.3)'
                    }}
                  >
                    Get Started for Free
                  </Button>
                  
                  <Button 
                    component={RouterLink} 
                    to="/dashboard" 
                    variant="outlined"
                    color="primary"
                    size="large"
                    sx={{ 
                      py: 1.5,
                      px: 3, 
                      borderRadius: 2
                    }}
                  >
                    Explore Dashboard
                  </Button>
                </Stack>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  transform: `translateY(${scrollY * 0.1}px)`
                }}
              >
                <NotificationsMockup />
              </motion.div>
            </Grid>
          </Grid>
          
          {/* Scroll down arrow */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <DecorativeArrow direction="down" color={primaryPurple} size={40} />
          </Box>
        </Container>
      </Box>
      
      {/* Food Waste Problem Section */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper',
          py: { xs: 8, md: 12 },
          position: 'relative'
        }}
      >
        {/* Apple decorations */}
        <AppleDecoration top="20%" right="5%" size={30} rotation={-10} color="#ff6b6b" />
        <AppleDecoration bottom="15%" left="8%" size={25} rotation={15} color="#ff9f43" />
        
        <Container maxWidth="lg">
          <AnimatedSection>
            <Typography 
              variant="overline" 
              align="center" 
              component="div"
                      sx={{ 
                color: primaryPurple,
                fontWeight: 600,
                letterSpacing: 1.5,
                mb: 1,
                display: 'block',
                position: 'relative'
              }}
            >
              THE PROBLEM
            </Typography>
            
            <Typography 
              variant="h3" 
              component="h2" 
              align="center"
                      sx={{ 
                fontWeight: 700,
                mb: 2,
                position: 'relative',
                display: 'inline-block'
              }}
            >
              Food Waste Is A Global Crisis
              <HandDrawnUnderline width={300} color={accentOrange} delay={0.5} />
            </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary" 
              align="center"
                      sx={{ 
                mb: 8,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Every year, billions of dollars worth of food is thrown away. 
              The environmental impact is staggering, while many go hungry.
            </Typography>
          </AnimatedSection>
          
          {/* Statistics Row */}
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} md={4}>
              <CounterAnimation 
                end={33} 
                label="of all food produced globally is wasted each year" 
                icon={<FastfoodIcon sx={{ fontSize: 28, color: primaryPurple }} />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CounterAnimation 
                end={40} 
                label="of food waste happens in our homes, not restaurants or stores" 
                icon={<LocalShippingIcon sx={{ fontSize: 28, color: secondaryGreen }} />}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CounterAnimation 
                end={58} 
                label="of the average family's food budget goes to waste annually" 
                icon={<MonetizationOnIcon sx={{ fontSize: 28, color: accentOrange }} />}
                color="warning"
              />
            </Grid>
          </Grid>
          
          {/* Problem Details */}
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <AnimatedSection delay={0.2}>
                <Box 
                  component="img"
                  src={foodWasteProblemImage}
                  alt="Food Waste Problem"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  }}
                />
              </AnimatedSection>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <AnimatedSection delay={0.4}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 500, position: 'relative', display: 'inline-block' }}>
                  Why does this happen?
                  <HandDrawnUnderline width={220} color={primaryPurple} delay={0.6} />
                </Typography>
                
                <List sx={{ mb: 4 }}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemIcon sx={{ mt: 0.5, color: 'error.main' }}>
                      <WarningAmberIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Poor inventory management"
                      secondary="We buy food but forget about it in the back of our refrigerators and pantries."
                    />
                  </ListItem>
                  
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemIcon sx={{ mt: 0.5, color: 'error.main' }}>
                      <WarningAmberIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Expiry date confusion"
                      secondary="It's easy to miss expiration dates or misunderstand the difference between 'best by' and 'use by'."
                    />
                  </ListItem>
                  
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemIcon sx={{ mt: 0.5, color: 'error.main' }}>
                      <WarningAmberIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Overbuying and impulse purchases"
                      secondary="Shopping without a plan leads to buying more than we need, especially perishables."
                    />
                  </ListItem>
                </List>
                
                <Typography 
                  variant="body1" 
                  color="warning.main" 
                  sx={{ 
                    fontWeight: 500,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'warning.main' + '11',
                    border: '1px solid',
                    borderColor: 'warning.main' + '33'
                  }}
                >
                  The average family of four throws away nearly $1,600 worth of produce each year.
                  41% of that is fruit and veg, which goes bad much faster than other items.
                </Typography>
              </AnimatedSection>
            </Grid>
          </Grid>
          </Container>
        </Box>
      
      {/* Solution Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 },
          background: `linear-gradient(180deg, #1e2233 0%, #121829 100%)`,
          position: 'relative'
        }}
      >
        {/* Apple decorations */}
        <AppleDecoration top="10%" left="7%" size={30} rotation={-20} color="#4aeabc" />
        <AppleDecoration bottom="20%" right="5%" size={35} rotation={15} color="#755dff" />
        
        <Container maxWidth="lg">
          <AnimatedSection>
            <Typography 
              variant="overline" 
              align="center" 
              component="div"
              sx={{ 
                color: secondaryGreen,
                fontWeight: 600,
                letterSpacing: 1.5,
                mb: 1,
                display: 'block'
              }}
            >
              THE SOLUTION
            </Typography>
            
            <Typography 
              variant="h3" 
              component="h2" 
              align="center"
              sx={{ 
                fontWeight: 700,
                mb: 2,
                position: 'relative',
                display: 'inline-block'
              }}
            >
              Meet FreshTrack
              <HandDrawnUnderline width={250} color={secondaryGreen} delay={0.5} />
            </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary" 
              align="center"
              sx={{ 
                mb: 8,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              FreshTrack is a smart food management system that helps you track your groceries, 
              monitor expiration dates, and reduce waste with minimal effort.
            </Typography>
          </AnimatedSection>
          
          {/* App features */}
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard 
                icon={<ReceiptLongIcon sx={{ color: primaryPurple }} />}
                title="Scan Receipts"
                description="Automatically extract your grocery items from receipts with our smart scanner. No more manual entry."
                delay={0.1}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard 
                icon={<AlarmIcon sx={{ color: primaryPurple }} />}
                title="Expiry Tracking"
                description="Get notified before your food expires, so you can use it when it's still fresh and safe."
                delay={0.2}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard 
                icon={<InventoryIcon sx={{ color: primaryPurple }} />}
                title="Pantry Management"
                description="Always know what's in your pantry, fridge and freezer at a glance. Never buy duplicates again."
                delay={0.3}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard 
                icon={<RestaurantIcon sx={{ color: primaryPurple }} />}
                title="Meal Suggestions"
                description="Get recipe ideas based on what you have and what's about to expire. Turn potential waste into delicious meals."
                delay={0.4}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard 
                icon={<TrendingUpIcon sx={{ color: primaryPurple }} />}
                title="Waste Analytics"
                description="Track your progress in reducing food waste and see how much money you've saved over time."
                delay={0.5}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FeatureCard 
                icon={<DevicesIcon sx={{ color: primaryPurple }} />}
                title="Cross-Platform"
                description="Access FreshTrack from any device - your phone while shopping, tablet in the kitchen, or computer for planning."
                delay={0.6}
              />
            </Grid>
          </Grid>
        </Container>
        </Box>
      
      {/* How It Works Section */}
      <Box 
        sx={{ 
          bgcolor: 'background.paper',
          py: { xs: 8, md: 12 },
          position: 'relative'
        }}
      >
        {/* Apple decorations */}
        <AppleDecoration top="20%" right="10%" size={35} rotation={-15} />
        <AppleDecoration bottom="25%" left="8%" size={30} rotation={20} color="#ff9f43" />
        
        <Container maxWidth="lg">
          <AnimatedSection>
            <Typography 
              variant="overline" 
              align="center" 
              component="div"
              sx={{ 
                color: primaryPurple,
                fontWeight: 600,
                letterSpacing: 1.5,
                mb: 1,
                display: 'block'
              }}
            >
              HOW IT WORKS
            </Typography>
            
            <Typography 
              variant="h3" 
              component="h2" 
              align="center"
              sx={{ 
                fontWeight: 700,
                mb: 2,
                position: 'relative',
                display: 'inline-block'
              }}
            >
              Simple Steps to Reduce Waste
              <HandDrawnUnderline width={350} color={primaryPurple} delay={0.5} />
            </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary" 
              align="center"
              sx={{ 
                mb: 8,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Getting started with FreshTrack is easy. Just follow these simple steps 
              to transform how you manage your food.
            </Typography>
          </AnimatedSection>
          
          <Box sx={{ maxWidth: '800px', mx: 'auto', mb: 8 }}>
            <StepCard 
              number={1}
              title="Scan Your Receipt"
              description="After grocery shopping, simply take a photo of your receipt. Our smart OCR technology will automatically extract all your purchased items, categorize them, and identify which are perishable."
              delay={0.1}
            />
            
            <StepCard 
              number={2}
              title="Review Your Items"
              description="Confirm the extracted items and their expiry dates. You can make any necessary adjustments before adding them to your digital pantry."
              delay={0.3}
            />
            
            <StepCard 
              number={3}
              title="Get Smart Notifications"
              description="FreshTrack will send you timely reminders when your food is approaching its expiration date, so you can prioritize using it before it goes bad."
              delay={0.5}
            />
            
            <StepCard 
              number={4}
              title="Track Your Progress"
              description="See how much food and money you've saved over time with detailed analytics. Watch your food waste decrease month after month."
              delay={0.7}
            />
          </Box>
          
          <AnimatedSection delay={0.4}>
            <Box 
              sx={{ 
                p: 4, 
                borderRadius: 4, 
                bgcolor: 'rgba(117,93,255,0.05)',
                border: '1px solid rgba(117,93,255,0.1)',
                position: 'relative'
              }}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={7}>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
                    Ready to start saving food and money?
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Join thousands of users who have already reduced their food waste by an average of 40% 
                    in the first three months of using FreshTrack.
                  </Typography>
                  
                  <Button 
                    component={RouterLink} 
                    to="/signup" 
                    variant="contained" 
                    color="primary"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ 
                      py: 1.5,
                      px: 3,
                      borderRadius: 2,
                      fontWeight: 500
                    }}
                  >
                    Get Started for Free
                  </Button>
                </Grid>
                
                <Grid item xs={12} md={5}>
                  <Box 
                    sx={{ 
                      display: 'flex',
                      flexDirection: 'column', 
                      alignItems: 'center',
                      px: 3
                    }}
                  >
                    <PhoneMockup />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </AnimatedSection>
        </Container>
      </Box>
      
      {/* Environmental Impact Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 12 },
          background: `linear-gradient(180deg, #121829 0%, #0f1424 100%)`,
          position: 'relative'
        }}
      >
        {/* Apple decorations */}
        <AppleDecoration top="15%" left="10%" size={35} rotation={-20} color="#4aeabc" />
        <AppleDecoration bottom="10%" right="8%" size={30} rotation={25} color="#ff6b6b" />
        
        <Container maxWidth="lg">
          <AnimatedSection>
                      <Typography 
              variant="overline" 
              align="center" 
              component="div"
              sx={{ 
                color: secondaryGreen,
                fontWeight: 600,
                letterSpacing: 1.5,
                mb: 1,
                display: 'block'
              }}
            >
              THE BIGGER PICTURE
                      </Typography>
            
            <Typography 
              variant="h3" 
              component="h2" 
              align="center"
              sx={{ 
                fontWeight: 700,
                mb: 2
              }}
            >
              Make an Environmental Impact
                    </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary" 
              align="center"
                    sx={{ 
                mb: 8,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              When you reduce food waste, you're not just saving money – you're helping save the planet.
            </Typography>
          </AnimatedSection>
          
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <AnimatedSection delay={0.2}>
                <List>
                  <ListItem sx={{ mb: 3, px: 0 }}>
                    <ListItemIcon>
                    <Box 
                      sx={{ 
                          bgcolor: 'rgba(74,234,188,0.1)', 
                          p: 1, 
                          borderRadius: '50%',
                          display: 'flex'
                        }}
                      >
                        <NatureIcon sx={{ color: secondaryGreen }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          Reduce Greenhouse Gas Emissions
                        </Typography>
                      } 
                      secondary="Food decomposing in landfills produces methane, a greenhouse gas 25 times more potent than carbon dioxide. By reducing food waste, you directly combat climate change."
                    />
                  </ListItem>
                  
                  <ListItem sx={{ mb: 3, px: 0 }}>
                    <ListItemIcon>
                      <Box 
                        sx={{ 
                          bgcolor: 'rgba(74,234,188,0.1)',
                          p: 1, 
                          borderRadius: '50%',
                          display: 'flex'
                        }}
                      >
                        <NatureIcon sx={{ color: secondaryGreen }} />
                      </Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          Conserve Natural Resources
                      </Typography>
                      } 
                      secondary="Growing food requires significant land, water, and energy. When food is wasted, all those resources are wasted too. Managing your food better helps preserve these vital resources."
                    />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Box 
                        sx={{ 
                          bgcolor: 'rgba(74,234,188,0.1)', 
                          p: 1, 
                          borderRadius: '50%',
                          display: 'flex'
                        }}
                      >
                        <NatureIcon sx={{ color: secondaryGreen }} />
                    </Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="h6" sx={{ mb: 1 }}>
                          Create a Better Future
                    </Typography>
                      } 
                      secondary="If we reduced global food waste by just 25%, we could feed all undernourished people in the world. Your individual actions contribute to this global solution."
                    />
                  </ListItem>
                </List>
              </AnimatedSection>
              </Grid>
              
            <Grid item xs={12} md={6}>
              <AnimatedSection delay={0.4}>
                <EnvironmentalImpactGraph />
              </AnimatedSection>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Customer Testimonials */}
      <Box 
                    sx={{ 
                      bgcolor: 'background.paper',
          py: { xs: 8, md: 12 }
        }}
      >
        <Container maxWidth="lg">
          <AnimatedSection>
            <Typography 
              variant="overline" 
              align="center" 
              component="div"
                      sx={{ 
                color: primaryPurple,
                fontWeight: 600,
                letterSpacing: 1.5,
                mb: 1,
                display: 'block'
              }}
            >
              USER STORIES
            </Typography>
            
            <Typography 
              variant="h3" 
              component="h2" 
              align="center"
              sx={{ 
                fontWeight: 700,
                mb: 6
              }}
            >
              What Our Users Say
            </Typography>
          </AnimatedSection>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <AnimatedSection delay={0.1}>
                <Paper 
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 4,
                        display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                    "I was shocked when I realized how much food I was throwing away each month. 
                    FreshTrack helped me cut my food waste by more than half and saved me around $200 monthly!"
                  </Typography>
                  
                  <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                        sx={{ 
                          mr: 2,
                        bgcolor: 'primary.dark'
                      }}
                    >
                      SS
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">Shiven S.</Typography>
                      <Typography variant="caption" color="text.secondary">Working Mum of Two</Typography>
                    </Box>
                  </Box>
                </Paper>
              </AnimatedSection>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <AnimatedSection delay={0.2}>
                <Paper 
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 4,
                          display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                    "As a student with a tight budget, FreshTrack has been a game-changer. I now plan my meals better and waste almost nothing. I've actually started saving money for the first time!"
                  </Typography>
                  
                  <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                          sx={{ 
                        mr: 2,
                        bgcolor: 'secondary.dark'
                      }}
                    >
                      MW
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">Michael W.</Typography>
                      <Typography variant="caption" color="text.secondary">College Student</Typography>
                      </Box>
                  </Box>
                </Paper>
              </AnimatedSection>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <AnimatedSection delay={0.3}>
                <Paper 
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                    "The receipt scanning feature is brilliant! It automatically extracts all my groceries and tracks expiration dates. Now my family uses items before they go bad, and we've cut our grocery budget by 25%."
                      </Typography>
                  
                  <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        mr: 2,
                        bgcolor: 'warning.dark'
                      }}
                    >
                      AS
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">Arya S.</Typography>
                      <Typography variant="caption" color="text.secondary">Tech Professional</Typography>
                    </Box>
                  </Box>
                  </Paper>
              </AnimatedSection>
              </Grid>
            </Grid>
        </Container>
        </Box>
    </Box>
  );
};

export default HomePage;