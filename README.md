# Jobs Portal

A modern job portal application built with React and Vite.

## Features

- Browse job listings
- Apply for jobs
- Admin dashboard for managing applications
- Responsive design
- Real-time job filtering

## Deployment

The application is deployed on GitHub Pages: https://sxi9.github.io/JobPortalApp/

Note: The deployed version uses mock data. For full functionality with MongoDB, follow the setup instructions below.

## Local Development with MongoDB

1. Prerequisites:
   - Node.js (v14 or higher)
   - MongoDB (v4.0 or higher)

2. Install dependencies:
   ```bash
   npm install
   cd server
   npm install
   ```

3. Start MongoDB:
   ```bash
   mongod
   ```

4. Start the backend server:
   ```bash
   cd server
   npm start
   ```

5. Start the frontend:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:5173

## MongoDB Schema

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
