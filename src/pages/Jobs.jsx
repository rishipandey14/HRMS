"use client"

import { Plus, MapPin, DollarSign, Clock, Briefcase } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

// Define colors directly in the component file
const colors = {
  backgroundLight: "#f8fafc",
  backgroundDark: "#3c4045",
  textDark: "#111827",
  textMedium: "#6b7280",
  textMuted: "#9ca3af",
  bgLightAlt: "#f1f5f9",
  bgHover: "#f3f4f6",
  textHeading: "#1f2937",
  borderDefault: "#e5e7eb",
  borderSubtle: "#f3f4f6",
  borderCard: "#f0f1f3",
  borderHover: "#d1d5db",
  bgCard: "#fafbfc",
  bgColumn: "rgba(255, 255, 255, 0.8)",
  shadowSm: "0 1px 3px rgba(0, 0, 0, 0.1)",

  priorityUrgentBg: "#fee2e2",
  priorityUrgentText: "#dc2626",
  priorityHighBg: "#fef3c7",
  priorityHighText: "#d97706",
  priorityMediumBg: "#dbeafe",
  priorityMediumText: "#1d4ed8",
  priorityLowBg: "#f3f4f6",
  priorityLowText: "#6b7280",

  statusOpen: "#10b981",
  statusInReview: "#f59e0b",
  statusClosed: "#ef4444",

  avatarCountBg: "#dbeafe",
  avatarCountText: "#1d4ed8",
}

// JobCard Component
function JobCard({ job, onClick }) {
  const getJobTypeStyles = (type) => {
    switch (type.toLowerCase()) {
      case "full-time":
        return { backgroundColor: colors.priorityMediumBg, color: colors.priorityMediumText }
      case "part-time":
        return { backgroundColor: colors.priorityHighBg, color: colors.priorityHighText }
      case "contract":
        return { backgroundColor: colors.priorityLowBg, color: colors.priorityLowText }
      case "internship":
        return { backgroundColor: colors.priorityUrgentBg, color: colors.priorityUrgentText }
      default:
        return { backgroundColor: colors.priorityMediumBg, color: colors.priorityMediumText }
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return colors.statusOpen
      case "in-review":
        return colors.statusInReview
      case "closed":
        return colors.statusClosed
      default:
        return colors.statusOpen
    }
  }

  const jobTypeStyles = getJobTypeStyles(job.type)
  const statusColor = getStatusColor(job.status)

  return (
    <div
      className="mb-1 rounded-3xl border p-4 transition-all hover:-translate-y-px hover:bg-white cursor-pointer"
      style={{
        borderColor: colors.borderCard,
        backgroundColor: colors.bgCard,
        boxShadow: colors.shadowSm,
      }}
      onClick={() => onClick(job)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="inline-block rounded px-2 py-1 text-xs font-medium capitalize" style={jobTypeStyles}>
          {job.type}
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: statusColor }}></div>
          <span className="text-xs font-medium capitalize" style={{ color: colors.textMedium }}>
            {job.status}
          </span>
        </div>
      </div>
      
      <h3 className="m-0 mb-2 text-base font-semibold leading-tight" style={{ color: colors.textDark }}>
        {job.title}
      </h3>
      
      <p className="text-sm mb-4" style={{ color: colors.textMedium }}>
        {job.department}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs" style={{ color: colors.textMedium }}>
          <MapPin size={14} />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: colors.textMedium }}>
          <DollarSign size={14} />
          <span>{job.salary}</span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: colors.textMedium }}>
          <Clock size={14} />
          <span>Posted {job.postedDate}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: colors.borderSubtle }}>
        <div className="flex items-center">
          {job.applicants && job.applicants.length > 0 && (
            <>
              {job.applicants.slice(0, 3).map((avatar, index) => (
                <img
                  key={index}
                  src={avatar || "/placeholder.svg?height=24&width=24"}
                  alt="Applicant"
                  className="relative -ml-2 h-6 w-6 rounded-full border-2 border-white object-cover first:ml-0"
                />
              ))}
              {job.applicants.length > 3 && (
                <div
                  className="relative -ml-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold"
                  style={{ backgroundColor: colors.avatarCountBg, color: colors.avatarCountText }}
                >
                  {`+${job.applicants.length - 3}`}
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs font-medium" style={{ color: colors.textMedium }}>
          <Briefcase size={14} />
          <span>{job.applicantCount} applicants</span>
        </div>
      </div>
    </div>
  )
}

// JobColumn Component
function JobColumn({ title, count, jobs, type, isAdminPanelOpen, isUserPanelOpen, onJobClick }) {
  const statusIndicatorColor =
    type === "open" ? colors.statusOpen : type === "in-review" ? colors.statusInReview : colors.statusClosed

  return (
    <div
      className="flex h-fit max-h-[80vh] flex-col rounded-3xl border p-5 shadow-sm"
      style={{
        borderColor: colors.borderDefault,
        backgroundColor: colors.bgColumn,
        boxShadow: colors.shadowSm,
      }}
    >
      <div
        className="mb-5 flex flex-shrink-0 items-center justify-between border-b pb-3"
        style={{ borderColor: colors.borderSubtle }}
      >
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: statusIndicatorColor }}></div>
          <span className="text-base font-semibold" style={{ color: colors.textDark }}>
            {title}
          </span>
          <span className="text-sm font-medium" style={{ color: colors.textMedium }}>
            ({count})
          </span>
        </div>
        {isAdminPanelOpen && !isUserPanelOpen && (
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full border bg-white text-text-medium transition-all hover:bg-bg-hover cursor-pointer"
            style={{
              borderColor: colors.borderDefault,
              color: colors.textMedium,
            }}
          >
            <Plus size={16} />
          </button>
        )}
      </div>
      <div className="column-content flex flex-1 flex-col gap-4 overflow-y-auto pr-1">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onClick={onJobClick} />
        ))}
      </div>
    </div>
  )
}

