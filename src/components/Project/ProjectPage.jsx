 import React, { useState } from "react";
import Nember from "../Nember/Nember";
import Task from "../Nember/Task";

const ProjectPage = () => {
  const [activeTab, setActiveTab] = useState("task");

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-gray-100 px-4 sm:px-2   py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-6 md:items-center bg-gray-100 p-6 rounded-xl ">
        {/* Left: Title + Avatars */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            An AI Based SaaS to Review Resume
          </h2>
          <div className="flex mt-3 items-center">
            {[1, 2, 3].map((id, index) => (
              <img
                key={id}
                src={`https://i.pravatar.cc/150?img=${id}`}
                className={`w-8 h-8 rounded-full border-2 border-white ${
                  index !== 0 ? "-ml-2" : ""
                }`}
                alt={`Avatar ${id}`}
              />
            ))}
            <span className="ml-3 text-sm text-gray-500">+3</span>
          </div>
        </div>

        {/* Right: Project Info */}
        <div className="text-left md:text-right">
          <h3 className="text-black font-semibold">Project XYZ</h3>
          <p className="text-sm text-gray-400">Start Date: 12/07/2025</p>
          <p className="text-sm text-gray-400">Due Date: 31/08/2025</p>
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
        {activeTab === "task" ? <Task /> : <Nember />}
      </div>
    </div>
  );
};

export default ProjectPage;
