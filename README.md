# Job Portal Application

<div align="center">
  <p align="center">
    <a href="https://sxi9.github.io/JobPortalApp/" target="_blank">View Live Demo</a>
    ·
    <a href="https://github.com/sxi9/JobPortalApp/issues">Report Bug</a>
    ·
    <a href="https://github.com/sxi9/JobPortalApp/issues">Request Feature</a>
  </p>
  <p align="center">
    <img src="https://img.shields.io/github/stars/sxi9/JobPortalApp?style=social" alt="GitHub stars" />
    <img src="https://img.shields.io/github/forks/sxi9/JobPortalApp?style=social" alt="GitHub forks" />
    <img src="https://img.shields.io/github/license/sxi9/JobPortalApp" alt="License" />
  </p>
</div>

## 📋 About The Project

Job Portal is a modern, full-stack web application designed to bridge the gap between job seekers and employers. Built with cutting-edge technologies, it offers a seamless experience for both candidates looking for their next opportunity and employers seeking top talent.

### 🎯 Key Objectives
- Provide an intuitive platform for job seekers to discover and apply for opportunities
- Offer employers a powerful dashboard to manage job postings and applications
- Implement robust security measures to protect user data
- Ensure a responsive design that works across all devices
- Deliver a fast, reliable, and scalable solution

### 🛠️ Built With

#### Frontend
- [React](https://reactjs.org/) - Frontend library
- [Vite](https://vitejs.dev/) - Build tool and dev server
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Router](https://reactrouter.com/) - Client-side routing
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

#### Backend
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express](https://expressjs.com/) - Web application framework
- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [CORS](https://www.npmjs.com/package/cors) - Cross-origin resource sharing

#### Development Tools
- [Git](https://git-scm.com/) - Version control
- [GitHub](https://github.com/) - Code hosting
- [ESLint](https://eslint.org/) - JavaScript linter
- [Prettier](https://prettier.io/) - Code formatter

### 🌟 Features

#### For Job Seekers
- Browse and search job listings with advanced filters
- Save favorite job postings
- One-click application process
- Track application status
- Responsive design for mobile and desktop

#### For Employers/Admins
- Create and manage job postings
- Review and manage applications
- Filter and sort candidates
- Download applicant resumes
- Analytics dashboard

### 🚀 Getting Started

Get up and running with Job Portal in minutes. Follow our [installation guide](#-getting-started) to set up the development environment.

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎥 Demo

https://user-images.githubusercontent.com/your-username/your-repo-name/IMG_6434.MP4

https://github.com/sxi9/JobPortalApp/raw/main/public/demo/IMG_6434.MP4

> *Note: Click the link above to view the demo video. The video shows the job portal in action, including browsing jobs, submitting applications, and using the admin dashboard.*

## 🚀 Features

### Job Seeker Features
- Browse and search job listings
- Filter jobs by type (Full-time, Part-time, etc.)
- View detailed job descriptions
- Submit job applications with resume and cover letter
- Responsive design for all devices

### Admin Features
- View all job applications in a clean dashboard
- Filter and sort applications
- View application details including resume and cover letter
- Manage job listings

### Technical Features
- Modern React with functional components and hooks
- Vite for fast development and building
- Express.js backend with RESTful API
- MongoDB for data persistence
- CORS enabled for secure cross-origin requests
- Environment-based configuration

## 🛠️ Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- MongoDB (v4.4 or higher)
- Git

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/sxi9/JobPortalApp.git
cd JobPortalApp
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 3. Environment Setup

Create a `.env` file in the root directory:
```env
# Frontend
VITE_API_URL=http://localhost:4000/api

# Backend (server/.env)
PORT=4000
MONGO_URI=mongodb://localhost:27017/jobportal
NODE_ENV=development
```

### 4. Start MongoDB
Make sure MongoDB is running locally:
```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
```

### 5. Start the Application

#### Development Mode
1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the frontend:
```bash
# From project root
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

#### Production Build
```bash
# Build the frontend
npm run build

# Start the production server
npm run preview
```

## 🔧 Project Structure

```
JobPortalApp/
├── public/               # Static files
├── server/               # Backend source code
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── index.js          # Express server setup
├── src/                  # Frontend source code
│   ├── components/       # Reusable React components
│   ├── pages/            # Page components
│   ├── App.jsx           # Main App component
│   └── main.jsx          # Entry point
├── .env                  # Environment variables
├── package.json          # Frontend dependencies
├── server/package.json   # Backend dependencies
└── vite.config.js        # Vite configuration
```

## 📚 API Endpoints

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create a new job (Admin)
- `PUT /api/jobs/:id` - Update a job (Admin)
- `DELETE /api/jobs/:id` - Delete a job (Admin)

### Applications
- `GET /api/applications` - Get all applications (Admin)
- `GET /api/applications/:id` - Get application details
- `POST /api/applications` - Submit a new application

## 🧪 Testing

Run tests:
```bash
# Frontend tests
npm test

# Backend tests
cd server
npm test
```

## 🌐 Deployment

The application is deployed on GitHub Pages: [https://sxi9.github.io/JobPortalApp/](https://sxi9.github.io/JobPortalApp/)

> **Note**: The deployed version uses mock data. For full functionality, deploy with a MongoDB connection.

### Deployment Options

#### 1. Heroku
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

#### 2. Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsxi9%2FJobPortalApp)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">
  Made with ❤️ by Your Name
</div>

### Jobs Collection
```javascript
{
  _id: ObjectId,
  title: String,
  company: String,
  location: String,
  type: String,
  description: String,
  requirements: [String],
  salary: String,
  createdAt: Date
}
```

### Applications Collection
```javascript
{
  _id: ObjectId,
  jobId: String,
  applicantName: String,
  email: String,
  resume: String,
  status: String,
  createdAt: Date
}
```

## Environment Variables

Create a `.env` file in the `server` directory with:
```
MONGODB_URI=mongodb://localhost:27017/jobportal
PORT=4000
```
