# FirstCV - Professional CV Builder

A modern CV/Resume builder application similar to CVGrow.com, built with React (Frontend) and Node.js/Express (Backend).

## Features

- 🎨 Multiple professional CV templates
- 📝 Real-time CV preview
- 💾 Save and edit CVs
- 📄 Export to PDF
- 🎯 ATS-friendly formats
- 📱 Responsive design
- 🔒 Secure user authentication

## Tech Stack

### Frontend
- React 18
- React Router for navigation
- Tailwind CSS for styling
- jsPDF for PDF generation
- Axios for API calls

### Backend
- Node.js & Express
- MongoDB for database
- JWT authentication
- Bcrypt for password hashing
- CORS enabled

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone/Download the project

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/firstcv
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

Start the backend:

```bash
npm start
```

The backend will run on http://localhost:5000

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

The frontend will run on http://localhost:3000

## Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `build` folder to Vercel or Netlify

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables on your hosting platform
2. Deploy the backend directory
3. Update the frontend `.env` with production API URL

### MongoDB

- Use MongoDB Atlas for production database
- Update `MONGODB_URI` in backend `.env`

## Project Structure

```
firstcv-app/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── templates/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### CVs
- GET `/api/cvs` - Get all user CVs
- GET `/api/cvs/:id` - Get specific CV
- POST `/api/cvs` - Create new CV
- PUT `/api/cvs/:id` - Update CV
- DELETE `/api/cvs/:id` - Delete CV

## Usage

1. Register/Login to your account
2. Click "Create New CV"
3. Fill in your information (Personal, Education, Experience, Skills)
4. Choose a template
5. Preview your CV in real-time
6. Download as PDF or save for later editing

## License

MIT License - Feel free to use for personal or commercial projects

## Support

For issues or questions, please open an issue on GitHub or contact support.

---

Built with ❤️ for job seekers everywhere
