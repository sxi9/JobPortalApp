require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// Configure CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204,
  preflightContinue: false
};

// Enable pre-flight requests
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params
  });
  
  // If headers are already sent, delegate to default error handler
  if (res.headersSent) {
    return next(err);
  }
  
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// MongoDB connection
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    // Close any existing connections first
    if (mongoose.connection.readyState === 1) {
      console.log('Closing existing MongoDB connection...');
      await mongoose.disconnect();
    }
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobportal', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    console.log('✅ MongoDB connected successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Connection string used:', process.env.MONGO_URI || 'mongodb://localhost:27017/jobportal');
    console.error('Please make sure MongoDB is running and accessible');
    process.exit(1); // Exit with failure
  }
};

// Connect to MongoDB when the app starts
connectDB().catch(console.error);

// Log MongoDB connection status
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('ℹ️ Mongoose disconnected from MongoDB');
});

// Close the Mongoose connection when the Node process ends
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed through app termination');
  process.exit(0);
});

// ----- Mongoose Schemas -----
const jobSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    location: String,
    description: String,
    type: String,
  },
  { timestamps: true }
);

const applicationSchema = new mongoose.Schema(
  {
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    name: String,
    email: String,
    resume_link: String,
    cover_letter: String,
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);
const Application = mongoose.model('Application', applicationSchema);

// Seed jobs if none exist
async function seedJobs() {
  const count = await Job.countDocuments();
  if (count > 0) return;

  await Job.create([
    {
      title: 'Senior React Developer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description:
        'Develop and maintain web applications using React, Redux, and related technologies. Work closely with product and design teams.',
    },
    {
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      description:
        "Drive product strategy and roadmap. Collaborate with engineering and design to deliver market-leading features.",
    },
    {
      title: 'UX/UI Designer',
      company: 'DesignStudio Inc',
      location: 'New York, NY',
      type: 'Part-time',
      description:
        "Create intuitive and engaging user experiences, from wireframes to high-fidelity designs, for web and mobile apps.",
    },
  ]);
  console.log('Seeded default jobs');
}

// Run seeding on startup
seedJobs().catch(console.error);

// ----- Routes -----
// Use /api prefix for all routes
const router = express.Router();

// GET /api/jobs – list jobs
router.get('/jobs', async (_req, res, next) => {
  console.log('🔍 GET /api/jobs - Fetching jobs...');
  
  // Check if MongoDB is connected
  if (mongoose.connection.readyState !== 1) {
    console.error('❌ MongoDB not connected');
    return res.status(503).json({ 
      error: 'Database not available',
      message: 'Cannot connect to the database. Please try again later.'
    });
  }
  
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).lean().exec();
    console.log(`✅ Found ${jobs.length} jobs`);
    
    if (!jobs || jobs.length === 0) {
      console.log('No jobs found in the database');
      // Return empty array instead of error if no jobs found
      return res.json([]);
    }
    
    res.json(jobs);
    
  } catch (err) {
    console.error('❌ Error in GET /api/jobs:', err);
    next(err); // Pass to error handler middleware
  }
});

// GET /api/jobs/:id – job details
router.get('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/applications – submit application
router.post('/applications', async (req, res) => {
  try {
    const { job_id, name, email, resume_link, cover_letter } = req.body;

    // Basic validation
    if (!job_id || !name || !email || !resume_link || !cover_letter) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const application = await Application.create({
      job_id,
      name,
      email,
      resume_link,
      cover_letter,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/applications – get all applications (admin)
router.get('/applications', async (_req, res) => {
  try {
    const apps = await Application.find()
      .populate('job_id', 'title')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mount the router at /api
app.use('/api', router);

// Start the server
const startServer = async () => {
  try {
    // Ensure MongoDB is connected first
    if (mongoose.connection.readyState !== 1) {
      console.log('⏳ Connecting to MongoDB...');
      await connectDB();
    }

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log('\n=== Server Information ===');
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🔍 Local: http://localhost:${PORT}/api/jobs`);
      console.log(`🌐 Network: http://[YOUR_IP]:${PORT}/api/jobs`);
      console.log('===========================\n');
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      console.log('\n🔽 Shutting down gracefully...');
      await mongoose.connection.close();
      server.close(() => {
        console.log('✅ Server and database connections closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});
