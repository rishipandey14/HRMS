import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utility/Config";

import Nember from "../Nember/Nember";
import Task from "../Nember/Task";
import Submit from "../Basic/submit";

const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("task");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [openSubmitPopup, setOpenSubmitPopup] = useState(false);

  // CHECK ADMIN ROLE
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(payload.role === "admin");
      } catch (err) {
        console.error("Error parsing token", err);
        setIsAdmin(false);
      }
    }
  }, []);

  // FETCH PROJECT DETAILS
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${BASE_URL}/projects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProject(res.data);
      } catch (err) {
        if (err.response?.status === 404) setError("Project not found");
        else if (err.response?.status === 401) {
          setError("Unauthorized");
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setError("Failed to load project");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, navigate]);

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

  if (loading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate("/projects")}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );

  if (!project) return null;

  return (
    <div className="w-full min-h-screen p-6 bg-gray-100 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between bg-white p-4 rounded-xl shadow-sm">

        {/* LEFT PANEL */}
        <div>
          <h2 className="text-xl font-bold">{project.projectName}</h2>

          <p className="text-sm text-gray-600 mt-1">
            {project.description || "No description available"}
          </p>

          <div className="flex items-center mt-3">
            {project.team?.slice(0, 3).map((member, index) => (
              <img
                key={member._id}
                src={`https://i.pravatar.cc/150?img=${index + 1}`}
                className={`w-8 h-8 rounded-full border-2 border-white ${
                  index !== 0 ? "-ml-2" : ""
                }`}
                alt={member.name}
              />
            ))}

            {project.team?.length > 3 && (
              <span className="ml-2 text-sm text-gray-500">
                +{project.team.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* RIGHT PANEL UPDATED */}
        <div className="mt-4 md:mt-0 bg-gray-50 p-4 rounded-xl w-full md:w-64">

          <h3 className="text-lg font-semibold">{project.projectName}</h3>

          <p className="text-sm text-gray-600 mt-1">
            Start Date: {formatDate(project.startDate)}
          </p>
          <p className="text-sm text-gray-600">
            Due Date: {formatDate(project.endDate)}
          </p>

          {/* CHAT BUTTON */}
          <button
            onClick={() => navigate(`/chat/${projectId}`)}
            className="w-full mt-2 text-sm bg-sky-500 text-white border px-3 py-1 rounded-full"
          >
            Chat
          </button>

          {/* SUBMIT + ADD TASK IN ROW */}
          {isAdmin && (
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => setOpenSubmitPopup(true)}
                className="w-full mt-2 text-sm text-blue-500 border border-blue-500 px-3 py-1 rounded-full hover:bg-blue-50 transition"
              >
                Submit
              </button>

              <button
                onClick={() => navigate(`/assigntask/${projectId}`)}
                className="w-full mt-2 text-sm text-blue-500 border border-blue-500 px-3 py-1 rounded-full hover:bg-blue-50 transition"
              >
                + Add Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b border-gray-300 pb-2">
        <button
          onClick={() => setActiveTab("task")}
          className={`pb-1 text-sm font-medium ${
            activeTab === "task"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Tasks
        </button>

        <button
          onClick={() => setActiveTab("member")}
          className={`pb-1 text-sm font-medium ${
            activeTab === "member"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Members
        </button>
      </div>

      {/* CONTENT */}
      <div>
        {activeTab === "task" ? (
          <Task projectId={projectId} />
        ) : (
          <Nember projectId={projectId} projectParticipants={project.participants} />
        )}
      </div>

      {/* SUBMIT POPUP */}
      {openSubmitPopup && (
        <Submit
          onClose={() => setOpenSubmitPopup(false)}
          projectId={projectId}
        />
      )}
    </div>
  );
};

export default ProjectPage;
