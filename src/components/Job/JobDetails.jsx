import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  Send,
} from "lucide-react"

const JobDetails = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { job } = location.state || {}
  const [activeTab, setActiveTab] = useState("description")

  // If no job data, redirect back
  if (!job) {
    navigate("/jobs")
    return null
  }

  const getJobTypeStyles = (type) => {
    switch (type?.toLowerCase()) {
      case "full-time":
        return "bg-blue-100 text-blue-800"
      case "part-time":
        return "bg-yellow-100 text-yellow-800"
      case "contract":
        return "bg-gray-100 text-gray-800"
      case "internship":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800"
      case "in-review":
        return "bg-orange-100 text-orange-800"
      case "closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gray-100 px-4 sm:px-6 md:px-10 py-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/jobs")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Jobs</span>
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-6 bg-white p-6 rounded-xl shadow-sm">
        {/* Left: Job Title & Details */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getJobTypeStyles(job.type)}`}>
              {job.type}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(job.status)}`}>
              {job.status}
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {job.title}
          </h1>
          
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <Building2 size={18} />
            <span className="font-semibold">{job.department}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} className="text-gray-400" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign size={16} className="text-gray-400" />
              <span>{job.salary}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} className="text-gray-400" />
              <span>Posted {job.postedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users size={16} className="text-gray-400" />
              <span>{job.applicantCount} applicants</span>
            </div>
          </div>
        </div>

        {/* Right: Apply Button & Applicants */}
        <div className="flex flex-col items-start md:items-end justify-between">
          <div className="flex items-center mb-4">
            {job.applicants && job.applicants.length > 0 && (
              <>
                {job.applicants.slice(0, 5).map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar || `https://i.pravatar.cc/150?img=${index + 1}`}
                    className={`w-10 h-10 rounded-full border-2 border-white object-cover ${
                      index !== 0 ? "-ml-3" : ""
                    }`}
                    alt={`Applicant ${index + 1}`}
                  />
                ))}
                {job.applicants.length > 5 && (
                  <div className="-ml-3 w-10 h-10 rounded-full border-2 border-white bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                    +{job.applicants.length - 5}
                  </div>
                )}
              </>
            )}
          </div>
          
          {job.status === "open" && (
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md">
              <Send size={18} />
              Apply Now
            </button>
          )}
          
          {job.status === "closed" && (
            <div className="px-6 py-3 bg-gray-200 text-gray-600 rounded-lg font-semibold">
              Position Closed
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-6 border-b border-gray-200 px-1 md:px-4 bg-white rounded-t-xl pt-4">
        <button
          onClick={() => setActiveTab("description")}
          className={`py-2 font-medium transition-all duration-200 ${
            activeTab === "description"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          Job Description
        </button>
        <button
          onClick={() => setActiveTab("requirements")}
          className={`py-2 font-medium transition-all duration-200 ${
            activeTab === "requirements"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          Requirements
        </button>
        <button
          onClick={() => setActiveTab("responsibilities")}
          className={`py-2 font-medium transition-all duration-200 ${
            activeTab === "responsibilities"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          Responsibilities
        </button>
        <button
          onClick={() => setActiveTab("applicants")}
          className={`py-2 font-medium transition-all duration-200 ${
            activeTab === "applicants"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          Applicants ({job.applicantCount})
        </button>
      </div>

      {/* Tab Content */}
      <div className="w-full bg-white p-6 rounded-b-xl shadow-sm">
        {activeTab === "description" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">About the Position</h2>
            <p className="text-gray-700 leading-relaxed">
              {job.description || "No description available."}
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Why Join Us?</h3>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>Competitive salary and benefits package</li>
                <li>Flexible work arrangements</li>
                <li>Professional development opportunities</li>
                <li>Collaborative and inclusive work environment</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "requirements" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Requirements</h2>
            {job.requirements && job.requirements.length > 0 ? (
              <ul className="space-y-3">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No specific requirements listed.</p>
            )}
          </div>
        )}

        {activeTab === "responsibilities" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Key Responsibilities</h2>
            {job.responsibilities && job.responsibilities.length > 0 ? (
              <ul className="space-y-3">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{resp}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No responsibilities listed.</p>
            )}
          </div>
        )}

        {activeTab === "applicants" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Applicants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {job.applicants && job.applicants.length > 0 ? (
                [...Array(Math.min(job.applicantCount, 12))].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <img
                      src={job.applicants[index % job.applicants.length] || `https://i.pravatar.cc/150?img=${index + 1}`}
                      className="w-12 h-12 rounded-full object-cover"
                      alt={`Applicant ${index + 1}`}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">Applicant {index + 1}</h3>
                      <p className="text-sm text-gray-500">Applied {Math.floor(Math.random() * 30) + 1} days ago</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full">No applicants yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDetails
