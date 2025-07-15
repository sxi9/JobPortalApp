import React from 'react';
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

export const Header = ({ currentPage, setCurrentPage, isAdmin, setIsAdmin }) => (
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

export const Footer = () => (
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

export const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
  </div>
);

/* -------------------------------------------------------------------------- */
/*                                  JOB CARD                                  */
/* -------------------------------------------------------------------------- */

export const JobCard = ({ job, setSelectedJob, setCurrentPage }) => (
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
        setSelectedJob(job);
        setCurrentPage('jobDetail');
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

export const SearchFilter = ({ searchTerm, setSearchTerm, filterType, setFilterType }) => (
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

export const HomePage = ({
  loading,
  error,
  filteredJobs,
  setSelectedJob,
  setCurrentPage,
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
}) => (
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
            setSelectedJob={setSelectedJob}
            setCurrentPage={setCurrentPage}
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

export const JobDetailPage = ({ selectedJob, setCurrentPage }) => (
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

export const ApplicationForm = ({
  selectedJob,
  formData,
  setFormData,
  formErrors,
  handleSubmit,
  loading,
  setCurrentPage,
}) => (
  <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <button
      onClick={() => setCurrentPage('jobDetail')}
      className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      Back to Job Details
    </button>

    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply for {selectedJob.title}</h1>
      <p className="text-gray-600 mb-8">at {selectedJob.company}</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline h-4 w-4 mr-1" /> Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline h-4 w-4 mr-1" /> Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
          {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline h-4 w-4 mr-1" /> Resume Link
          </label>
          <input
            type="url"
            value={formData.resumeLink}
            onChange={(e) => setFormData({ ...formData, resumeLink: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.resumeLink ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://your-resume-link.com"
          />
          {formErrors.resumeLink && (
            <p className="text-red-500 text-sm mt-1">{formErrors.resumeLink}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline h-4 w-4 mr-1" /> Cover Letter
          </label>
          <textarea
            value={formData.coverLetter}
            onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
            rows="6"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.coverLetter ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Tell us why you're interested in this position..."
          />
          {formErrors.coverLetter && (
            <p className="text-red-500 text-sm mt-1">{formErrors.coverLetter}</p>
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

export const ConfirmationPage = ({ selectedJob, setCurrentPage }) => (
  <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Thank you for applying to {selectedJob.title} at {selectedJob.company}. We'll review your application and get back to you soon.
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

export const AdminView = ({ applications }) => (
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

export default {
  Header,
  Footer,
  LoadingSpinner,
  JobCard,
  SearchFilter,
  HomePage,
  JobDetailPage,
  ApplicationForm,
  ConfirmationPage,
  AdminView,
};
