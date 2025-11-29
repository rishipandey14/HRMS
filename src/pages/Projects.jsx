"use client"

import { Plus, Eye, MessageCircle } from "lucide-react"
import { useState } from "react"

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

  priorityImportantBg: "#dbeafe",
  priorityImportantText: "#1d4ed8",
  priorityHighBg: "#fee2e2", // Corrected: Light red for High Priority
  priorityHighText: "#dc2626", // Corrected: Dark red for High Priority
  priorityMehBg: "#f3f4f6",
  priorityMehText: "#6b7280",
  priorityOkBg: "#fef3c7",
  priorityOkText: "#d97706",

  progressPending: "#3b82f6",
  progressActive: "#f59e0b",
  progressCompleted: "#10b981",

  avatarCountBg: "#dbeafe",
  avatarCountText: "#1d4ed8",
}

// ProjectCard Component
function ProjectCard({ project }) {
  const getPriorityStyles = (priority) => {
    switch (priority.toLowerCase()) {
      case "important":
        return { backgroundColor: colors.priorityImportantBg, color: colors.priorityImportantText }
      case "high priority":
        return { backgroundColor: colors.priorityHighBg, color: colors.priorityHighText }
      case "meh":
        return { backgroundColor: colors.priorityMehBg, color: colors.priorityMehText }
      case "ok":
        return { backgroundColor: colors.priorityOkBg, color: colors.priorityOkText }
      case "not that important":
        return { backgroundColor: colors.priorityHighBg, color: colors.priorityHighText } // Using high priority red as per image
      default:
        return { backgroundColor: colors.priorityMehBg, color: colors.priorityMehText } // Default to meh
    }
  }

  const getProgressColor = (status) => {
    switch (status) {
      case "pending":
        return colors.progressPending
      case "progress":
        return colors.progressActive
      case "completed":
        return colors.progressCompleted
      default:
        return colors.progressPending
    }
  }

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const priorityStyles = getPriorityStyles(project.priority)
  const progressColor = getProgressColor(project.status)

  return (
    <div
      className="mb-1 rounded-3xl border p-4 transition-all hover:-translate-y-px hover:bg-white cursor-pointer"
      style={{
        borderColor: colors.borderCard,
        backgroundColor: colors.bgCard,
        boxShadow: colors.shadowSm,
        "--tw-border-opacity": "1", // Ensure border opacity is 1 for hover
        "--tw-shadow-color": "rgba(0, 0, 0, 0.1)", // Ensure shadow color is applied
      }}
    >
      {project.priority && (
        <div className="mb-3 inline-block rounded px-2 py-1 text-xs font-medium capitalize" style={priorityStyles}>
          {project.priority}
        </div>
      )}
      <h3 className="m-0 mb-4 text-sm font-medium leading-tight" style={{ color: colors.textDark }}>
        {project.title}
      </h3>
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: colors.textMedium }}>
            Progress
          </span>
          <span className="text-xs font-semibold" style={{ color: colors.textDark }}>
            {project.status === "completed" ? "Done" : `${project.progress}%`}
          </span>
        </div>
        <div className="h-1 overflow-hidden rounded-sm" style={{ backgroundColor: colors.bgHover }}>
          <div
            className="h-full rounded-sm transition-all duration-300 ease-in-out"
            style={{ width: `${project.progress}%`, backgroundColor: progressColor }}
          ></div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {project.team.slice(0, 3).map((avatar, index) => (
            <img
              key={index}
              src={avatar || "/placeholder.svg?height=24&width=24"}
              alt="Team member"
              className="relative -ml-2 h-6 w-6 rounded-full border-2 border-white object-cover first:ml-0"
            />
          ))}
          {project.team.length > 3 && (
            <div
              className="relative -ml-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold"
              style={{ backgroundColor: colors.avatarCountBg, color: colors.avatarCountText }}
            >
              {`+${project.team.length - 3}`}
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: colors.textMedium }}>
            <Eye size={14} />
            <span>{formatNumber(project.stats.views)}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: colors.textMedium }}>
            <MessageCircle size={14} />
            <span>{formatNumber(project.stats.comments)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ProjectColumn Component
function ProjectColumn({ title, count, projects, type, isAdminPanelOpen, isUserPanelOpen }) {
  const statusIndicatorColor =
    type === "pending" ? colors.progressPending : type === "progress" ? colors.progressActive : colors.progressCompleted

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
              "--tw-border-opacity": "1",
              "--tw-shadow-color": "rgba(0, 0, 0, 0.1)",
            }}
          >
            <Plus size={16} />
          </button>
        )}
      </div>
      <div className="column-content flex flex-1 flex-col gap-4 overflow-y-auto pr-1">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

