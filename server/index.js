require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

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
// GET /jobs – list jobs
app.get('/jobs', async (_req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /jobs/:id – job details
app.get('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /applications – submit application
app.post('/applications', async (req, res) => {
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

// GET /applications – list applications
app.get('/applications', async (_req, res) => {
  try {
    const apps = await Application.find()
      .populate('job_id', 'title')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