// Main JobsView Component
export default function JobsView() {
  const navigate = useNavigate()
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(true)

  const handleJobClick = (job) => {
    navigate('/jobs/view', { state: { job } })
  }

  // Modal + form state for adding a job
  const [showAddModal, setShowAddModal] = useState(false)
  const [newJobTitle, setNewJobTitle] = useState('')
  const [newJobDepartment, setNewJobDepartment] = useState('')
  const [newJobType, setNewJobType] = useState('Full-time')
  const [newJobStatus, setNewJobStatus] = useState('open')
  const [newJobLocation, setNewJobLocation] = useState('Remote')
  const [newJobSalary, setNewJobSalary] = useState('')
  const [newJobDescription, setNewJobDescription] = useState('')
  const [newJobRequirements, setNewJobRequirements] = useState('')
  const [newJobResponsibilities, setNewJobResponsibilities] = useState('')

  const [openJobs, setOpenJobs] = useState([
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      type: "Full-time",
      status: "open",
      location: "San Francisco, CA (Remote)",
      salary: "$120k - $160k/year",
      postedDate: "2 days ago",
      applicantCount: 45,
      applicants: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
      description: "We are looking for a Senior Frontend Developer to join our team...",
      requirements: [
        "5+ years of experience with React",
        "Strong knowledge of TypeScript",
        "Experience with modern CSS frameworks",
      ],
      responsibilities: [
        "Build and maintain frontend applications",
        "Collaborate with design and backend teams",
        "Code reviews and mentoring",
      ],
    },
    {
      id: 2,
      title: "Product Designer",
      department: "Design",
      type: "Full-time",
      status: "open",
      location: "New York, NY (Hybrid)",
      salary: "$100k - $140k/year",
      postedDate: "5 days ago",
      applicantCount: 32,
      applicants: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
      description: "Join our design team to create amazing user experiences...",
      requirements: [
        "3+ years of product design experience",
        "Proficiency in Figma and design systems",
        "Strong portfolio demonstrating UX skills",
      ],
      responsibilities: [
        "Design user interfaces and experiences",
        "Conduct user research and testing",
        "Maintain design system",
      ],
    },
    {
      id: 3,
      title: "Marketing Intern",
      department: "Marketing",
      type: "Internship",
      status: "open",
      location: "Remote",
      salary: "$20/hour",
      postedDate: "1 week ago",
      applicantCount: 78,
      applicants: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
      description: "Great opportunity for students to learn marketing...",
      requirements: [
        "Currently enrolled in Marketing or related field",
        "Strong communication skills",
        "Social media savvy",
      ],
      responsibilities: [
        "Assist with social media campaigns",
        "Content creation and scheduling",
        "Market research",
      ],
    },
  ]
  )

  const [inReviewJobs, setInReviewJobs] = useState([
    {
      id: 4,
      title: "DevOps Engineer",
      department: "Infrastructure",
      type: "Full-time",
      status: "in-review",
      location: "Austin, TX (Remote)",
      salary: "$130k - $170k/year",
      postedDate: "3 weeks ago",
      applicantCount: 28,
      applicants: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
      description: "Looking for an experienced DevOps engineer...",
      requirements: [
        "Experience with AWS/GCP/Azure",
        "Strong knowledge of CI/CD pipelines",
        "Terraform and Kubernetes experience",
      ],
      responsibilities: [
        "Manage cloud infrastructure",
        "Implement CI/CD pipelines",
        "Monitor system performance",
      ],
    },
    {
      id: 5,
      title: "Content Writer",
      department: "Content",
      type: "Part-time",
      status: "in-review",
      location: "Remote",
      salary: "$40k - $60k/year",
      postedDate: "2 weeks ago",
      applicantCount: 15,
      applicants: ["/placeholder.svg?height=24&width=24"],
      description: "Create engaging content for our blog and social media...",
      requirements: [
        "2+ years of content writing experience",
        "Excellent grammar and writing skills",
        "SEO knowledge",
      ],
      responsibilities: [
        "Write blog posts and articles",
        "Create social media content",
        "Collaborate with marketing team",
      ],
    },
  ])

  const [closedJobsState, setClosedJobsState] = useState([
    {
      id: 6,
      title: "Backend Developer",
      department: "Engineering",
      type: "Full-time",
      status: "closed",
      location: "Seattle, WA",
      salary: "$110k - $150k/year",
      postedDate: "2 months ago",
      applicantCount: 120,
      applicants: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
      description: "Position has been filled.",
      requirements: [],
      responsibilities: [],
    },
    {
      id: 7,
      title: "Data Analyst",
      department: "Analytics",
      type: "Contract",
      status: "closed",
      location: "Boston, MA",
      salary: "$80k - $100k/year",
      postedDate: "3 months ago",
      applicantCount: 67,
      applicants: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
      description: "Contract position has been completed.",
      requirements: [],
      responsibilities: [],
    },
  ])

  // Add Job handler
  const handleAddJob = () => {
    const newJob = {
      id: Date.now(),
      title: newJobTitle || 'Untitled Role',
      department: newJobDepartment || 'General',
      type: newJobType,
      status: newJobStatus,
      location: newJobLocation,
      salary: newJobSalary || 'Competitive',
      postedDate: 'Just now',
      applicantCount: 0,
      applicants: [],
      description: newJobDescription,
      requirements: newJobRequirements ? newJobRequirements.split('\n').map(s => s.trim()).filter(Boolean) : [],
      responsibilities: newJobResponsibilities ? newJobResponsibilities.split('\n').map(s => s.trim()).filter(Boolean) : [],
    }

    if (newJob.status === 'open') setOpenJobs((s) => [newJob, ...s])
    else if (newJob.status === 'in-review') setInReviewJobs((s) => [newJob, ...s])
    else setClosedJobsState((s) => [newJob, ...s])

    // reset form
    setNewJobTitle('')
    setNewJobDepartment('')
    setNewJobType('Full-time')
    setNewJobStatus('open')
    setNewJobLocation('Remote')
    setNewJobSalary('')
    setNewJobDescription('')
    setNewJobRequirements('')
    setNewJobResponsibilities('')
    setShowAddModal(false)
  }

  return (
    <div
      className="flex min-h-screen flex-col transparent-scrollbar"
      style={{ backgroundColor: colors.backgroundLight, color: colors.textDark }}
    >
      <div className="flex flex-1">
        <main className="flex flex-1 flex-col overflow-hidden" style={{ backgroundColor: colors.backgroundLight }}>
          <div className="flex flex-col overflow-hidden p-8" style={{ backgroundColor: colors.backgroundLight }}>
            <div className="mb-8 flex items-center justify-between flex-shrink-0">
              <div>
                <h1 className="m-0 text-3xl font-semibold" style={{ color: colors.textDark }}>
                  Job Openings
                </h1>
                <p className="text-sm mt-2" style={{ color: colors.textMedium }}>
                  Explore current job opportunities and join our team
                </p>
              </div>
              <div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
                >
                  <Plus />
                  Post Job
                </button>
              </div>
            </div>
            <div className="grid h-full items-start gap-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
              <JobColumn
                title="Open Positions"
                count={openJobs.length}
                jobs={openJobs}
                type="open"
                isAdminPanelOpen={isAdminPanelOpen}
                isUserPanelOpen={isUserPanelOpen}
                onJobClick={handleJobClick}
              />
              <JobColumn
                title="In Review"
                count={inReviewJobs.length}
                jobs={inReviewJobs}
                type="in-review"
                isAdminPanelOpen={isAdminPanelOpen}
                isUserPanelOpen={isUserPanelOpen}
                onJobClick={handleJobClick}
              />
              <JobColumn
                title="Closed"
                count={closedJobsState.length}
                jobs={closedJobsState}
                type="closed"
                isAdminPanelOpen={isAdminPanelOpen}
                isUserPanelOpen={isUserPanelOpen}
                onJobClick={handleJobClick}
              />
            </div>
            {/* Add Job Modal */}
            {showAddModal && (
              <div className="fixed inset-0 bg-[#0303034f] flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Post a Job</h2>
                    <button onClick={() => setShowAddModal(false)} className="text-gray-500">✕</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input value={newJobTitle} onChange={(e)=>setNewJobTitle(e.target.value)} className="border px-3 py-2 rounded" placeholder="Job Title" />
                    <input value={newJobDepartment} onChange={(e)=>setNewJobDepartment(e.target.value)} className="border px-3 py-2 rounded" placeholder="Department" />
                    <select value={newJobType} onChange={(e)=>setNewJobType(e.target.value)} className="border px-3 py-2 rounded">
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                    <select value={newJobStatus} onChange={(e)=>setNewJobStatus(e.target.value)} className="border px-3 py-2 rounded">
                      <option value="open">Open</option>
                      <option value="in-review">In Review</option>
                      <option value="closed">Closed</option>
                    </select>
                    <input value={newJobLocation} onChange={(e)=>setNewJobLocation(e.target.value)} className="border px-3 py-2 rounded" placeholder="Location" />
                    <input value={newJobSalary} onChange={(e)=>setNewJobSalary(e.target.value)} className="border px-3 py-2 rounded" placeholder="Salary" />
                    <textarea value={newJobDescription} onChange={(e)=>setNewJobDescription(e.target.value)} className="col-span-1 md:col-span-2 border px-3 py-2 rounded" placeholder="Short description"></textarea>
                    <textarea value={newJobRequirements} onChange={(e)=>setNewJobRequirements(e.target.value)} className="col-span-1 md:col-span-2 border px-3 py-2 rounded" placeholder="Requirements (one per line)"></textarea>
                    <textarea value={newJobResponsibilities} onChange={(e)=>setNewJobResponsibilities(e.target.value)} className="col-span-1 md:col-span-2 border px-3 py-2 rounded" placeholder="Responsibilities (one per line)"></textarea>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                    <button onClick={handleAddJob} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Post Job</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <style jsx>{`
        .column-content::-webkit-scrollbar {
          width: 6px;
          background-color: transparent;
        }
        .column-content::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .column-content::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.2);
        }
        .column-content {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
        }
      `}</style>
      <style jsx global>{`
        .transparent-scrollbar::-webkit-scrollbar {
          width: 8px;
          background: transparent;
        }
        .transparent-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
        }
        .transparent-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }
      `}</style>
    </div>
  )
}
