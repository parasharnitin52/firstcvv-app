# FirstCV - Professional CV Builder

A modern CV/Resume builder application m, built with React (Frontend) and Node.js/Express (Backend).

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
- Postgres for database
- JWT authentication
- Bcrypt for password hashing
- CORS enabled






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
