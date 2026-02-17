# 🚀 FirstCV - Quick Start Guide

Get your CV builder app running in 5 minutes!

## ✅ Prerequisites

Before you begin, make sure you have:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Either:
  - Local installation - [Download here](https://www.mongodb.com/try/download/community)
  - OR free MongoDB Atlas account - [Sign up here](https://www.mongodb.com/cloud/atlas/register)

## 🏃‍♂️ Quick Setup

### 1️⃣ Backend Setup (5 steps)

```bash
# 1. Open terminal and navigate to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Edit .env file with your settings
# For local MongoDB (default):
#   MONGODB_URI=mongodb://localhost:27017/firstcv
# For MongoDB Atlas:
#   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/firstcv

# 5. Start the backend
npm start
```

✅ **Success!** You should see: `✅ MongoDB connected successfully` and `🚀 Server running on port 5000`

### 2️⃣ Frontend Setup (4 steps)

Open a **NEW terminal window** (keep backend running):

```bash
# 1. Navigate to frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Start the frontend
npm start
```

✅ **Success!** Your browser will automatically open to http://localhost:3000

## 🎯 First Steps

1. **Register** - Create your account on the landing page
2. **Create CV** - Click "Create New CV" button
3. **Fill Details** - Add your personal info, experience, education, and skills
4. **Preview** - See your CV update in real-time
5. **Download** - Export as PDF when ready

## 📁 Project Structure

```
firstcv-app/
├── README.md              # Main documentation
├── DEPLOYMENT.md          # Production deployment guide
├── backend/               # Node.js/Express API
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Authentication
│   └── server.js         # Main server file
└── frontend/             # React application
    ├── public/           # Static files
    └── src/
        ├── components/   # Reusable components
        ├── pages/        # Page components
        ├── templates/    # CV templates
        ├── context/      # Auth context
        └── utils/        # API utilities
```

## 🔧 Common Issues & Solutions

### MongoDB Connection Failed

**Problem:** Can't connect to MongoDB

**Solutions:**
1. **Local MongoDB:** Make sure MongoDB is running
   ```bash
   # Start MongoDB (macOS with Homebrew)
   brew services start mongodb-community
   
   # Start MongoDB (Windows)
   # Run MongoDB Compass or start service from Services
   
   # Start MongoDB (Linux)
   sudo systemctl start mongod
   ```

2. **MongoDB Atlas:** 
   - Check your connection string in `.env`
   - Verify your IP is whitelisted (or use `0.0.0.0/0`)
   - Confirm database user password is correct

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find and kill the process
# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### CORS Errors

**Problem:** Frontend can't connect to backend

**Solution:**
1. Verify backend is running on port 5000
2. Check `REACT_APP_API_URL` in frontend/.env is correct:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```
3. Restart both servers

### Dependencies Installation Failed

**Problem:** `npm install` errors

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 🎨 Customization

### Change Color Theme

Edit `frontend/tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Change these values to your preferred color
    500: '#f97316',  // Main color
    600: '#ea580c',  // Darker shade
    // ... etc
  }
}
```

### Add More CV Templates

1. Create new template in `frontend/src/templates/`
2. Follow the structure of `ModernTemplate.js`
3. Update `CVEditor.js` to include your template

## 📱 Testing

1. **Register a test account:** test@firstcv.com / password123
2. **Create a sample CV** with dummy data
3. **Test PDF download**
4. **Try editing and deleting CVs**
5. **Test logout and login**

## 🌐 Next Steps - Deploy to Production

When you're ready to deploy, check out `DEPLOYMENT.md` for detailed instructions on:
- Deploying to Vercel + Railway
- Deploying to Render
- Deploying to Heroku + Netlify
- Setting up MongoDB Atlas
- Configuring custom domains
- Security best practices

## 💡 Tips

- **Save often** - Click the Save button frequently while editing
- **Use MongoDB Atlas** for production (free tier available)
- **Keep dependencies updated** - Run `npm update` periodically
- **Test across browsers** - Check Safari, Chrome, Firefox
- **Mobile responsive** - The app works on mobile devices too

## 🆘 Need Help?

1. Check the error message in:
   - Browser console (F12)
   - Backend terminal
   - MongoDB logs

2. Verify all environment variables are set correctly

3. Make sure all services are running:
   - MongoDB
   - Backend (port 5000)
   - Frontend (port 3000)

## 📞 Support Resources

- MongoDB Documentation: https://docs.mongodb.com/
- React Documentation: https://react.dev/
- Express.js Guide: https://expressjs.com/
- Node.js Docs: https://nodejs.org/docs/

---

**Ready to build amazing CVs? Let's go! 🚀**

Open http://localhost:3000 and start creating!
