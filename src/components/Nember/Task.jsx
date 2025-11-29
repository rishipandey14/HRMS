 import React from "react";

const tasks = [
  {
    description: "User Research Research the...",
    assignedTo: "Thor Odinson",
    avatar: 1,
    startDate: "15 Jun 2025",
    dueDate: "15 Aug 2025",
    status: "Completed",
  },
  {
    description: "Wireframe Design",
    assignedTo: "Loki Sharma",
    avatar: 2,
    startDate: "15 Jun 2025",
    dueDate: "15 Aug 2025",
    status: "In Progress",
  },
  {
    description: "Visual Design",
    assignedTo: "Tony Starlink",
    avatar: 3,
    startDate: "15 Jun 2025",
    dueDate: "15 Aug 2025",
    status: "In Progress",
  },
  {
    description: "Usability Testing",
    assignedTo: "Vijay Malyaaa",
    avatar: 4,
    startDate: "15 Jun 2025",
    dueDate: "15 Aug 2025",
    status: "Pending",
  },
  {
    description: "Responsive Layout",
    assignedTo: "Steve Vermaa",
    avatar: 5,
    startDate: "15 Jun 2025",
    dueDate: "15 Aug 2025",
    status: "Pending",
  },
  {
    description: "Figma Design",
    assignedTo: "Alexander Sir",
    avatar: 6,
    startDate: "15 Jun 2025",
    dueDate: "15 Aug 2025",
    status: "Completed",
  },
  {
    description: "Authentication",
    assignedTo: "Tanmay Pardhi",
    avatar: 7,
    startDate: "15 Jun 2025",
    dueDate: "15 Aug 2025",
    status: "Completed",
  },
];

const statusColor = {
  Completed: "text-green-600 bg-green-100",
  "In Progress": "text-yellow-600 bg-yellow-100",
  Pending: "text-red-600 bg-red-100",
};

const Task = () => {
  return (
    <div className="w-full p-3 sm:p-4 lg:py-6">
      {/* Horizontal scroll container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full table-auto border-separate border-spacing-y-3 min-w-[900px]">
          <thead>
            <tr className="text-left text-sm font-semibold text-gray-600 bg-white">
              <th className="px-4 lg:px-6 py-4 rounded-l-lg">Description</th>
              <th className="px-4 lg:px-6 py-4">Assigned to</th>
              <th className="px-4 lg:px-6 py-4">Start Date</th>
              <th className="px-4 lg:px-6 py-4">Due Date</th>
              <th className="px-4 lg:px-6 py-4">Status</th>
              <th className="px-4 lg:px-6 py-4">Updates</th>
              <th className="px-4 lg:px-6 py-4 rounded-r-lg">Submit</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr
                key={index}
                className="bg-white text-sm text-gray-800 rounded-lg shadow-sm"
              >
                <td className="px-4 lg:px-6 py-5 rounded-l-lg whitespace-nowrap">
                  {task.description}
                </td>
                <td className="px-4 lg:px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://i.pravatar.cc/150?img=${task.avatar}`}
                      alt={task.assignedTo}
                      className="w-8 h-8 lg:w-9 lg:h-9 rounded-full flex-shrink-0"
                    />
                    <span>{task.assignedTo}</span>
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-5 text-gray-600 whitespace-nowrap">
                  {task.startDate}
                </td>
                <td className="px-4 lg:px-6 py-5 text-gray-600 whitespace-nowrap">
                  {task.dueDate}
                </td>
                <td className="px-4 lg:px-6 py-5 whitespace-nowrap">
                  <span
                    className={`text-xs font-medium px-2 py-1 border rounded-full ${statusColor[task.status]}`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-5 whitespace-nowrap">
                  <button className="text-sm text-blue-500 border border-blue-500 px-3 py-1 rounded-full hover:bg-blue-50 transition-all">
                    Updates
                  </button>
                </td>
                <td className="px-4 lg:px-6 py-5 rounded-r-lg whitespace-nowrap">
                  <button className="text-sm text-blue-500 border border-blue-500 px-3 py-1 rounded-full hover:bg-blue-50 transition-all">
                    Submit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Task;