import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Building,
  Clock,
  User,
  Mail,
  FileText,
  Send,
  ChevronLeft,
  Filter,
  Briefcase,
  Home,
  Shield,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                                   HEADER                                   */
/* -------------------------------------------------------------------------- */

const Header = ({ currentPage, setCurrentPage, isAdmin, setIsAdmin }) => (
  <header className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <Briefcase className="h-8 w-8 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
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
              isAdmin ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600'
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

/* -------------------------------------------------------------------------- */
/*                                   FOOTER                                   */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                               UTILITY PIECES                               */
/* -------------------------------------------------------------------------- */

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
  </div>
);

/* -------------------------------------------------------------------------- */
/*                                  JOB CARD                                  */
/* -------------------------------------------------------------------------- */

const JobCard = ({ job, onViewDetails }) => (
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

    <p className="text-gray-700 mb-4 line-clamp-3">{job.description?.substring(0, 150)}...</p>

    <button
      onClick={() => {
        console.log('View Details clicked for job:', job);
        onViewDetails(job);
      }}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
    >
      View Details
    </button>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                               SEARCH / FILTER                              */
/* -------------------------------------------------------------------------- */

const SearchFilter = ({ searchTerm, setSearchTerm, filterType, setFilterType }) => (
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

/* -------------------------------------------------------------------------- */
/*                                   PAGES                                    */
/* -------------------------------------------------------------------------- */

const HomePage = ({ loading, error, filteredJobs, setSelectedJob, searchTerm, setSearchTerm, filterType, setFilterType }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
      <p className="text-xl text-gray-600">Discover amazing opportunities from top companies</p>
    </div>

    <SearchFilter
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filterType={filterType}
      setFilterType={setFilterType}
    />

    {loading ? (
      <LoadingSpinner />
    ) : error ? (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <JobCard
            key={job._id || job.id}
            job={job}
            onViewDetails={setSelectedJob}
          />
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

const JobDetailPage = ({ selectedJob, setCurrentPage }) => {
  console.log('JobDetailPage - selectedJob:', selectedJob);
  
  if (!selectedJob) {
    console.error('No job selected');
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>No job selected. Please go back and select a job.</p>
      </div>
    );
  }
  
  return (
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedJob.title}</h1>
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
          <span className="text-xl font-bold text-gray-900">{selectedJob.salary}</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
        <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          {(selectedJob.requirements || []).map((req, index) => (
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
};

const ApplicationForm = ({
  selectedJob,
  formData,
  setFormData,
  formErrors,
  handleSubmit,
  loading,
  setCurrentPage
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form submission is handled by the parent component
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Apply for {selectedJob?.title}</h1>
        
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Your full name"
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="your.email@example.com"
            />
            {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="resumeLink" className="block text-sm font-medium text-gray-700 mb-1">
              Resume Link
            </label>
            <input
              type="url"
              id="resumeLink"
              name="resumeLink"
              value={formData.resumeLink}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${formErrors.resumeLink ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="https://example.com/your-resume.pdf"
            />
            <p className="mt-1 text-xs text-gray-500">Please upload your resume to a file sharing service and provide the link here.</p>
            {formErrors.resumeLink && <p className="mt-1 text-sm text-red-600">{formErrors.resumeLink}</p>}
          </div>

          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              rows={6}
              className={`w-full px-3 py-2 border rounded-md ${formErrors.coverLetter ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Tell us why you're a great fit for this position..."
            />
            {formErrors.coverLetter && <p className="mt-1 text-sm text-red-600">{formErrors.coverLetter}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setCurrentPage('jobDetail')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminView = ({ applications, loading, error, onBackToJobs }) => (
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.jobTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                    <a href={app.resumeLink} target="_blank" rel="noopener noreferrer">View Resume</a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(app.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

// Export all components as named exports
export {
  Header,
  Footer,
  LoadingSpinner,
  JobCard,
  SearchFilter,
  HomePage,
  JobDetailPage,
  ApplicationForm,
  AdminView,
};
