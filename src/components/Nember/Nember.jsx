 import React from "react";
import { Plus } from "lucide-react";

const members = [
  { name: "Dianne Russell", email: "dianne.russel@ddrussell.com", img: 1 },
  { name: "Thor Odinson", email: "dianne.russel@ddrussell.com", img: 2 },
  { name: "Tanmay Pardhi", email: "dianne.russel@ddrussell.com", img: 3 },
  { name: "Dianne Russell", email: "dianne.russel@ddrussell.com", img: 4 },
  { name: "Dianne Russell", email: "dianne.russel@ddrussell.com", img: 5 },
  { name: "Dianne Russell", email: "dianne.russel@ddrussell.com", img: 6 },
  { name: "Dianne Russell", email: "dianne.russel@ddrussell.com", img: 7 },
  { name: "Dianne Russell", email: "dianne.russel@ddrussell.com", img: 8 },
  { name: "Dianne Russell", email: "dianne.russel@ddrussell.com", img: 9 },
];

const Nember = () => {
  return (
    <div className="bg-gray-100  flex flex-col   rounded-2xl p-6">
      <h2 className="text-xl font-semibold p-4">Team Members</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5   gap-4">
        {members.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl text-center py-11 pb-0  relative flex flex-col items-center justify-between gap-2 h-72"
          >
            <img
              src={`https://i.pravatar.cc/150?img=${member.img}`}
              alt={member.name}
              className="w-20 h-20 rounded-full "
            />
            <h3 className="text-md font-bold text-gray-800">
              {member.name}
            </h3>
            <p className="text-xs text-gray-500 pb-12">{member.email}</p>
            <button className="bg-blue-500 text-white w-full text-xs py-3 px-3 rounded-b-2xl  hover:bg-blue-600">
              View Profile
            </button>
            <button className="absolute  top-2 right-2 text-gray-400">•••</button>
          </div>
        ))}

        <div className="bg-[#f7fdff] rounded-xl text-center py-4 px-3 flex flex-col items-center justify-center h-56 cursor-pointer">
          <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center text-blue-500 border-2 border-dashed border-blue-300">
            <Plus className="w-5 h-5" />
          </div>
          <p className="text-sm text-blue-500 font-medium mt-2">Add Member</p>
        </div>
      </div>

      <div className="flex justify-center p-6">
        <div className="flex items-center space-x-1 text-sm">
          <button className="px-2 py-1 border rounded-md text-gray-500">&lt;</button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`px-2 py-1 rounded-md ${page === 1 ? "bg-blue-500 text-white" : "text-gray-700"}`}
            >
              {page}
            </button>
          ))}
          <span className="px-2 py-1 text-gray-500">...</span>
          <button className="px-2 py-1 border rounded-md text-gray-500">10</button>
          <button className="px-2 py-1 border rounded-md text-gray-500">&gt;</button>
        </div>
      </div>
      
    </div>
  );
};

export default Nember;