// Main ProjectsView Component
export default function ProjectsView() {
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(true);
  const pendingProjects = [
    {
      id: 1,
      title: "UI/UX Design in the age of AI",
      priority: "Important",
      progress: 0,
      status: "pending",
      team: ["/placeholder.svg?height=24&width=24", "/placeholder.svg?height=24&width=24"],
      stats: { views: 11, comments: 187 },
    },
    {
      id: 2,
      title: "Responsive Website Design for 23 more clients",
      priority: "Meh",
      progress: 0,
      status: "pending",
      team: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
      stats: { views: 32, comments: 115 },
    },
    {
      id: 3,
      title: "Blog Copywriting (Low priority 😴)",
      priority: "OK",
      progress: 0,
      status: "pending",
      team: ["/placeholder.svg?height=24&width=24", "/placeholder.svg?height=24&width=24"],
      stats: { views: 987, comments: 21800 },
    },
    {
      id: 4,
      title: "Landing page for Azunyan senpai",
      priority: "Not that important",
      progress: 0,
      status: "pending",
      team: ["/placeholder.svg?height=24&width=24", "/placeholder.svg?height=24&width=24"],
      stats: { views: 0, comments: 0 },
    },
  ]
  const inProgressProjects = [
    {
      id: 5,
      title: "Machine Learning Progress",
      priority: "Important",
      progress: 52,
      status: "progress",
      team: ["/placeholder.svg?height=24&width=24", "/placeholder.svg?height=24&width=24"],
      stats: { views: 11, comments: 187 },
    },
    {
      id: 6,
      title: "Learn Computer Science",
      priority: "Meh",
      progress: 30,
      status: "progress",
      team: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
      stats: { views: 32, comments: 115 },
    },
  ]
  const completedProjects = [
    {
      id: 7,
      title: "User flow confirmation for fintech App",
      priority: "Important",
      progress: 100,
      status: "completed",
      team: ["/placeholder.svg?height=24&width=24", "/placeholder.svg?height=24&width=24"],
      stats: { views: 11, comments: 2200 },
    },
    {
      id: 8,
      title: "Do some usual chores",
      priority: "High Priority",
      progress: 100,
      status: "completed",
      team: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
      stats: { views: 1, comments: 87 },
    },
    {
      id: 9,
      title: "Write a few articles for slothUI",
      priority: "",
      progress: 100,
      status: "completed",
      team: ["/placeholder.svg?height=24&width=24"],
      stats: { views: 987, comments: 21800 },
    },
    {
      id: 10,
      title: "Transform into a cyborg",
      priority: "OK",
      progress: 100,
      status: "completed",
      team: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
      stats: { views: 987, comments: 21800 },
    },
  ]
  return (
    <div
      className="flex min-h-screen flex-col transparent-scrollbar"
      style={{ backgroundColor: colors.backgroundLight, color: colors.textDark }}
    >
      <div className="flex flex-1">
        <main className="flex flex-1 flex-col overflow-hidden" style={{ backgroundColor: colors.backgroundLight }}>
          <div className="flex flex-col overflow-hidden p-8" style={{ backgroundColor: colors.backgroundLight }}>
            <div className="mb-8 flex-shrink-0">
              <h1 className="m-0 text-3xl font-semibold" style={{ color: colors.textDark }}>
                Projects
              </h1>
            </div>
            <div className="grid h-full items-start gap-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
              <ProjectColumn title="Upcoming" count={8} projects={pendingProjects} type="Upcoming" isAdminPanelOpen={isAdminPanelOpen} isUserPanelOpen={isUserPanelOpen} />
              <ProjectColumn title="In Progress" count={2} projects={inProgressProjects} type="progress" isAdminPanelOpen={isAdminPanelOpen} isUserPanelOpen={isUserPanelOpen} />
              <ProjectColumn title="Completed" count={7} projects={completedProjects} type="completed" isAdminPanelOpen={isAdminPanelOpen} isUserPanelOpen={isUserPanelOpen} />
            </div>
          </div>
        </main>
      </div>
      <style jsx>{`
        .column-content::-webkit-scrollbar {
          width: 6px;
          background-color: transparent; /* Make the track transparent */
        }
        .column-content::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1); /* Subtle grey thumb */
          border-radius: 3px;
        }
        .column-content::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.2); /* Slightly darker on hover */
        }
        .column-content {
          scrollbar-width: thin; /* Firefox */
          scrollbar-color: rgba(0, 0, 0, 0.1) transparent; /* Firefox: thumb color track color */
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
