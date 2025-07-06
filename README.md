# 📍 Location Tracker App

A complete React Native GPS location tracking application with cloud-ready API backend.

## ✨ Features

### 📱 Mobile App
- **Real-time GPS tracking** with high accuracy
- **Interactive map view** with colored markers
- **Detailed list view** with location history
- **Manual location sending** with button control
- **Test location support** for development
- **Cross-platform** support (iOS, Android, Web)

### 🌐 API Backend
- **RESTful API** for location storage and retrieval
- **Persistent data storage** with JSON file system
- **Health check endpoints** for monitoring
- **CORS enabled** for web compatibility
- **Production ready** with environment variables

### ☁️ Cloud Deployment
- **One-click deployment** to Railway, Render, Vercel
- **Auto-scaling** and production configuration
- **Environment variables** management
- **Health monitoring** and error handling

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/patrick-barcelos/location-tracker-app.git
cd location-tracker-app
npm install
```

### 2. Start API Server
```bash
npm run server
# Server runs on http://localhost:3000
```

### 3. Start Mobile App
```bash
# For development
npm run dev

# For specific platforms
npm run ios
npm run android
npm run web
```

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information and endpoints |
| GET | `/api/health` | Health check status |
| POST | `/api/location` | Send location data |
| GET | `/api/location` | Get all locations |
| GET | `/api/location/latest` | Get latest location |

### Example API Usage

```bash
# Send location
curl -X POST http://localhost:3000/api/location \
  -H "Content-Type: application/json" \
  -d '{"latitude": 37.7749, "longitude": -122.4194, "accuracy": 5}'

# Get locations
curl http://localhost:3000/api/location
```

## 🌍 Deploy to Cloud

### Railway (Recommended)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/nodejs)

1. Click the deploy button above
2. Connect your GitHub account
3. Select this repository
4. Deploy automatically!

### Other Platforms
- **Render**: See `DEPLOYMENT.md` for detailed instructions
- **Vercel**: `npx vercel --prod`
- **Heroku**: Follow Heroku Node.js deployment guide

## 🏗️ Project Structure

```
├── 📱 Mobile App
│   ├── App.js          # Main app with navigation
│   ├── App.web.js      # Web-specific version
│   ├── MapView.js      # Interactive map component
│   ├── LocationsList.js # Location history list
│   └── config.js       # API configuration
├── 🌐 API Server
│   ├── server.js       # Express.js API server
│   └── locations.json  # Data storage file
├── ☁️ Deployment
│   ├── railway.json    # Railway configuration
│   ├── Procfile        # Process configuration
│   ├── .env.example    # Environment variables
│   └── DEPLOYMENT.md   # Deployment guide
└── 📱 React Native
    ├── package.json    # Dependencies
    ├── app.json        # Expo configuration
    └── assets/         # App assets
```

## 🔧 Configuration

### Development Mode
- Uses `http://localhost:3000` for API
- Requires local server running

### Production Mode
- Uses deployed API URL from `config.js`
- Automatically switches based on environment

### Environment Variables
```bash
NODE_ENV=production
PORT=3000
```

## 📱 Platform Features

| Feature | iOS | Android | Web |
|---------|-----|---------|-----|
| GPS Tracking | ✅ | ✅ | ✅ |
| Maps | ✅ | ✅ | ❌ |
| Location List | ✅ | ✅ | ✅ |
| API Integration | ✅ | ✅ | ✅ |
| Push Notifications | 🔄 | 🔄 | ❌ |

## 🛠️ Development

### Prerequisites
- Node.js 16+
- Expo CLI
- React Native development environment

### Local Development
```bash
# Install dependencies
npm install

# Start API server
npm run server

# Start mobile app (separate terminal)
npm run dev

# For web development
npm run web
```

### Testing API
```bash
# Health check
curl http://localhost:3000/api/health

# Send test location
curl -X POST http://localhost:3000/api/location \
  -H "Content-Type: application/json" \
  -d '{"latitude": 37.7749, "longitude": -122.4194, "accuracy": 5}'
```

## 🔐 Security & Privacy

- Location data stored locally/cloud with your control
- No third-party tracking or analytics
- CORS protection for API access
- Environment variable protection for sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🚀 Deploy Your Own

1. **Fork this repository**
2. **Deploy API** using Railway button above
3. **Update config.js** with your API URL
4. **Build and distribute** your app

## 📞 Support

- 📖 Check `DEPLOYMENT.md` for deployment help
- 🐛 Report issues in [GitHub Issues](https://github.com/patrick-barcelos/location-tracker-app/issues)
- 💬 Start discussions in [GitHub Discussions](https://github.com/patrick-barcelos/location-tracker-app/discussions)

---

Made with ❤️ using React Native & Express.js