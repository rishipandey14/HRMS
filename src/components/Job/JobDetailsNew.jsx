import React, { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { BASE_URL } from "../../utility/Config"
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Building2,
  Users,
  CheckCircle2,
  Send,
  Share2,
} from "lucide-react"

const JobDetails = ({ isPublic = false }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { companyCode, jobId } = useParams()

  const isPublicShare = isPublic || location.pathname.includes("/jobs/share/")
  const [job, setJob] = useState(location.state?.job || null)
  const [loading, setLoading] = useState(isPublicShare && !job)
  const [loadError, setLoadError] = useState("")
  const initialTab = location.pathname.includes("/ranking") ? "ranking" : "description"
  const [activeTab, setActiveTab] = useState(initialTab)
  const [ranking, setRanking] = useState(() => (Array.isArray(location.state?.ranking) ? location.state.ranking : []))
  const [rankingLoading, setRankingLoading] = useState(false)
  const [rankingError, setRankingError] = useState("")
  const [copied, setCopied] = useState(false)

  const [applyName, setApplyName] = useState("")
  const [applyEmail, setApplyEmail] = useState("")
  const [applyPhone, setApplyPhone] = useState("")
  const [applyCoverLetter, setApplyCoverLetter] = useState("")
  const [applyFile, setApplyFile] = useState(null)
  const [applyStatus, setApplyStatus] = useState("")
  const [applyError, setApplyError] = useState("")
  const [applying, setApplying] = useState(false)
  const applyRef = useRef(null)
  const applicantCount = job?.applicantCount || 0

  useEffect(() => {
    const fetchPublicJob = async () => {
      if (!isPublicShare || job) return
      setLoading(true)
      setLoadError("")

      try {
        const response = await axios.get(`${BASE_URL}/public/job/${companyCode}/${jobId}`)
        setJob(response.data)
      } catch (error) {
        setLoadError(error.response?.data?.error || error.message || "Failed to load job details")
      } finally {
        setLoading(false)
      }
    }

    fetchPublicJob()
  }, [companyCode, jobId, isPublicShare, job])

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

  const handleShareJob = () => {
    if (!job) return
    const company = job.companyCode || companyCode || ""
    const shareUrl = `${window.location.origin}/${company}/jobs/${job.id}`
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRankResumes = async () => {
    try {
      setRankingLoading(true)
      setRankingError("")

      const token = localStorage.getItem("token")
      const response = await axios.post(
        `${BASE_URL}/jobs/${job.id}/rank`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const rankedCandidates = Array.isArray(response.data) ? response.data : []
      setRanking(rankedCandidates)

      if (location.pathname.includes("/ranking")) {
        setActiveTab("ranking")
      } else {
        navigate(`/jobs/view/ranking`, {
          state: {
            job,
            ranking: rankedCandidates,
          },
        })
      }
    } catch (error) {
      setRankingError(error.response?.data?.error || error.response?.data?.msg || "Failed to rank resumes")
    } finally {
      setRankingLoading(false)
    }
  }

  const handleApplyFile = (event) => {
    setApplyFile(event.target.files?.[0] || null)
  }

  const scrollToApply = () => {
    applyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const handleApply = async (event) => {
    event.preventDefault()
    setApplyStatus("")
    setApplyError("")

    if (!applyFile) {
      setApplyError("Please upload your resume before applying.")
      return
    }

    if (!applyName.trim()) {
      setApplyError("Please enter your name.")
      return
    }

    try {
      setApplying(true)
      const formData = new FormData()
      formData.append("name", applyName)
      formData.append("email", applyEmail)
      formData.append("phone", applyPhone)
      formData.append("coverLetter", applyCoverLetter)
      formData.append("resume", applyFile)

      const response = await axios.post(
        `${BASE_URL}/public/job/${companyCode}/${jobId}/apply`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )

      setApplyStatus("Application submitted successfully. Thank you!")
      setApplyError("")
      setApplyName("")
      setApplyEmail("")
      setApplyPhone("")
      setApplyCoverLetter("")
      setApplyFile(null)

      setJob((prevJob) => prevJob ? {
        ...prevJob,
        applicantCount: (prevJob.applicantCount || 0) + 1,
      } : prevJob)
    } catch (error) {
      setApplyError(error.response?.data?.error || error.response?.data?.msg || "Failed to submit application.")
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="text-center text-gray-700">Loading job details...</div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Unable to load job</h1>
          <p className="text-gray-600 mb-6">{loadError}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!job && !isPublicShare) {
    navigate("/jobs")
    return null
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gray-100 px-4 sm:px-6 md:px-10 py-6 space-y-6">
      {!isPublicShare && (
        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Jobs</span>
        </button>
      )}

      {isPublicShare && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
          <p className="font-semibold">📢 Public Job Listing</p>
          <p className="text-sm">You can view this job and apply without logging in.</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between gap-6 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getJobTypeStyles(job.type)}`}>
              {job.type}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(job.status)}`}>
              {job.status}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>

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
              <span>{applicantCount} applicants</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end justify-between">
          <div className="flex items-center mb-4">
            {job.applicants && job.applicants.length > 0 && (
              <>
                {job.applicants.slice(0, 5).map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar || `https://i.pravatar.cc/150?img=${index + 1}`}
                    className={`w-10 h-10 rounded-full border-2 border-white object-cover ${index !== 0 ? "-ml-3" : ""}`}
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

          <div className="flex flex-wrap gap-3 justify-end">
            {!isPublicShare && (
              <button
                onClick={handleRankResumes}
                disabled={rankingLoading}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-semibold shadow-md disabled:opacity-60"
              >
                {rankingLoading ? "Ranking..." : "Rank Resumes"}
              </button>
            )}

            <button
              onClick={handleShareJob}
              title="Copy share link to clipboard"
              className="flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-md"
            >
              <Share2 size={18} />
              {copied ? "Copied!" : "Share"}
            </button>

            {job.status === "open" && isPublicShare && (
              <button
                onClick={scrollToApply}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
              >
                <Send size={18} />
                Apply Now
              </button>
            )}
          </div>

          {job.status === "closed" && (
            <div className="px-6 py-3 bg-gray-200 text-gray-600 rounded-lg font-semibold">
              Position Closed
            </div>
          )}
        </div>
      </div>

      {isPublicShare && job.status === "open" && (
        <div ref={applyRef} className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Apply for this role</h2>
          <p className="text-sm text-gray-500 mb-4">Fill in your details and upload your resume to apply without logging in.</p>

          {applyStatus && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {applyStatus}
            </div>
          )}
          {applyError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {applyError}
            </div>
          )}

          <form onSubmit={handleApply} className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm text-gray-700">
              Name
              <input
                value={applyName}
                onChange={(e) => setApplyName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800"
                required
              />
            </label>

            <label className="space-y-1 text-sm text-gray-700">
              Email
              <input
                type="email"
                value={applyEmail}
                onChange={(e) => setApplyEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800"
                placeholder="Optional"
              />
            </label>

            <label className="space-y-1 text-sm text-gray-700">
              Phone
              <input
                type="tel"
                value={applyPhone}
                onChange={(e) => setApplyPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800"
                placeholder="Optional"
              />
            </label>

            <label className="space-y-1 text-sm text-gray-700">
              Resume
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleApplyFile}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800"
                required
              />
            </label>

            <label className="md:col-span-2 space-y-1 text-sm text-gray-700">
              Cover Letter
              <textarea
                value={applyCoverLetter}
                onChange={(e) => setApplyCoverLetter(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-800"
                placeholder="Tell us briefly why you’re a good fit."
              />
            </label>

            <button
              type="submit"
              disabled={applying}
              className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {applying ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      )}

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
          onClick={() => setActiveTab("ranking")}
          className={`py-2 font-medium transition-all duration-200 ${
            activeTab === "ranking"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          Ranked Candidates
        </button>
        {!isPublicShare && (
          <button
            onClick={() => setActiveTab("applicants")}
            className={`py-2 font-medium transition-all duration-200 ${
              activeTab === "applicants"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            Applicants ({applicantCount})
          </button>
        )}
      </div>

      <div className="w-full bg-white p-6 rounded-b-xl shadow-sm">
        {rankingError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {rankingError}
          </div>
        )}

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

        {activeTab === "ranking" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Ranked Candidates</h2>
                <p className="text-sm text-gray-500">Click Rank Resumes to open the ranking page or refresh the latest scores.</p>
              </div>
              <button
                onClick={handleRankResumes}
                disabled={rankingLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-semibold shadow-md disabled:opacity-60"
              >
                {rankingLoading ? "Ranking..." : "Refresh Ranking"}
              </button>
            </div>

            {ranking.length > 0 ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="space-y-2">
                  {ranking.map((candidate, index) => (
                    <div key={candidate.id} className="flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm">
                      <div>
                        <div className="font-medium text-gray-800">#{index + 1} {candidate.name}</div>
                        <div className="text-xs text-gray-500">ID: {candidate.id}</div>
                      </div>
                      <div className="text-sm font-semibold text-blue-700">Score: {candidate.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-gray-600">
                No ranked candidates yet. Use <span className="font-semibold">Rank Resumes</span> to generate the table.
              </div>
            )}
          </div>
        )}

        {activeTab === "applicants" && !isPublicShare && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Applicants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {job.applicants && job.applicants.length > 0 ? (
                [...Array(Math.min(applicantCount, 12))].map((_, index) => (
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
