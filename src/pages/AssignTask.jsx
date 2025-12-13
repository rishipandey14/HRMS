// parent/AssignTask.jsx
import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utility/Config";

const AssignTask = ({ projectId: propProjectId, onSuccess, onCancel }) => {
  const { projectId: routeProjectId } = useParams();
  const navigate = useNavigate();
  const projectId = propProjectId || routeProjectId;

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch project participants
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const participants = res.data.participants || [];
        setEmployees(participants);
        if (participants.length > 0) {
          setSelectedEmployee(participants[0]._id);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchEmployees();
    }
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!taskName.trim() || !startDate || !endDate || !selectedEmployee) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      const taskData = {
        title: taskName,
        description: description || taskName,
        startingDate: startDate,
        deadline: endDate,
        assignedTo: [selectedEmployee],
        status: "Not Started",
      };

      await axios.post(`${BASE_URL}/tasks/${projectId}`, taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTaskName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/projects/${projectId}`);
      }
    } catch (err) {
      console.error("Error creating task:", err);
      alert("Failed to create task. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(`/projects/${projectId}`);
    }
  };

  return (
    <div className="h-auto p-4">
      <div className="w-full">
        <h1 className="text-3xl font-normal mb-6">Assign New Task</h1>

        <div className="bg-gray-100 p-4 rounded-3xl mb-6 border border-gray-200 h-auto w-full">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-8 bg-white shadow rounded-xl p-6 w-full border border-gray-200 mt-4"
          >
            {/* LEFT SIDE FORM */}
            <div className="flex-1 min-w-[350px]">
              <label className="block text-gray-700 font-medium mb-2">
                Task Name
              </label>

              <input
                type="text"
                placeholder="Enter Task Name"
                className="w-full h-[56px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />

              <label className="block text-gray-700 font-medium mb-2 mt-6">
                Description
              </label>

              <textarea
                className="w-full h-[204px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label className="block text-gray-700 font-medium mb-2 mt-6">
                Select Duration
              </label>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-700">Start Date</span>
                  <input
                    type="date"
                    className="h-10 w-36 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="dd/mm/yyyy"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-700">Due Date</span>
                  <input
                    type="date"
                    className="h-10 w-36 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="dd/mm/yyyy"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  className="border border-blue-400 text-blue-500 rounded-lg px-8 py-2 hover:bg-blue-50"
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-lg px-8 py-2 hover:bg-blue-600 disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "Assign"}
                </button>
              </div>
            </div>

            {/* RIGHT: Employee Select */}
            <div className="w-[438px]">
              <div
                className={`bg-white border border-blue-500 shadow overflow-hidden ${
                  showEmployeeList ? "rounded-t-xl" : "rounded-xl"
                }`}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-6 py-4 border-b-2 border-blue-600 bg-white"
                  onClick={() => setShowEmployeeList((v) => !v)}
                >
                  <span className="font-medium text-gray-700">
                    {!loading && selectedEmployee
                      ? employees.find(e => e._id === selectedEmployee)?.name || "Select Employee"
                      : "Select Employee"}
                  </span>
                  <FaChevronDown
                    className={`ml-2 text-blue-500 transition-transform duration-200 ${
                      showEmployeeList ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showEmployeeList && (
                  <div className="w-full">
                    {employees.map((emp, idx) => (
                      <div
                        key={emp._id}
                        className={`flex items-center px-6 py-4 cursor-pointer 
                        ${
                          selectedEmployee === emp._id
                            ? "bg-blue-500"
                            : "hover:bg-gray-100"
                        }
                        ${
                          idx !== employees.length - 1
                            ? "border-b border-gray-200"
                            : ""
                        }`}
                        onClick={() => {
                          setSelectedEmployee(emp._id);
                          setShowEmployeeList(false);
                        }}
                      >
                        <img
                          src={`https://i.pravatar.cc/150?img=${(idx % 70) + 1}`}
                          alt={emp.name}
                          className="w-10 h-10 rounded-full mr-4 object-cover border-2 border-white"
                        />

                        <div>
                          <div
                            className={`font-semibold ${
                              selectedEmployee === emp._id
                                ? "text-white"
                                : "text-gray-800"
                            }`}
                          >
                            {emp.name}
                          </div>
                          <div
                            className={`text-xs ${
                              selectedEmployee === emp._id
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {emp.role || "Team Member"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignTask;