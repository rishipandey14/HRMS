import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Pagination from "../Basic/pagination";   // ⭐ Your required import
import { BASE_URL } from "../../utility/Config";

const mockProjects = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  description: "Wireframe Design",
  startDate: "15 Jun 2025",
  dueDate: "15 Aug 2025",
  status: i % 3 === 0 ? "Completed" : i % 3 === 1 ? "In Progress" : "Pending",
}));

const statusColors = {
  Completed: "bg-green-100 text-green-600 border-green-400",
  "In Progress": "bg-yellow-100 text-yellow-700 border-yellow-400",
  Pending: "bg-red-100 text-red-500 border-red-400",
};

export default function ProfilePage() {
  const { id: userIdParam } = useParams();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [user, setUser] = useState(location.state?.user || null);
  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("token") : ""), []);

  useEffect(() => {
    const fetchUser = async () => {
      if (user || !userIdParam || !token) return;
      try {
        // Fetch company users and pick the matching id
        const res = await axios.get(`${BASE_URL}/company/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = Array.isArray(res.data?.users) ? res.data.users : [];
        const found = list.find((u) => (u._id || u.id) === userIdParam);
        if (found) setUser(found);
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };
    fetchUser();
  }, [userIdParam, token]);

  const filteredProjects = mockProjects.filter((p) =>
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const paginated = filteredProjects.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="w-full min-h-screen bg-[#f4f4f4] flex justify-center px-4 py-6">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-sw p-6">

        {/* ----- Profile Header ----- */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 bg-sky-95 p-4 rounded-xl shadow-sm ">
          <img
            src={`https://i.pravatar.cc/150?u=${user?._id || user?.id || "avatar"}`}
            className="w-20 h-20 rounded-full"
            alt="avatar"
          />

          <div className="flex-grow">
            <h2 className="text-2xl font-semibold">{user?.name || user?.email || "User"}</h2>
            <p className="text-gray-500">{"Member"}</p>
          </div>

          <div className="flex gap-3">
            <button className="w-full mt-2 text-sm bg-sky-500 text-white border px-3 py-1 rounded-full">
              Chat
            </button>
            <button className="w-full mt-2 text-sm text-blue-500 border border-blue-500 px-3 py-1 rounded-full hover:bg-blue-50 transition">
              Email
            </button>
          </div>
        </div>

        {/* Joined Date */}
        <div className="text-right text-gray-500 text-sm mt-2 mb-8">
          Date Joined: <span className="font-semibold">{new Date().toLocaleDateString()}</span>
        </div>

        {/* Details */}
        <div className="flex grid md:grid-cols-2 gap-6 bg-sky-99 p-6 rounded-xl shadow-sm">
          <div>
            <p className="text-gray-500 text-sm">Full Name</p>
            <p className="font-semibold">{user?.name || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Email Address</p>
            <p className="font-semibold">{user?.email || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Phone Number</p>
            <p className="font-semibold">+91 62661 65883</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Job Title</p>
            <p className="font-semibold">Product Manager</p>
          </div>
        </div>

        {/* Projects Header */}
        <div className="mt-10 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Projects</h3>

          <input
            type="text"
            placeholder="Search Projects"
            className="border border-blue-500 text-sm text-blue-600 px-3 py-1 rounded-lg"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full border rounded-xl overflow-hidden">
            <thead className="bg-gray-100 text-blue-400">
              <tr>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Start Date</th>
                <th className="p-3 text-left">Due Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((row) => (
                <tr key={row.id} className="border-b border-blue-100">
                  <td className="p-3">{row.description}</td>
                  <td className="p-3">{row.startDate}</td>
                  <td className="p-3">{row.dueDate}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 border rounded-full text-sm ${statusColors[row.status]}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ----- Pagination Component (Imported) ----- */}
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>
    </div>
  );
}
