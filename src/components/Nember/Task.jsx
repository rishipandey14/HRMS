import React, { useState } from "react";
import Pagination from "../Basic/pagination"; 
import Submit from "../Basic/submit"; // Correct import for submit popup

const TaskTable = ({ tasks }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const [popupData, setPopupData] = useState({
    isOpen: false,
    type: "",
    task: null,
  });

  const openPopup = (task, type) => {
    setPopupData({
      isOpen: true,
      type,
      task,
    });
  };

  const closePopup = () => {
    setPopupData({
      isOpen: false,
      type: "",
      task: null,
    });
  };

  // PAGINATION LOGIC
  const indexOfLast = currentPage * tasksPerPage;
  const indexOfFirst = indexOfLast - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-4">

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Task</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Update</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Submit</th>
            </tr>
          </thead>

          <tbody>
            {currentTasks.map((task, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{task.name}</td>

                <td className="px-6 py-4">
                  <span className="text-sm text-green-600">{task.status}</span>
                </td>

                {/* UPDATE BUTTON */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => openPopup(task, "Update")}
                    className="text-sm text-blue-500 border border-blue-500 px-3 py-1 rounded-full hover:bg-blue-50 transition"
                  >
                    Update
                  </button>
                </td>

                {/* SUBMIT BUTTON */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => openPopup(task, "Submit")}
                    className="text-sm text-blue-500 border border-blue-500 px-3 py-1 rounded-full hover:bg-blue-50 transition"
                  >
                    Submit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(tasks.length / tasksPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* POPUP (FOR UPDATE & SUBMIT) */}
      {popupData.isOpen && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-lg">

            <h2 className="text-xl font-semibold mb-4">
              {popupData.type === "Update" ? "Update Task" : "Submit Task"}
            </h2>

            {/* Re-using Submit component for popup content */}
            <Submit task={popupData.task} type={popupData.type} />

            <div className="flex justify-end mt-4">
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;