// API Configuration
const API_CONFIG = {
  // Change this to your deployed API URL after deployment
  PRODUCTION_API_URL: 'https://your-app-name.railway.app',
  LOCAL_API_URL: 'http://localhost:3000',
  
  // Auto-detect environment
  getApiUrl: () => {
    // For development, use local API
    if (__DEV__) {
      return API_CONFIG.LOCAL_API_URL;
    }
    
    // For production, use deployed API
    return API_CONFIG.PRODUCTION_API_URL;
  }
};

export default API_CONFIG;