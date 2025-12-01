import React from "react";
import { IoClose } from "react-icons/io5";

const PopupCard = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 right-0 mx-auto mt-20 z-50 flex justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6 relative border">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
        >
          <IoClose />
        </button>

        {/* User Info */}
        <div className="flex items-center gap-4">
          <img
            src={data.img}
            alt={data.name}
            className="w-16 h-16 rounded-full object-cover"
          />

          <div>
            <h2 className="text-xl font-semibold">{data.name}</h2>
            <p className="text-gray-500 text-sm">{data.role}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-gray-200 my-4"></div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Email Address</p>
            <p className="text-sm font-medium">{data.email}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Phone Number</p>
            <p className="text-sm font-medium">{data.phone}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button className="w-[45%] py-3 rounded-xl border border-blue-400 text-blue-500 hover:bg-blue-50 transition">
            Email
          </button>
          <button className="w-[45%] py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition">
            Chat
          </button>
        </div>

      </div>
    </div>
  );
};

export default PopupCard;
