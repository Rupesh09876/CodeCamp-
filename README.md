# CodeCamp Deployment & Environment Setup

## ENVIRONMENT VARIABLES NEEDED

### For `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://[your-connection-string]
JWT_SECRET=[generate a random 64-character string]
JWT_EXPIRES_IN=30d
ANTHROPIC_API_KEY=[your Claude API key from console.anthropic.com]
GOOGLE_CLIENT_ID=[from Google Cloud Console]
GOOGLE_CLIENT_SECRET=[from Google Cloud Console]
CLIENT_URL=http://localhost:3000
AI_FREE_DAILY_LIMIT=10
```

### For `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_YOUTUBE_API_KEY=[from Google Cloud Console]
```

*(Note: Since Vite is used, standard `VITE_` prefix equivalents are also provided in the generated `client/.env` file)*

## STARTUP COMMANDS

```bash
# Install all dependencies
cd server && npm install
cd ../client && npm install

# Run development servers (run both simultaneously)
cd server && npm run dev      # runs on port 8000
cd client && npm run dev      # runs on port 3000 (Vite default may be 5173, specify if needed)

# Seed the database
cd server && node seed.js
```

## DEPLOYMENT

- **Frontend → Vercel**: Connect GitHub repo, set root to `/client`, add `REACT_APP_` (or `VITE_`) env vars.
- **Backend → Railway**: Connect GitHub repo, set root to `/server`, add all server env vars.
- **Database → MongoDB Atlas**: Create free cluster, whitelist all IPs (`0.0.0.0/0`), get connection string.
# CodeCamp-
