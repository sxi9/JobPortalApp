import React, { useState } from 'react';
import {
  Header as HeaderComp,
  Footer as FooterComp,
  LoadingSpinner as LoadingSpinnerComp,
  HomePage as HomePageComp,
  JobDetailPage as JobDetailPageComp,
  ApplicationForm as ApplicationFormComp,
  ConfirmationPage as ConfirmationPageComp,
  AdminView as AdminViewComp,
} from './components';
import { jobs } from './mockData';


// ---------------------------------------------------------------------------
// Fetch jobs from backend API
// ---------------------------------------------------------------------------
/* Removed local mockJobs – jobs are now fetched from API */
/*
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description:
      'We are looking for a Senior React Developer to join our dynamic team. You will be responsible for developing high-quality web applications using React, Redux, and modern JavaScript frameworks. The ideal candidate should have 5+ years of experience in frontend development and a strong understanding of component-based architecture.',
    requirements: [
      '5+ years React experience',
      'Strong JavaScript skills',
      'Experience with Redux',
      'Knowledge of modern build tools',
    ],
    salary: '$120,000 - $160,000',
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'Remote',
    type: 'Full-time',
    description:
      "Join our fast-growing startup as a Product Manager. You'll work closely with engineering, design, and business teams to define product strategy and roadmap. We're looking for someone with strong analytical skills and experience in agile methodologies.",
    requirements: [
      '3+ years product management',
      'Agile/Scrum experience',
      'Strong analytical skills',
      'Excellent communication',
    ],
    salary: '$90,000 - $130,000',
  },
  {
    id: 3,
    title: 'UX/UI Designer',
    company: 'DesignStudio Inc',
    location: 'New York, NY',
    type: 'Part-time',
    description:
      "We're seeking a creative UX/UI Designer to help us create intuitive and engaging user experiences. You'll be responsible for user research, wireframing, prototyping, and creating high-fidelity designs for web and mobile applications.",
    requirements: [
      'Portfolio of design work',
      'Figma/Sketch proficiency',
      'User research experience',
      'Prototyping skills',
    ],
    salary: '$60,000 - $80,000',
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'CloudTech Systems',
    location: 'Austin, TX',
    type: 'Full-time',
    description:
      "Looking for a DevOps Engineer to help us scale our infrastructure and improve deployment processes. You'll work with containerization, CI/CD pipelines, and cloud platforms to ensure reliable and efficient software delivery.",
    requirements: [
      'Docker/Kubernetes experience',
      'AWS/Azure knowledge',
      'CI/CD pipeline setup',
      'Infrastructure as Code',
    ],
    salary: '$110,000 - $140,000',
  },
  {
    id: 5,
    title: 'Data Scientist',
    company: 'DataDriven Analytics',
    location: 'Seattle, WA',
    type: 'Full-time',
    description:
      "Join our data science team to work on machine learning models and data analysis projects. You'll be responsible for extracting insights from large datasets and building predictive models to drive business decisions.",
    requirements: [
      'Python/R proficiency',
      'Machine learning experience',
      'Statistical analysis',
      'SQL knowledge',
    ],
    salary: '$100,000 - $140,000',
  },
  {
    id: 6,
    title: 'Marketing Specialist',
    company: 'GrowthMarketing Co',
    location: 'Remote',
    type: 'Part-time',
    description:
      "We're looking for a Marketing Specialist to help develop and execute marketing campaigns across digital channels. You'll work on content creation, social media management, and performance analysis.",
    requirements: [
      'Digital marketing experience',
      'Social media expertise',
      'Content creation skills',
      'Analytics tools knowledge',
    ],
    salary: '$45,000 - $65,000',
  },
*/

// initial empty arrays; data will come from API actions
const mockApplications = []; // will be removed later but kept to avoid large diff

const JobPortalApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resumeLink: '',
    coverLetter: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch applications from backend when admin view is active
  useEffect(() => {
    if (!isAdmin) return;
    const fetchApps = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:4000/applications');
        if (!res.ok) throw new Error('Failed to fetch applications');
        const data = await res.json();
        const normalized = data.map((a) => ({
          id: a._id,
          name: a.name,
          email: a.email,
          resumeLink: a.resume_link,
          jobTitle: a.job_id?.title || 'N/A',
          submittedAt: a.createdAt,
        }));
        setApplications(normalized);
  }, []);

  // Filter jobs based on search term & type
  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(
        (job) => job.type.toLowerCase() === filterType.toLowerCase()
      );
    }

    setFilteredJobs(filtered);
  }, [searchTerm, filterType, jobs]);

  // Validate application form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = 'Email is invalid';
    if (!formData.resumeLink.trim()) errors.resumeLink = 'Resume link is required';
    else if (!/^https?:\/\/.+/.test(formData.resumeLink))
      errors.resumeLink = 'Please enter a valid URL';
    if (!formData.coverLetter.trim()) errors.coverLetter = 'Cover letter is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle application submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        job_id: selectedJob._id,
        name: formData.name,
        email: formData.email,
        resume_link: formData.resumeLink,
        cover_letter: formData.coverLetter,
      };
      const res = await fetch('http://localhost:4000/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to submit application');
      const saved = await res.json();
      const normalizedSaved = {
        id: saved._id,
        name: saved.name,
        email: saved.email,
        resumeLink: saved.resume_link,
        jobTitle: selectedJob.title,
        submittedAt: saved.createdAt,
      };
      setApplications([...applications, normalizedSaved]);
      setFormData({ name: '', email: '', resumeLink: '', coverLetter: '' });
      setCurrentPage('confirmation');
    } catch (err) {
      setError(err.message || 'Error submitting application');
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------- UI Components ---------------------------- */

  const Header = () => (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">CareerBoost</h1>
          </div>
          <nav className="flex space-x-6">
            <button
              onClick={() => {
                setIsAdmin(false);
                setCurrentPage('home');
              }}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                !isAdmin && currentPage === 'home'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </button>
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isAdmin
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <Shield className="h-4 w-4 mr-1" />
              {isAdmin ? 'Exit Admin' : 'Admin View'}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p>&copy; 2025 CareerBoost. All rights reserved.</p>
          <p className="mt-2 text-gray-400">Find your dream job today</p>
        </div>
      </div>
    </footer>
  );

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            job.type === 'Full-time'
              ? 'bg-green-100 text-green-800'
              : job.type === 'Part-time'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {job.type}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <Building className="h-4 w-4 mr-2" />
          <span>{job.company}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{job.location}</span>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {job.description.substring(0, 150)}...
      </p>

      <button
        onClick={() => {
          setSelectedJob(job);
          setCurrentPage('jobDetail');
        }}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
      >
        View Details
      </button>
    </div>
  );

  const SearchFilter = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs, companies, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="all">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="remote">Remote</option>
          </select>
        </div>
      </div>
    </div>
  );

  /* -------------------------------- PAGES -------------------------------- */

  const HomePage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-xl text-gray-600">
          Discover amazing opportunities from top companies
        </p>
      </div>

      <SearchFilter />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {filteredJobs.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">No jobs found matching your criteria.</p>
        </div>
      )}
    </div>
  );

  const JobDetailPage = () => (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => setCurrentPage('home')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Jobs
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedJob.title}
            </h1>
            <div className="flex items-center text-gray-600 mb-2">
              <Building className="h-5 w-5 mr-2" />
              <span className="text-lg">{selectedJob.company}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{selectedJob.location}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium mb-2 ${
                selectedJob.type === 'Full-time'
                  ? 'bg-green-100 text-green-800'
                  : selectedJob.type === 'Part-time'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {selectedJob.type}
            </span>
            <span className="text-xl font-bold text-gray-900">
              {selectedJob.salary}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Job Description
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {selectedJob.description}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Requirements
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {selectedJob.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => setCurrentPage('application')}
          className="w-full md:w-auto bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium text-lg"
        >
          Apply Now
        </button>
      </div>
    </div>
  );

  const ApplicationForm = () => (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => setCurrentPage('jobDetail')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Job Details
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Apply for {selectedJob.title}
        </h1>
        <p className="text-gray-600 mb-8">at {selectedJob.company}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-1" /> Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline h-4 w-4 mr-1" /> Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email address"
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline h-4 w-4 mr-1" /> Resume Link
            </label>
            <input
              type="url"
              value={formData.resumeLink}
              onChange={(e) =>
                setFormData({ ...formData, resumeLink: e.target.value })
              }
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.resumeLink ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://your-resume-link.com"
            />
            {formErrors.resumeLink && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.resumeLink}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline h-4 w-4 mr-1" /> Cover Letter
            </label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) =>
                setFormData({ ...formData, coverLetter: e.target.value })
              }
              rows="6"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.coverLetter ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tell us why you're interested in this position..."
            />
            {formErrors.coverLetter && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.coverLetter}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" /> Submit Application
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );

  const ConfirmationPage = () => (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <svg
            className="h-10 w-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Application Submitted!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for applying to {selectedJob.title} at {selectedJob.company}.
          We'll review your application and get back to you soon.
        </p>
        <button
          onClick={() => setCurrentPage('home')}
          className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Browse More Jobs
        </button>
      </div>
    </div>
  );

  const AdminView = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Job Applications</h2>
        </div>

        {applications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No applications submitted yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {app.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {app.jobTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {app.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                      <a
                        href={app.resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Resume
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  /* -------------------------------- RENDER -------------------------------- */

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderComp
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      <main className="min-h-screen pb-16">
        {isAdmin ? (
          <AdminViewComp applications={applications} />
        ) : (
          <>
            {currentPage === 'home' && (
              <HomePageComp
                loading={loading}
                error={error}
                filteredJobs={filteredJobs}
                setSelectedJob={setSelectedJob}
                setCurrentPage={setCurrentPage}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterType={filterType}
                setFilterType={setFilterType}
              />
            )}
            {currentPage === 'jobDetail' && selectedJob && (
              <JobDetailPageComp
                selectedJob={selectedJob}
                setCurrentPage={setCurrentPage}
              />
            )}
            {currentPage === 'application' && selectedJob && (
              <ApplicationFormComp
                selectedJob={selectedJob}
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                handleSubmit={handleSubmit}
                loading={loading}
                setCurrentPage={setCurrentPage}
              />
            )}
            {currentPage === 'confirmation' && (
              <ConfirmationPageComp
                selectedJob={selectedJob}
                setCurrentPage={setCurrentPage}
              />
            )}
          </>
        )}
      </main>

      <FooterComp />
    </div>
  );
};

export default JobPortalApp;
