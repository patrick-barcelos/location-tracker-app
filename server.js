const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// File path for storing location data (use temp directory in production)
const DATA_FILE = process.env.NODE_ENV === 'production' 
  ? path.join('/tmp', 'locations.json')
  : path.join(__dirname, 'locations.json');

// Store location data (in production, use a database)
let locationData = [];

// Function to load data from file
const loadLocationData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      locationData = JSON.parse(data);
      console.log(`Loaded ${locationData.length} locations from file`);
    } else {
      console.log('No existing data file found, starting with empty array');
      locationData = [];
    }
  } catch (error) {
    console.error('Error loading location data:', error);
    locationData = [];
  }
};

// Function to save data to file
const saveLocationData = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(locationData, null, 2));
    console.log(`Saved ${locationData.length} locations to file`);
  } catch (error) {
    console.error('Error saving location data:', error);
  }
};

// Load existing data on startup
loadLocationData();

// POST endpoint to receive location data
app.post('/api/location', (req, res) => {
  try {
    const { latitude, longitude, accuracy, timestamp } = req.body;
    
    // Validate required fields
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        error: 'Latitude and longitude are required' 
      });
    }
    
    // Validate latitude and longitude ranges
    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({ 
        error: 'Latitude must be between -90 and 90' 
      });
    }
    
    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({ 
        error: 'Longitude must be between -180 and 180' 
      });
    }
    
    const locationEntry = {
      id: Date.now(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      accuracy: accuracy || null,
      timestamp: timestamp || new Date().toISOString(),
      receivedAt: new Date().toISOString()
    };
    
    locationData.push(locationEntry);
    
    // Keep only last 100 entries
    if (locationData.length > 100) {
      locationData = locationData.slice(-100);
    }
    
    // Save to file
    saveLocationData();
    
    console.log('Location received:', locationEntry);
    
    res.status(200).json({
      message: 'Location received successfully',
      data: locationEntry
    });
    
  } catch (error) {
    console.error('Error processing location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint to retrieve stored location data
app.get('/api/location', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const recentLocations = locationData.slice(-limit);
    
    res.status(200).json({
      message: 'Location data retrieved successfully',
      count: recentLocations.length,
      data: recentLocations
    });
    
  } catch (error) {
    console.error('Error retrieving location data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint to retrieve latest location
app.get('/api/location/latest', (req, res) => {
  try {
    if (locationData.length === 0) {
      return res.status(404).json({ 
        message: 'No location data available' 
      });
    }
    
    const latestLocation = locationData[locationData.length - 1];
    
    res.status(200).json({
      message: 'Latest location retrieved successfully',
      data: latestLocation
    });
    
  } catch (error) {
    console.error('Error retrieving latest location:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    locationsStored: locationData.length
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Location Tracking API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      postLocation: 'POST /api/location',
      getLocations: 'GET /api/location',
      getLatest: 'GET /api/location/latest'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Location API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Data file: ${DATA_FILE}`);
  console.log(`Health check: /api/health`);
  console.log(`POST location: /api/location`);
  console.log(`GET locations: /api/location`);
});