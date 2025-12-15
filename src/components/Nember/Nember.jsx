import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utility/Config";
import { mapUserData } from "../../utility/dataMapper";
import ViewProfile from "../Basic/viewprofile"; // ✅ IMPORT VIEW PROFILE POPUP

export default function Nember({ projectId: propProjectId, projectParticipants = [] }) {
  const navigate = useNavigate();
  const { projectId: paramProjectId } = useParams();
  const projectId = propProjectId || paramProjectId; // Use prop if available, else from URL params
  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [openViewProfile, setOpenViewProfile] = useState(false);

  // Fetch project members or company users based on projectId
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        let usersData = [];
        
        // First, check if participants are passed directly (already populated)
        if (projectParticipants && Array.isArray(projectParticipants) && projectParticipants.length > 0) {
          usersData = projectParticipants;
        } else if (projectId) {
          // Otherwise, fetch from API
          const response = await axios.get(`${BASE_URL}/projects/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // Map API response to get participants (which are user objects)
          usersData = response.data.participants || [];
        } else {
          // Fallback: fetch all company users
          const response = await axios.get(`${BASE_URL}/company/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          usersData = response.data.users || [];
        }
        
        if (!Array.isArray(usersData)) {
          setMembers([]);
          return;
        }
        
        // Map users using dataMapper and add UI-specific properties
        const mappedUsers = usersData.map((user, idx) => {
          const mappedUser = mapUserData(user);
          return {
            ...mappedUser,
            img: (idx % 70) + 1, // Random avatar for UI
            phone: user.mobile || user.phone || 'N/A',
            joined: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : 'N/A',
            displayRole: user.role === 'user' ? 'Employee' : (user.role || 'N/A'),
          };
        });
        
        setMembers(mappedUsers);
      } catch (error) {
        console.error('Error fetching members:', error);
        setMembers(projectParticipants && Array.isArray(projectParticipants) ? projectParticipants : []);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [projectId]); // Removed projectParticipants from dependencies

  // close dropdown when click outside current menu/button
  useEffect(() => {
    const onDocClick = (e) => {
      if (openMenuIndex === null) return;

      const insideDropdown = e.target.closest(`[data-dropdown-index="${openMenuIndex}"]`);
      const insideButton = e.target.closest(`[data-menu-button-index="${openMenuIndex}"]`);

      if (insideDropdown || insideButton) {
        return;
      }
      setOpenMenuIndex(null);
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openMenuIndex]);

  const openEdit = (member) => {
    setSelectedMember(member);
    setOpenEditModal(true);
    setOpenMenuIndex(null);
  };

  const deleteMember = (email) => {
    setMembers((prev) => prev.filter((m) => m.email !== email));
    setOpenMenuIndex(null);
    if (selectedMember?.email === email) {
      setOpenEditModal(false);
      setSelectedMember(null);
    }
  };

  const isAdmin = true; // Set based on user role from token/context

  if (loading) {
    return (
      <div className="bg-gray-100 flex flex-col rounded-2xl p-6">
        <h2 className="text-3xl font-semibold p-4">Team Members</h2>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-100 flex flex-col rounded-2xl p-6">
        <h2 className="text-3xl font-semibold p-4">Team Members</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {members.map((member, index) => (
            <div
              key={member.email}
              className="bg-white rounded-2xl text-center py-11 pb-0 relative flex flex-col items-center justify-between gap-2 h-72"
            >
              <img
                src={`https://i.pravatar.cc/150?img=${member.img}`}
                alt={member.name}
                className="w-20 h-20 rounded-full"
              />

              <h3 className="text-md font-bold text-gray-800">{member.name}</h3>
              <p className="text-xs text-gray-500 pb-12">{member.email}</p>

              {/* ⭐ UPDATED VIEW PROFILE BUTTON ⭐ */}
              <button
                className="bg-blue-500 text-white w-full text-xs py-3 px-3 rounded-b-2xl hover:bg-blue-600"
                onClick={() => {
                  navigate(`/viewprofile/${member._id || member.id || member.email}`);
                }}
              >
                View Profile
              </button>

              {isAdmin && (
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() =>
                      setOpenMenuIndex((cur) => (cur === index ? null : index))
                    }
                    data-menu-button-index={index}
                    className="text-gray-400 hover:text-gray-500"
                    aria-label="open menu"
                  >
                    •••
                  </button>

                  {openMenuIndex === index && (
                    <div
                      data-dropdown-index={index}
                      className="absolute right-0 mt-3 w-28 bg-white border border-[#DDD9D9] shadow-xl rounded-2xl z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => openEdit(member)}
                        className="w-full text-center py-2 text-black hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      <div className="border-t border-[#DDD9D9]" />

                      <button
                        onClick={() => deleteMember(member.email)}
                        className="w-full text-center py-2 text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="bg-[#f7fdff] rounded-xl text-center py-4 px-3 flex flex-col items-center justify-center h-56 cursor-pointer">
            <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center text-blue-500 border-2 border-dashed border-blue-300">
              <Plus className="w-5 h-5" />
            </div>
            <p className="text-sm text-blue-500 font-medium mt-2">Add Member</p>
          </div>
        </div>
      </div>

      {/* Existing EDIT MODAL (UNTOUCHED) */}
      {openEditModal && selectedMember && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-[90%] md:w-[550px] p-6 relative shadow-2xl">
            <button
              onClick={() => setOpenEditModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={22} />
            </button>

            <div className="flex items-center gap-4 pb-5">
              <img
                src={`https://i.pravatar.cc/150?img=${selectedMember.img}`}
                className="w-16 h-16 rounded-full"
                alt="profile"
              />
              <div>
                <h2 className="text-xl font-semibold">{selectedMember.name}</h2>
                <p className="text-sm text-gray-500">Product Manager</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold">Email Address</p>
                <p className="text-gray-500">{selectedMember.email}</p>
              </div>

              <div>
                <p className="font-semibold">Phone Number</p>
                <p className="text-gray-500">{selectedMember.phone}</p>
              </div>

              <div>
                <p className="font-semibold">Roles</p>
                <div className="flex items-center gap-3 mt-1">
                  <label className="flex items-center gap-1">
                    <input type="radio" name={`role-${selectedMember.email}`} defaultChecked={selectedMember.displayRole === "Admin"} />
                    Admin
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name={`role-${selectedMember.email}`} defaultChecked={selectedMember.displayRole === "Employee"} />
                    Employee
                  </label>
                </div>
              </div>

              <div>
                <p className="font-semibold">Date Joined</p>
                <p className="text-gray-500">{selectedMember.joined}</p>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button className="px-6 py-2 rounded-full border border-red-400 text-red-500 hover:bg-red-50">
                Restrict
              </button>
              <button
                onClick={() => setOpenEditModal(false)}
                className="px-6 py-2 bg-red-500 rounded-full text-white hover:bg-red-600"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⭐ NEW VIEW PROFILE POPUP ⭐ */}
      {/* ViewProfile popup removed, now using route navigation */}
    </>
  );
}