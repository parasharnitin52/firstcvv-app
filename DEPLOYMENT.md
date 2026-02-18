# FirstCV Deployment Guide

## Quick Local Setup (Development)

### Prerequisites
- Node.js v16+ installed
- PostgreSQL installed or hosted database (e.g. Supabase, Railway, Vercel Postgres)
- Git (optional)

### Step 1: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your settings
# For local PostgreSQL: DB_HOST=localhost, DB_NAME=firstcv, etc.
# For Production: Use your connection details

# Start the backend server
npm start
```

Backend will run on http://localhost:5000

### Step 2: Frontend Setup

```bash
# In a new terminal, navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env to set API URL
# REACT_APP_API_URL=http://localhost:5000/api

# Start the frontend
npm start
```

Frontend will open on http://localhost:3000

---

## Production Deployment

### Option 1: Deploy to Vercel (Frontend) + Railway (Backend)

#### Backend on Railway

1. Sign up at https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `/backend`
5. Add environment variables:
   ```
    PORT=5000
    DB_HOST=<your-db-host>
    DB_NAME=<your-db-name>
    DB_USER=<your-db-user>
    DB_PASSWORD=<your-db-password>
   JWT_SECRET=<random-secure-string>
   NODE_ENV=production
   FRONTEND_URL=<your-vercel-url>
   ```
6. Deploy

#### Frontend on Vercel

1. Sign up at https://vercel.com
2. Import your GitHub repository
3. Set root directory to `/frontend`
4. Add environment variable:
   ```
   REACT_APP_API_URL=<your-railway-backend-url>/api
   ```
5. Deploy

### Option 2: Deploy to Render (Full Stack)

#### Backend on Render

1. Sign up at https://render.com
2. Create new "Web Service"
3. Connect your repository
4. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables (same as Railway)
6. Deploy

#### Frontend on Render

1. Create new "Static Site"
2. Connect your repository
3. Settings:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`
4. Add environment variable:
   ```
   REACT_APP_API_URL=<your-backend-url>/api
   ```
5. Deploy

### Option 3: Deploy to Heroku (Backend) + Netlify (Frontend)

#### Backend on Heroku

```bash
# Install Heroku CLI
# Navigate to backend folder
cd backend

# Login to Heroku
heroku login

# Create new app
heroku create firstcv-api

# Deploy
git subtree push --prefix backend heroku main
```

#### Frontend on Netlify

1. Sign up at https://netlify.com
2. Drag & drop your `frontend/build` folder (after running `npm run build`)
3. Or connect GitHub and set:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
4. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-heroku-app.herokuapp.com/api
   ```

---

## PostgreSQL Setup (Recommended for Production)

1. Sign up for a PostgreSQL provider (e.g., Supabase, Heroku Postgres, AWS RDS)
2. Create a new database
3. Get your connection credentials (Host, Database, User, Password, Port)
4. Add these to your backend environment variables

---

## Environment Variables Summary

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_NAME=firstcv
DB_USER=postgres
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## Testing Deployment

1. Visit your frontend URL
2. Register a new account
3. Create a CV
4. Test saving and downloading as PDF
5. Logout and login again to verify authentication

---

## Troubleshooting

### CORS Issues
- Ensure `FRONTEND_URL` is set correctly in backend
- Check that frontend is using correct `REACT_APP_API_URL`

### Database Connection Failed
- Verify PostgreSQL is running (local) or your credentials are correct
- Check firewall settings/IP whitelisting if using a remote DB
- Verify database user permissions

### JWT Errors
- Ensure `JWT_SECRET` is set and same across deployments
- Check token expiration settings

### Build Failures
- Ensure all dependencies are listed in package.json
- Check Node.js version compatibility
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

---

## Custom Domain Setup

### Frontend (Vercel/Netlify)
1. Add custom domain in platform settings
2. Update DNS records as instructed
3. SSL certificate will be auto-generated

### Backend (Railway/Render)
1. Add custom domain in platform settings
2. Update DNS CNAME record
3. Update `FRONTEND_URL` with production domain

---

## Monitoring & Logs

- **Railway**: View logs in dashboard
- **Render**: View logs in dashboard
- **Heroku**: `heroku logs --tail`
- **Vercel/Netlify**: Check Functions/Deploy logs

---

## Security Checklist

- [ ] Change JWT_SECRET to random secure string
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic on most platforms)
- [ ] Set proper CORS origins
- [ ] Use PostgreSQL with strong password
- [ ] Enable rate limiting for API endpoints
- [ ] Keep dependencies updated
- [ ] Use .gitignore to exclude sensitive files

---

## Performance Optimization

- Enable caching headers
- Compress assets
- Use CDN for static files
- Optimize images
- Enable gzip compression
- Monitor with tools like Google Lighthouse

---

## Support

For issues:
1. Check console errors in browser DevTools
2. Check backend logs
3. Verify all environment variables are set
4. Test API endpoints with Postman
5. Review deployment platform documentation
