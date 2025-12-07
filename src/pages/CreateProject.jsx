import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import TableCal from "../components/Basic/tableCal";  // <-- IMPORT POPUP CALENDAR

const CreateProject = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');

  // Calendar states
  const [openCalendar, setOpenCalendar] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('Tanmay Pardhi');
  const [showMoreAvatars, setShowMoreAvatars] = useState(false);

  const employees = [
    { name: 'Tanmay Pardhi', role: 'UI/UX Designer', img: 'https://i.ibb.co/mFr9NX7b/Screenshot-9.png' },
    { name: 'Loki Sharma', role: 'UI/UX Designer', img: 'https://i.ibb.co/FqYn8Zy5/47d1960ad7c2a2cd987d9dd9ba58a1ebf20ddd26.jpg' },
    { name: 'Thor Odinson', role: 'Frontend Expert', img: 'https://i.ibb.co/DPWFyFqF/img1.jpg' },
    { name: 'Tony Stark', role: 'Backend Developer', img: 'https://i.ibb.co/FLnWrQNT/img2.jpg' },
    { name: 'Vijay Shah', role: 'Database Expert', img: 'https://i.ibb.co/NnTjMQqv/img3.jpg' },
    { name: 'Steve Verma', role: 'Designer | Backend Dev', img: 'https://i.ibb.co/mFr9NX7b/Screenshot-9.png' },
    { name: 'Harsh Baghele', role: 'Designer | Spring Dev', img: 'https://i.ibb.co/FLnWrQNT/img2.jpg' },
  ];

  // -------- Calendar Handling --------
  const openCalFor = (field) => {
    setActiveField(field);
    setOpenCalendar(true);
  };

  const handleDateSelect = (date) => {
    const formatted = date.toDateString();

    if (activeField === "start") setStartDate(formatted);
    if (activeField === "due") setDueDate(formatted);
  };

  // -------- Form Submit --------
  const handleSubmit = (e) => {
    e.preventDefault();
    setProjectName("");
    setDescription("");
  };

  return (
    <div className="h-auto p-4">
      <div className="w-full">
        <h1 className="text-3xl font-normal mb-6">Create New Project</h1>

        <div className="bg-gray-100 p-4 rounded-3xl mb-6 border border-gray-200 h-auto w-full">

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8 bg-white shadow rounded-xl p-6 w-full border border-gray-200 mt-4">

            {/* LEFT SIDE FORM */}
            <div className="flex-1 min-w-[350px]">

              {/* Project Name */}
              <label className="block text-gray-700 font-medium mb-2">Project Name</label>
              <input
                type="text"
                placeholder="Enter Project Name"
                className="w-full h-[48px] px-4 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />

              {/* Description */}
              <label className="block text-gray-700 font-medium mb-2 mt-6">Description</label>
              <textarea
                className="w-full h-[120px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Date Selection with Custom Popup Calendar */}
              <label className="block text-gray-700 font-medium mb-2 mt-6">Select Duration</label>
              <div className="flex items-end gap-8">

                {/* Start Date Button */}
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium">Start Date</label>
                  <button
                    type="button"
                    onClick={() => openCalFor("start")}
                    className="w-[180px] h-[48px] border border-gray-300 rounded-lg px-4 bg-white text-left"
                  >
                    {startDate || "Select date"}
                  </button>
                </div>

                {/* Due Date Button */}
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium">Due Date</label>
                  <button
                    type="button"
                    onClick={() => openCalFor("due")}
                    className="w-[180px] h-[48px] border border-gray-300 rounded-lg px-4 bg-white text-left"
                  >
                    {dueDate || "Select date"}
                  </button>
                </div>

              </div>

              {/* Selected Employees - Avatars */}
              <div className="mt-6">
                <label className="block text-gray-700 font-medium mb-2">Selected Employees</label>

                <div className="flex items-center">
                  <img src="https://i.ibb.co/qLxsJ2VG/img1.jpg" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  <img src="https://i.ibb.co/6cqtKwyX/images2.jpg" className="w-8 h-8 rounded-full border-2 border-white -ml-2" />
                  <img src="https://i.ibb.co/mFr9NX7b/Screenshot-9.png" className="w-8 h-8 rounded-full border-2 border-white -ml-2" />
                  <img src="https://i.ibb.co/hFMN1vBH/images4.jpg" className="w-8 h-8 rounded-full border-2 border-white -ml-2" />

                  {!showMoreAvatars ? (
                    <button
                      onClick={() => setShowMoreAvatars(true)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs bg-gray-500 border-2 border-white -ml-2"
                    >
                      +3
                    </button>
                  ) : (
                    <>
                      <img src="https://i.ibb.co/NnTjMQqv/img3.jpg" className="w-8 h-8 rounded-full border-2 border-white -ml-2" />
                      <img src="https://i.ibb.co/FqYn8Zy5/47d1960ad7c2a2cd987d9dd9ba58a1ebf20ddd26.jpg" className="w-8 h-8 rounded-full border-2 border-white -ml-2" />
                      <img src="https://i.ibb.co/S74JR9JF/images3.jpg" className="w-8 h-8 rounded-full border-2 border-white -ml-2" />
                    </>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between gap-12 mt-6">
                <button type="button" className="border border-blue-400 text-blue-500 rounded-xl px-10 py-3">
                  Cancel
                </button>

                <button type="submit" className="bg-blue-500 text-white rounded-xl px-10 py-3 hover:bg-blue-600">
                  Create
                </button>
              </div>
            </div>

            {/* RIGHT SIDE EMPLOYEE DROPDOWN */}
            <div className="w-[438px]">
              <div className={`bg-white border border-blue-500 shadow ${showEmployeeList ? 'rounded-t-xl' : 'rounded-xl'}`}>
                
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-6 py-4 border-b-2 border-blue-600 bg-white"
                  onClick={() => setShowEmployeeList(!showEmployeeList)}
                >
                  <span className="font-medium text-gray-700">Select Employee</span>
                  <FaChevronDown
                    className={`text-blue-500 transition-transform ${showEmployeeList ? 'rotate-180' : ''}`}
                  />
                </button>

                {showEmployeeList && (
                  <div>
                    {employees.map((emp, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedEmployee(emp.name)}
                        className={`flex items-center px-6 py-3 cursor-pointer
                          ${selectedEmployee === emp.name ? 'bg-blue-500' : 'hover:bg-gray-100'}
                          ${idx !== employees.length - 1 ? 'border-b border-gray-200' : ''}
                        `}
                      >
                        <img src={emp.img} className="w-10 h-10 rounded-full mr-4 border-2" />
                        <div>
                          <div className={`${selectedEmployee === emp.name ? 'text-white' : 'text-gray-800'} font-semibold`}>
                            {emp.name}
                          </div>
                          <div className={`${selectedEmployee === emp.name ? 'text-blue-100' : 'text-gray-500'} text-xs`}>
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

      {/* POPUP CALENDAR */}
      <TableCal
        isOpen={openCalendar}
        onClose={() => setOpenCalendar(false)}
        onSelect={handleDateSelect}
      />

    </div>
  );
};

export default CreateProject;
