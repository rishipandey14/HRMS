import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationDropdown({ isOpen, onClose }) {
  const dropdownRef = useRef(null);
  const [tab, setTab] = useState("all");

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const notificationsAll = [
    {
      id: 1,
      name: "Thor",
      time: "9 hours ago",
      text: "Thor has asked for approval",
      type: "request",
      avatar: "/avatars/a1.png",
    },
    {
      id: 2,
      name: "Irfan",
      time: "12 hours ago",
      text: "Irfan commented under #LandingPages",
      type: "comment",
      avatar: "/avatars/a2.png",
    },
    {
      id: 3,
      name: "Aashna",
      time: "2 days ago",
      text: "Aashna uploaded a new document",
      type: "file",
      avatar: "/avatars/a3.png",
    },
    {
      id: 3,
      name: "Aashna",
      time: "2 days ago",
      text: "Aashna uploaded a new document",
      type: "file",
      avatar: "/avatars/a3.png",
    },
    {
      id: 3,
      name: "Aashna",
      time: "2 days ago",
      text: "Aashna uploaded a new document",
      type: "file",
      avatar: "/avatars/a3.png",
    },
    {
      id: 3,
      name: "Aashna",
      time: "2 days ago",
      text: "Aashna uploaded a new document",
      type: "file",
      avatar: "/avatars/a3.png",
    },
  ];

  const notificationsRequests = notificationsAll.filter((n) => n.type === "request");
  const listToShow = tab === "all" ? notificationsAll : notificationsRequests;

  return (
    <>
      {/* Inject small CSS for transparent scrollbar + firefox support */}
      <style>{`
        /* WebKit (Chrome, Edge, Safari) */
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.12);
          border-radius: 10px;
          border: 2px solid transparent; /* keep thumb separated */
          background-clip: padding-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.18);
        }
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(0,0,0,0.12) transparent;
        }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-[360px] bg-white shadow-lg rounded-2xl border border-[#DDD9D9] z-50"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b" style={{ borderColor: "#DDD9D9" }}>
              <h3 className="text-lg font-semibold">Notifications</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {/* Tabs */}
            <div className="flex border-b text-sm font-medium" style={{ borderColor: "#DDD9D9" }}>
              <button
                className={`w-1/2 py-3 ${tab === "all" ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-500"}`}
                onClick={() => setTab("all")}
              >
                All
              </button>
              <button
                className={`w-1/2 py-3 ${tab === "requests" ? "text-blue-600 border-b-2 border-blue-500" : "text-gray-500"}`}
                onClick={() => setTab("requests")}
              >
                Requests
              </button>
            </div>

            {/* Notifications List (uses custom scrollbar and divide color #DDD9D9) */}
            <div className="max-h-[360px] overflow-y-auto px-4 py-0 custom-scrollbar">
              <div className="divide-y divide-[#DDD9D9]">
                {listToShow.length > 0 ? (
                  listToShow.map((n) => (
                    <div key={n.id} className="py-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <img src={n.avatar} className="h-10 w-10 rounded-full" alt={n.name} />
                          <div>
                            <p className="text-gray-700 font-medium">{n.name}</p>
                            <p className="text-xs text-gray-400">{n.time}</p>
                          </div>
                        </div>
                        <div className="h-2 w-2 bg-red-500 rounded-full" />
                      </div>

                      <p className="text-sm text-gray-600 mt-2">{n.text}</p>

                      {n.type === "request" && (
                        <div className="flex gap-3 mt-3">
                          <button className="px-3 py-1 rounded-lg border text-gray-600 text-sm" style={{ borderColor: "#DDD9D9" }}>
                            Dismiss
                          </button>
                          <button className="px-3 py-1 rounded-lg bg-blue-500 text-white text-sm">
                            Approve
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400 py-6">No notifications</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-4 py-3 border-t" style={{ borderColor: "#DDD9D9" }}>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                Mark all as read
              </button>
              <button className="text-sm bg-blue-500 px-3 py-1 rounded-lg text-white">
                View all Notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
