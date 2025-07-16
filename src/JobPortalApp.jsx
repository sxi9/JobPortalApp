import React, { useState, useEffect } from 'react';
import { Briefcase, Search } from 'lucide-react';
import {
  Header,
  Footer,
  LoadingSpinner,
  HomePage,
  JobDetailPage,
  ApplicationForm,
  AdminView,
} from './components';
// Mock data for development
const mockJobs = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'We are looking for a Senior React Developer to join our team. You will be responsible for developing user interfaces using React and related technologies.',
    requirements: [
      '5+ years of experience with React',
      'Strong JavaScript/TypeScript skills',
      'Experience with Redux or Context API',
      'Familiarity with RESTful APIs'
    ],
    salary: '$120,000 - $150,000',
  },
  {
    id: 2,
    title: 'Frontend Engineer',
    company: 'WebCraft Studios',
    location: 'Remote',
    type: 'Full-time',
    description: 'Join our team as a Frontend Engineer and help us build beautiful, responsive web applications.',
    requirements: [
      '3+ years of frontend development experience',
      'Proficiency in HTML, CSS, and JavaScript',
      'Experience with modern JavaScript frameworks (React, Vue, or Angular)',
      'Knowledge of responsive design principles'
    ],
    salary: '$100,000 - $130,000',
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    company: 'DesignHub',
    location: 'New York, NY',
    type: 'Part-time',
    description: 'We are looking for a creative UI/UX Designer to join our design team.',
    requirements: [
      'Portfolio of design projects',
      'Knowledge of design tools like Figma or Sketch',
      'Understanding of user-centered design',
      'Experience with prototyping'
    ],
    salary: '$50 - $70 per hour',
  }
];

const mockApplications = []; // Will be populated from API in production

const JobPortalApp = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false); // Set to false to use MongoDB API
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

  // Fetch jobs and applications based on useMockData
  useEffect(() => {
    if (useMockData) {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setLoading(false);
    } else {
      const fetchJobs = async () => {
        const API_BASE_URL = 'http://localhost:4000';
        const API_ENDPOINT = '/api/jobs';
        const apiUrl = `${API_BASE_URL}${API_ENDPOINT}`;
        
        console.log('🔍 Fetching jobs from:', apiUrl);
        
        try {
          setLoading(true);
          setError(null);
          
          // First try with the full URL
          let response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            mode: 'cors',
          }).catch(async (fetchError) => {
            console.warn('First fetch attempt failed, trying with proxy...', fetchError);
            // If first attempt fails, try with relative URL (for Vite proxy)
            return fetch(API_ENDPOINT, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
            });
          });
          
          console.log('Response status:', response.status);
          
          if (!response.ok) {
            let errorData;
            try {
              errorData = await response.json();
            } catch (e) {
              errorData = { error: `HTTP error! status: ${response.status}` };
            }
            console.error('API Error:', errorData);
            throw new Error(errorData.error || 'Failed to fetch jobs');
          }
          
          const data = await response.json();
          console.log('Jobs data received:', data);
          
          if (!data || !Array.isArray(data)) {
            throw new Error('Invalid data received from server');
          }
          
          setJobs(data);
          setFilteredJobs(data);
          return;
          
        } catch (err) {
          console.error('Error in fetchJobs:', err);
          setError(err.message || 'Failed to fetch jobs. Please try again later.');
          
          // Fallback to mock data in development
          if (import.meta.env.DEV) {
            console.warn('Falling back to mock data');
            setJobs(mockJobs);
            setFilteredJobs(mockJobs);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchJobs();
    }
  }, [useMockData]);

  // Filter jobs based on search term & type
  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(job => job.type.toLowerCase() === filterType.toLowerCase());
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, filterType]);

  // Fetch applications from backend when admin view is active
  useEffect(() => {
    if (!isAdmin || useMockData) return;
    const fetchApps = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:4000/api/applications', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch applications');
        }
        
        const data = await res.json();
        console.log('Fetched applications:', data); // Debug log
        
        const normalized = data.map((a) => ({
          id: a._id,
          name: a.name,
          email: a.email,
          resumeLink: a.resume_link,
          jobTitle: a.job_id?.title || 'N/A',
          submittedAt: a.createdAt,
        }));
        
        setApplications(normalized);
        setError(null);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(err.message || 'Error fetching applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [isAdmin, useMockData]);

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
      const apiUrl = useMockData ? 'http://localhost:4000' : '';
      const res = await fetch(`${apiUrl}/api/applications`, {
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

  /* -------------------------------- PAGES -------------------------------- */

  /* -------------------------------- RENDER -------------------------------- */

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />

      <main className="min-h-screen pb-16">
        {isAdmin ? (
          <AdminView applications={applications} />
        ) : (
          <>
            {currentPage === 'home' && (
              <HomePage
                loading={loading}
                error={error}
                filteredJobs={filteredJobs}
                setSelectedJob={(job) => {
                  console.log('Setting selected job:', job);
                  setSelectedJob(job);
                  setCurrentPage('jobDetail');
                }}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterType={filterType}
                setFilterType={setFilterType}
              />
            )}
            {console.log('Current page:', currentPage, 'Selected job:', selectedJob)}
            {currentPage === 'jobDetail' && selectedJob && (
              <JobDetailPage
                selectedJob={selectedJob}
                setCurrentPage={setCurrentPage}
              />
            )}
            {currentPage === 'application' && selectedJob && (
              <ApplicationForm
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
              <ConfirmationPage
                selectedJob={selectedJob}
                setCurrentPage={setCurrentPage}
              />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default JobPortalApp;
