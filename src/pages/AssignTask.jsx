// parent/AssignTask.jsx
import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import TableCal from "../components/Basic/tableCal";

const employees = [
  { name: 'Tanmay Pardhi', role: 'UI/UX Designer', img: 'https://i.ibb.co/mFr9NX7b/Screenshot-9.png' },
  { name: 'Loki Sharma', role: 'UI/UX Designer', img: 'https://i.ibb.co/FqYn8Zy5/47d1960ad7c2a2cd987d9dd9ba58a1ebf20ddd26.jpg' },
  { name: 'Thor Odinson', role: 'Frontend Expert', img: 'https://i.ibb.co/DPWFyFqF/img1.jpg' },
  { name: 'Tony Stark', role: 'Backend Developer', img: 'https://i.ibb.co/FLnWrQNT/img2.jpg' },
  { name: 'Vijay Shah', role: 'Database Expert', img: 'https://i.ibb.co/NnTjMQqv/img3.jpg' },
  { name: 'Steve Verma', role: 'Designer | Backend Dev', img: 'https://i.ibb.co/mFr9NX7b/Screenshot-9.png' },
  { name: 'Harsh Baghele', role: 'Designer | Spring Dev', img: 'https://i.ibb.co/FLnWrQNT/img2.jpg' },
];

const AssignTask = () => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0].name);
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setTaskName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
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

              {/* Calendar from the other folder */}
              <TableCal
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
              />

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  className="border border-blue-400 text-blue-500 rounded-lg px-8 py-2 hover:bg-blue-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-lg px-8 py-2 hover:bg-blue-600"
                >
                  Assign
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
                    Select Employee
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
                        key={emp.name}
                        className={`flex items-center px-6 py-4 cursor-pointer 
                        ${
                          selectedEmployee === emp.name
                            ? "bg-blue-500"
                            : "hover:bg-gray-100"
                        }
                        ${
                          idx !== employees.length - 1
                            ? "border-b border-gray-200"
                            : ""
                        }`}
                        onClick={() => setSelectedEmployee(emp.name)}
                      >
                        <img
                          src={emp.img}
                          alt={emp.name}
                          className="w-10 h-10 rounded-full mr-4 object-cover border-2 border-white"
                        />

                        <div>
                          <div
                            className={`font-semibold ${
                              selectedEmployee === emp.name
                                ? "text-white"
                                : "text-gray-800"
                            }`}
                          >
                            {emp.name}
                          </div>
                          <div
                            className={`text-xs ${
                              selectedEmployee === emp.name
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {emp.role}
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
