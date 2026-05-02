# exam-prep-client

React frontend for the exam prep app. Connects to `exam-prep-server` to load questions.

## Local setup

```bash
npm install
REACT_APP_API_URL=http://localhost:3001 npm start
```

Or create a `.env.local` file:
```
REACT_APP_API_URL=http://localhost:3001
```

## Deploying to Vercel

### 1. Push this repo to GitHub (already done)

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Import the `exam-prep-client` repository
4. Framework preset: **Create React App** (auto-detected)
5. Add environment variable:
   - Key: `REACT_APP_API_URL`
   - Value: your Railway server URL (e.g. `https://exam-prep-server-production.up.railway.app`)
6. Click **Deploy**

### 3. After deploy
Every `git push` to `main` will auto-redeploy on Vercel.

## Deploying the server on Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project → Deploy from GitHub repo**
3. Select `exam-prep-server`
4. Railway auto-detects Node.js and runs `npm start`
5. Go to **Settings → Networking → Generate Domain** to get your public URL
6. Copy that URL into Vercel's `REACT_APP_API_URL` env var
7. Add a `PORT` env var in Railway if needed (Railway sets it automatically)

### CORS on Railway
The server already has `cors()` enabled for all origins. Once both are deployed, the client will fetch from the Railway URL seamlessly.
