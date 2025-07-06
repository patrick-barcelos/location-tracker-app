# 🚀 Deploy Location Tracking API to Railway (Free)

## Quick Deploy Options

### Option 1: One-Click Deploy
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/nodejs)

### Option 2: Manual Deployment

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Push your code to GitHub
   - Connect Railway to your GitHub repo
   - Railway will auto-deploy

3. **Deploy from CLI**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Deploy
   railway up
   ```

## Alternative Free Platforms

### Render.com
1. Go to [render.com](https://render.com)
2. Connect GitHub repo
3. Choose "Web Service"
4. Set build command: `npm install`
5. Set start command: `npm start`

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Deploy
git push heroku main
```

## Environment Variables

Set these in your deployment platform:
- `NODE_ENV=production`
- `PORT` (usually auto-set by platform)

## After Deployment

1. **Get your API URL** (e.g., `https://your-app.railway.app`)
2. **Test endpoints**:
   - GET `/` - API info
   - GET `/api/health` - Health check
   - POST `/api/location` - Send location
   - GET `/api/location` - Get locations

3. **Update mobile apps** to use the new API URL

## Testing Your Deployed API

```bash
# Health check
curl https://your-app.railway.app/api/health

# Send test location
curl -X POST https://your-app.railway.app/api/location \
  -H "Content-Type: application/json" \
  -d '{"latitude": 37.7749, "longitude": -122.4194, "accuracy": 5}'

# Get locations
curl https://your-app.railway.app/api/location
```

## Free Tier Limits

- **Railway**: 500 hours/month, $5 credit
- **Render**: 750 hours/month
- **Vercel**: Serverless functions
- **Heroku**: 1000 dyno hours/month (with credit card)

## Need Help?

Your API is ready to deploy! Just push to GitHub and use Railway's one-click deploy.