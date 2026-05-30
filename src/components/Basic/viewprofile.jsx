import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Pagination from "../Basic/pagination";
import { BASE_URL, CHAT_BASE_URL } from "../../utility/Config";


// Find or create a direct chat, but do not send a message
async function findOrCreateDirectChat(loggedInUserId, otherUserId, token) {
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  try {
    // Fetch existing chats
    const res = await axios.get(`${CHAT_BASE_URL}/api/chats`, authHeader);
    const chats = res.data || [];

    // Find a direct chat with exactly these two members
    const found = chats.find(
      (c) =>
        Array.isArray(c.members) &&
        c.members.length === 2 &&
        c.members.includes(loggedInUserId) &&
        c.members.includes(otherUserId)
    );

    if (found && found._id) {
      return found._id; // Return existing chat ID
    }
  } catch (err) {
    console.error("Error fetching chats:", err);
  }

  try {
    // Create a new chat if none exists
    const res = await axios.post(
      `${CHAT_BASE_URL}/api/chats`,
      { members: [loggedInUserId, otherUserId] },
      authHeader
    );
    return res.data?._id || res.data?.chat?._id || res.data?.chat;
  } catch (err) {
    console.error("Error creating chat:", err);
    return null;
  }
}

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
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [user, setUser] = useState(location.state?.user || null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState(null);
  
  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("token") : ""), []);
  
  // Get logged in user id from token
  const loggedInUserId = useMemo(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload._id || payload.userId;
    } catch {
      return null;
    }
  }, [token]);

  // Fetch user data and role info
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && userRole) return; // Already loaded
      if (!userIdParam || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all company users to find the specific user
        const usersRes = await axios.get(`${BASE_URL}/company/users`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 100, page: 1, includeAllRoles: 'true' }
        });

        const usersList = Array.isArray(usersRes.data?.users) ? usersRes.data.users : [];
        const foundUser = usersList.find((u) => String(u.id || u._id) === String(userIdParam));

        if (foundUser) {
          setUser(foundUser);
          // Set role from user data
          setUserRole(foundUser.role || foundUser.primaryRole || foundUser.rbacRoles?.[0]?.name || "Employee");
        } else {
          setError("User not found");
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
        setError(err?.response?.data?.msg || "Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userIdParam, token, user, userRole]);


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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading user profile...</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-red-500">{error}</div>
          </div>
        )}

        {/* Profile Content */}
        {!loading && user && (
          <>
            {/* ----- Profile Header ----- */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 bg-sky-95 p-4 rounded-xl shadow-sm">
              <img
                src={`https://i.pravatar.cc/150?u=${user?.id || user?._id || "avatar"}`}
                className="w-20 h-20 rounded-full"
                alt={user?.name || "User"}
              />

              <div className="flex-grow">
                <h2 className="text-2xl font-semibold">{user?.name || user?.email || "User"}</h2>
                <p className="text-gray-500 font-medium">
                  {userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : "Employee"}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  className="w-full mt-2 text-sm bg-sky-500 text-white border px-3 py-1 rounded-full hover:bg-sky-600 transition"
                  onClick={async () => {
                    if (!loggedInUserId || !userIdParam || !token) return;
                    const chatId = await findOrCreateDirectChat(loggedInUserId, userIdParam, token);
                    if (chatId) {
                      navigate(`/chat`, {
                        state: { chatId, user },
                      });
                    } else {
                      alert("Could not start chat.");
                    }
                  }}
                >
                  Chat
                </button>
                <button className="w-full mt-2 text-sm text-blue-500 border border-blue-500 px-3 py-1 rounded-full hover:bg-blue-50 transition">
                  Email
                </button>
              </div>
            </div>

            {/* Joined Date */}
            <div className="text-right text-gray-500 text-sm mt-2 mb-8">
              Date Joined: <span className="font-semibold">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 bg-sky-99 p-6 rounded-xl shadow-sm">
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
                <p className="font-semibold">{user?.mobile || "Not provided"}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Role</p>
                <p className="font-semibold capitalize">
                  {userRole ? userRole.replace(/_/g, " ") : "Employee"}
                </p>
              </div>

              {user?.managerId && (
                <div>
                  <p className="text-gray-500 text-sm">Manager ID</p>
                  <p className="font-semibold">{user.managerId}</p>
                </div>
              )}

              {user?.companyCode && (
                <div>
                  <p className="text-gray-500 text-sm">Company Code</p>
                  <p className="font-semibold">{user.companyCode}</p>
                </div>
              )}
            </div>

            {/* Projects Header */}
            <div className="mt-10 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Assigned Projects</h3>

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
                  {paginated.length > 0 ? (
                    paginated.map((row) => (
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-3 text-center text-gray-500">
                        No projects found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ----- Pagination Component (Imported) ----- */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
