 import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utility/Config";
import Nember from "../Nember/Nember";
import Task from "../Nember/Task";

const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("task");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        if (!projectId) {
          setError("Project ID is missing from URL");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${BASE_URL}/projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data) {
          setProject(response.data);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Project not found");
        } else if (err.response?.status === 401) {
          setError("Unauthorized access");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setError(err.response?.data?.msg || "Failed to fetch project details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, navigate]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/projects")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No project data available</p>
          <button
            onClick={() => navigate("/projects")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gray-100 px-4 sm:px-2   py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-6 md:items-center bg-gray-100 p-6 rounded-xl ">
        {/* Left: Title + Avatars */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {project?.projectName || "Project"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {project?.description || "No description available"}
          </p>
          <div className="flex mt-3 items-center">
            {project?.team && project.team.length > 0 ? (
              <>
                {project.team.slice(0, 3).map((member, index) => (
                  <img
                    key={member._id || index}
                    src={`https://i.pravatar.cc/150?img=${index + 1}`}
                    className={`w-8 h-8 rounded-full border-2 border-white ${
                      index !== 0 ? "-ml-2" : ""
                    }`}
                    alt={`Member ${index}`}
                    title={member.name || `Member ${index + 1}`}
                  />
                ))}
                {project.team.length > 3 && (
                  <span className="ml-3 text-sm text-gray-500">+{project.team.length - 3}</span>
                )}
              </>
            ) : (
              <span className="text-sm text-gray-500">No team members</span>
            )}
          </div>
        </div>

        {/* Right: Project Info */}
        <div className="text-left md:text-right">
          <h3 className="text-black font-semibold">{project?.projectName || "Project"}</h3>
          <p className="text-sm text-gray-400">
            Start Date: {formatDate(project?.startDate)}
          </p>
          <p className="text-sm text-gray-400">
            Due Date: {formatDate(project?.endDate)}
          </p>
          {project?.status && (
            <p className="text-sm font-medium mt-2 capitalize">
              Status: <span className="text-blue-600">{project.status}</span>
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-6 border-b border-gray-200 px-1 md:px-4">
        <button
          onClick={() => setActiveTab("task")}
          className={`py-2 font-medium transition-all duration-200 ${
            activeTab === "task"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          Tasks
        </button>
        <button
          onClick={() => setActiveTab("member")}
          className={`py-2 font-medium transition-all duration-200 ${
            activeTab === "member"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          Members
        </button>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {activeTab === "task" ? (
          <Task projectId={projectId} />
        ) : (
          <Nember projectId={projectId} projectParticipants={project?.participants || []} />
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
