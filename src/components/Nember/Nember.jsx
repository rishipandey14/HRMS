import React, { useState, useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";

const initialMembers = [
  { name: "Mohan Kumar", email: "mohan@taskfleet.com", img: 1, role: "Admin", phone: "+91 62681 85883", joined: "12-02-2025" },
  { name: "Thor Odinson", email: "thor@ddrussell.com", img: 2, role: "Employee", phone: "+91 98765 43210", joined: "21-01-2025" },
  { name: "Tanmay Pardhi", email: "tanmay@company.com", img: 3, role: "Employee", phone: "+91 99881 22882", joined: "05-02-2025" },
];

const isAdmin = true;

const Nember = () => {
  const [members, setMembers] = useState(initialMembers);
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuIndex(null);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  const openEdit = (member) => {
    setSelectedMember(member);
    setOpenEditModal(true);
    setOpenMenuIndex(null);
  };

  // ✅ DELETE MEMBER
  const deleteMember = (email) => {
    setMembers((prev) => prev.filter((m) => m.email !== email));
    setOpenMenuIndex(null);
  };

  return (
    <>
      {/* ---------- MAIN MEMBER GRID ---------- */}
      <div className="bg-gray-100 flex flex-col rounded-2xl p-6">
        <h2 className="text-xl font-semibold p-4">Team Members</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {members.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl text-center py-11 pb-0 relative flex flex-col items-center justify-between gap-2 h-72"
            >
              <img
                src={`https://i.pravatar.cc/150?img=${member.img}`}
                alt={member.name}
                className="w-20 h-20 rounded-full"
              />

              <h3 className="text-md font-bold text-gray-800">{member.name}</h3>
              <p className="text-xs text-gray-500 pb-12">{member.email}</p>

              <button className="bg-blue-500 text-white w-full text-xs py-3 px-3 rounded-b-2xl hover:bg-blue-600">
                View Profile
              </button>

              {/* ADMIN MENU BUTTON */}
              {isAdmin && (
                <div ref={menuRef} className="absolute top-2 right-2">
                  <button
                    onClick={() =>
                      setOpenMenuIndex(openMenuIndex === index ? null : index)
                    }
                    className="text-gray-400 hover:text-gray-500"
                  >
                    •••
                  </button>

                  {/* DROPDOWN MENU */}
                  {openMenuIndex === index && (
                    <div className="absolute right-0 mt-3 w-28 bg-white border border-[#DDD9D9] shadow-xl rounded-2xl z-50 overflow-hidden">
                      <button
                        onClick={() => openEdit(member)}
                        className="w-full text-center py-2 text-black hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      <div className="border-t border-[#DDD9D9]"></div>

                      {/* DELETE MEMBER */}
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

          {/* ADD MEMBER CARD */}
          <div className="bg-[#f7fdff] rounded-xl text-center py-4 px-3 flex flex-col items-center justify-center h-56 cursor-pointer">
            <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center text-blue-500 border-2 border-dashed border-blue-300">
              <Plus className="w-5 h-5" />
            </div>
            <p className="text-sm text-blue-500 font-medium mt-2">Add Member</p>
          </div>
        </div>
      </div>

      {/* ---------- POPUP EDIT MODAL (3×4 LAYOUT) ---------- */}
      {openEditModal && selectedMember && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-[90%] md:w-[650px] p-8 relative shadow-2xl">

            {/* X BUTTON */}
            <button
              onClick={() => setOpenEditModal(false)}
              className="absolute top-5 right-5 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>

            {/* HEADER */}
            <div className="flex items-center gap-4 border-b border-[#DDD9D9] pb-4 mb-6">
              <img
                src={`https://i.pravatar.cc/150?img=${selectedMember.img}`}
                className="w-20 h-20 rounded-full"
                alt="profile"
              />
              <div>
                <h2 className="text-xl font-semibold">{selectedMember.name}</h2>
                <p className="text-sm text-gray-500">Product Manager</p>
              </div>
            </div>

            {/* 3×4 GRID */}
            <div className="grid grid-cols-3 gap-6 text-sm text-gray-700">

              <div className="col-span-1">
                <p className="font-semibold">Email Address</p>
                <p className="text-gray-500">{selectedMember.email}</p>
              </div>

              <div className="col-span-1">
                <p className="font-semibold">Phone Number</p>
                <p className="text-gray-500">{selectedMember.phone}</p>
              </div>

              <div className="col-span-1">
                <p className="font-semibold">Date Joined</p>
                <p className="text-gray-500">{selectedMember.joined}</p>
              </div>

              <div className="col-span-3">
                <p className="font-semibold">Roles</p>
                <div className="flex items-center gap-6 mt-1">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="role" defaultChecked={selectedMember.role === "Admin"} />
                    Admin
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="role" defaultChecked={selectedMember.role === "Employee"} />
                    Employee
                  </label>
                </div>
              </div>

            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex justify-between mt-10">
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
    </>
  );
};

export default Nember;
