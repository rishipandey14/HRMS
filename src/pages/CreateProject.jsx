import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const CreateProject = () => {
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [showEmployeeList, setShowEmployeeList] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState('Tanmay Pardhi');
    const [showMoreAvatars, setShowMoreAvatars] = useState(false);

    const employees = [
    { name: 'Tanmay Pardhi', role: 'UI/UX Designer', img: 'https://i.ibb.co/mFr9NX7b/Screenshot-9.png' },
  {name: 'Loki Sharma', role: 'UI/UX Designer', img: 'https://i.ibb.co/FqYn8Zy5/47d1960ad7c2a2cd987d9dd9ba58a1ebf20ddd26.jpg' },
  { name: 'Thor Odinson', role: 'Frontend Expert', img: 'https://i.ibb.co/DPWFyFqF/img1.jpg' },
  { name: 'Tony Stark', role: 'Backend Developer', img: 'https://i.ibb.co/FLnWrQNT/img2.jpg' },
  { name: 'Vijay Shah', role: 'Database Expert', img: 'https://i.ibb.co/NnTjMQqv/img3.jpg' },
  { name: 'Steve Verma', role: 'Designer | Backend Dev', img: 'https://i.ibb.co/mFr9NX7b/Screenshot-9.png' },
  { name: 'Harsh Baghele', role: 'Designer | Spring Dev', img: 'https://i.ibb.co/FLnWrQNT/img2.jpg' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Project Created: ${projectName}\nDescription: ${description}`);
        setProjectName("");
        setDescription("");
    };

    return (
        <div className="h-auto p-4">
            <div className="w-full">
                <h1 className="text-3xl font-normal mb-6">Create New Project</h1>
                
                {/* New div outside form container */}
                <div className="bg-gray-100 p-4 rounded-3xl mb-6 border border-gray-200 h-auto w-full">
                    
                    {/* Form container with both form fields and employee selection */}
                    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8 bg-white shadow rounded-xl p-6 w-full border border-gray-200 mt-4">
                    {/* Left Side - Form Fields */}
                    <div className="flex-1 min-w-[350px]">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="projectName">
                            Project Name
                        </label>
                        <input
                            id="projectName"
                            type="text"
                            placeholder="Enter Project Name"
                            className="w-full h-[48px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                        />
                        
                        <label className="block text-gray-700 font-medium mb-2 mt-6" htmlFor="description">
                            Description
                        </label>
                        <div className="relative w-full">
                            <textarea
                                id="description"
                                className="w-full h-[120px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none pr-10"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        
                        <label className="block text-gray-700 font-medium mb-2 mt-6">Select Duration</label>
                        <div className="flex items-end gap-8">
                            <div className="flex items-center gap-2">
                                <label className="block text-gray-700 font-medium" htmlFor="startDate">
                                    Start Date
                                </label>
                                <input
                                    id="startDate"
                                    type="date"
                                    className="w-[180px] h-[48px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="block text-gray-700 font-medium" htmlFor="dueDate">
                                    Due Date
                                </label>
                                <input
                                    id="dueDate"
                                    type="date"
                                    className="w-[180px] h-[48px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        </div>

                        {/* Selected Employees */}
                        <div className="mt-6">
                            <label className="block text-gray-700 font-medium mb-2">Selected Employees</label>
                            <div className="flex items-center">
                                <img src="https://i.ibb.co/qLxsJ2VG/img1.jpg" alt="TP" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" />
                                <img src="https://i.ibb.co/6cqtKwyX/images2.jpg" alt="LS" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm -ml-2" />
                                <img src="https://i.ibb.co/mFr9NX7b/Screenshot-9.png" alt="TO" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm -ml-2" />
                                <img src="https://i.ibb.co/hFMN1vBH/images4.jpg" alt="TS" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm -ml-2" />
                                
                                {showMoreAvatars ? (
                                    <>
                                        <img src="https://i.ibb.co/NnTjMQqv/img3.jpg" alt="VS" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm -ml-2" />
                                        <img src="https://i.ibb.co/FqYn8Zy5/47d1960ad7c2a2cd987d9dd9ba58a1ebf20ddd26.jpg" alt="SV" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm -ml-2" />
                                        <img src="https://i.ibb.co/S74JR9JF/images3.jpg" alt="HB" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm -ml-2" />
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => setShowMoreAvatars(true)}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs border-2 border-white shadow-sm -ml-2 hover:bg-indigo-700 transition-colors cursor-pointer"
                                        style={{ backgroundColor: 'grey' }}>
                                        +3
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex justify-between gap-12 mt-6">
                            <button
                                className="border border-blue-400 text-blue-500 rounded-xl px-15 py-4 hover:bg-blue-50 transition-colors"
                                type="button">
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white rounded-xl px-15 py-4 hover:bg-blue-600 transition-colors"
                                type="submit">
                                Create
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Select Employee (inside form container) */}
                    <div className="w-[438px]">
                        <div className={`bg-white border border-blue-500 shadow overflow-hidden ${showEmployeeList ? 'rounded-t-xl' : 'rounded-xl'}`}>
                            {/* Select Employee Field */}
                            <button
                                type="button"
                                className="w-full flex items-center justify-between px-6 py-4 border-b-2 border-blue-600 bg-white cursor-pointer"
                                onClick={() => setShowEmployeeList((v) => !v)}
                            >
                                <span className="font-medium text-gray-700">Select Employee</span>
                                <FaChevronDown
                                    className={`ml-2 text-blue-500 transition-transform duration-200 ${showEmployeeList ? "rotate-180" : "rotate-0"}`}
                                />
                            </button>
                            
                            {/* Employee List */}
                            {showEmployeeList && (
                                <div className="w-full">
                                    {employees.map((emp, idx) => (
                                        <div
                                            key={emp.name}
                                            className={`flex items-center px-6 py-4 cursor-pointer transition-colors
                                            ${selectedEmployee === emp.name ? 'bg-blue-500' : 'hover:bg-gray-100'}
                                            ${idx !== employees.length - 1 ? 'border-b border-gray-200' : ''}
                                          `}
                                            onClick={() => setSelectedEmployee(emp.name)}
                                        >
                                            <img src={emp.img} alt={emp.name} className="w-10 h-10 rounded-full mr-4 object-cover border-2 border-white" />
                                            <div>
                                                <div className={`font-semibold ${selectedEmployee === emp.name ? 'text-white' : 'text-gray-800'}`}>{emp.name}</div>
                                                <div className={`text-xs ${selectedEmployee === emp.name ? 'text-blue-100' : 'text-gray-500'}`}>{emp.role}</div>
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

export default CreateProject;