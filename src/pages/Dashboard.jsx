"use client"

import { useState, useEffect, useRef } from "react"
import { TrendingUp, Video, Pause, Square, Search, Plus, MonitorX } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const Dashboard = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1280)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(true); // or false, as needed
  const [showAppsPopup, setShowAppsPopup] = useState(false);
  const appsBtnRef = useRef(null);
  const popupRef = useRef(null);


  useEffect(() => {
    if (typeof window === "undefined") return

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        appsBtnRef.current &&
        !appsBtnRef.current.contains(event.target)
      ) {
        setShowAppsPopup(false);
      }
    }
    if (showAppsPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAppsPopup]);

  // Chart data
  const barData = [
    { name: "S", value: 25 },
    { name: "M", value: 65 },
    { name: "T", value: 40 },
    { name: "W", value: 55 },
    { name: "T", value: 30 },
    { name: "F", value: 45 },
    { name: "S", value: 80 },
  ]
  const pieData = [
    { name: "Completed", value: 41 },
    { name: "InProgress", value: 35 },
    { name: "Pending", value: 24 },
  ]

  // Threshold for displaying the desktop-only message
  const DESKTOP_MIN_WIDTH = 768 // Corresponds to 'md' breakpoint in Tailwind CSS

  if (windowWidth < DESKTOP_MIN_WIDTH) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-8 font-sans">
        <MonitorX className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Desktop Only Feature</h2>
        <p className="text-base text-gray-600 max-w-md">
          The dashboard is only available on medium and larger screens.
          <br />
          Please switch to a tablet or desktop device to continue.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans transparent-scrollbar" style={{ fontFamily: 'Roboto, sans-serif' }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-0">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Dashboard</h1>
          <p className="text-sm text-gray-600">Plan, prioritize, and accomplish your tasks with ease</p>
        </div>
        <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4">
          <div className="relative">
            {isAdminPanelOpen && (
              <>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Employee"
                  className="w-48 md:w-72 px-4 py-3 pl-10 border border-gray-200 rounded-full text-sm bg-white text-gray-700 outline-none placeholder-gray-400"
                />
              </>
            )}
          </div>
          {isAdminPanelOpen && (
            <button className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-full text-sm font-medium cursor-pointer flex items-center gap-2 transition-all duration-200 hover:bg-blue-600 hover:text-white">
              <Plus size={16} />
              Add Projects
            </button>
          )}
        </div>

         {/* App Quick Access Row */}
        {isUserPanelOpen && (
  <div className="flex justify-center gap-4 my-6 relative">
    {/* Popup for app buttons */}
    {showAppsPopup && (
      <div ref={popupRef} className="absolute right-16 top-1/2 -translate-y-1/2 flex gap-4 bg-white shadow-lg rounded-full px-4 py-2 z-50">
         <button key="notion" className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-200 hover:scale-110">
           <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" alt="Notion" className="w-8 h-8" />
         </button>
         <button key="figma" className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-200 hover:scale-110">
           <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" alt="Figma" className="w-8 h-8" />
         </button>
         <button key="chrome" className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-200 hover:scale-110">
           <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/Google_Chrome_icon_%282011%29.png" alt="Chrome" className="w-8 h-8" />
         </button>
         <button key="github" className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-200 hover:scale-110">
           <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" className="w-8 h-8" />
         </button>
         <button key="vscode" className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-200 hover:scale-110">
           <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" alt="VSCode" className="w-8 h-8" />
         </button>
        </div>
      )}
    {/* Apps Button */}
    <button
      ref={appsBtnRef}
      className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center cursor-pointer transition-transform duration-150 hover:ring-2 hover:ring-blue-200 hover:scale-110 z-60"
      onClick={() => setShowAppsPopup((prev) => !prev)}
    >
      <img src="https://cdn-icons-png.flaticon.com/512/1828/1828817.png" alt="Plus" className="w-8 h-8" />
    </button>
  </div>
)}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Projects - Blue gradient */}
        <div className="rounded-3xl p-6 relative bg-gradient-to-br from-blue-400 to-blue-700 text-white shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-sm text-white" style={{ fontFamily: 'Inter, sans-serif' }}>Total Projects</h3>
            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/30 bg-white/10">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-5xl font-bold mb-2 leading-none">24</div>
          <p className="text-xs text-white/80">6+ increased from last month</p>
        </div>

        {/* Ended Projects */}
        <div className="rounded-3xl p-6 relative bg-white border border-gray-200 shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-sm text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>Ended Projects</h3>
            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 bg-gray-50">
              <TrendingUp className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          <div className="text-5xl font-bold mb-2 leading-none text-gray-900">8</div>
          <p className="text-xs text-blue-600">4+ increased from last month</p>
        </div>

        {/* Running Projects */}
        <div className="rounded-3xl p-6 relative bg-white border border-gray-200 shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-sm text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>Running Projects</h3>
            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 bg-gray-50">
              <TrendingUp className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          <div className="text-5xl font-bold mb-2 leading-none text-gray-900">5</div>
          <p className="text-xs text-blue-600">4+ increased from last month</p>
        </div>

        {/* Pending Projects */}
        <div className="rounded-3xl p-6 relative bg-white border border-gray-200 shadow-md">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-sm text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>Pending Projects</h3>
            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-200 bg-gray-50">
              <TrendingUp className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          <div className="text-5xl font-bold mb-2 leading-none text-gray-900">4</div>
          <p className="text-xs text-blue-600">On Discuss</p>
        </div>
      </div>

      {/* Main Content Grid - Custom Layout */}
      <div className="flex flex-wrap gap-6 mt-6">
        {/* Project Analytics */}
        <div className="min-w-[580px] max-w-[650px] w-full flex-1 bg-white p-6 border border-gray-200 shadow-md flex flex-col justify-between" style={{ height: '216px', borderRadius: '30px', opacity: 1 }}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Project Analytics</h3>
          <div className="flex-1 flex items-end justify-between w-full h-full">
            {/* Bar Chart */}
            {[25, 65, 40, 55, 30, 45, 80].map((v, i) => (
              <div key={i} className="flex flex-col items-center justify-end h-full">
                <div className="w-8 rounded-t-lg" style={{width: `${50}px` , height: `${v * 1.5}px`, background: 'linear-gradient(180deg, #4FC3F7 0%, #1976D2 100%)' }}></div>
                <span className="text-xs text-gray-500 mt-2">{['S','M','T','W','T','F','S'][i]}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Reminders */}
        <div className="min-w-[250px] max-w-[310px] w-full flex-1 bg-white p-6 border border-gray-200 shadow-md flex flex-col justify-between" style={{ height: '217px', borderRadius: '30px', opacity: 1 }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Reminders</h3>
          <div>
            <div className="text-blue-600 font-semibold cursor-pointer mb-1">Meeting with Abc Company</div>
            <div className="text-gray-500 text-sm mb-4">Time: 02:00 pm - 04:00 pm</div>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-xl flex items-center gap-2 font-medium border-none cursor-pointer text-sm transition-colors duration-200 hover:bg-blue-800 w-full justify-center">
              <Video size={16} /> Start Meeting
            </button>
          </div>
        </div>
        {/* Time Tracker */}
        <div className="min-w-[250px] max-w-[310px] w-full flex-1 p-6 shadow-md flex flex-col items-center justify-center" style={{ height: '217px', borderRadius: '30px', opacity: 1, borderWidth: '1px', borderStyle: 'solid', borderColor: '#e5e7eb', background: 'linear-gradient(135deg, #1976D2 0%, #4FC3F7 100%)' }}>
          <h3 className="text-lg font-semibold text-white mb-4 self-start" style={{ fontFamily: 'Inter, sans-serif' }}>Time Tracker</h3>
          <div className="text-4xl font-bold mb-6 tracking-wider font-mono text-white">01:23:42</div>
          {/* Removed Pause and Stop buttons */}
        </div>
        {/* Projects */}
        <div className="min-w-[250px] max-w-[350px] w-full flex-1 bg-white p-6 border border-gray-200 shadow-md flex flex-col" style={{ height: '355px', borderRadius: '30px', opacity: 1 }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>Projects</h3>
            {isAdminPanelOpen && (
              <button className="border border-blue-500 text-blue-500 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-50">+ New</button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded bg-red-400 inline-block"></span>
                <div>
                  <div className="font-semibold text-sm text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>Develop API Endpoints</div>
                  <div className="text-xs text-gray-500" style={{ fontFamily: 'Roboto, sans-serif' }}>Due date: July 30, 2025</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded bg-purple-400 inline-block"></span>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Onboarding Flow</div>
                  <div className="text-xs text-gray-500">Due date: Sep 30, 2025</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded bg-blue-400 inline-block"></span>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Build Dashboard</div>
                  <div className="text-xs text-gray-500">Due date: Aug 30, 2025</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded bg-red-400 inline-block"></span>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Optimize Page Load</div>
                  <div className="text-xs text-gray-500">Due date: Dec 30, 2025</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded bg-blue-400 inline-block"></span>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Build iOS App</div>
                  <div className="text-xs text-gray-500">Due date: Jan 30, 2025</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded bg-blue-400 inline-block"></span>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Build iOS App</div>
                  <div className="text-xs text-gray-500">Due date: Jan 30, 2025</div>
                </div>
                
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded bg-blue-400 inline-block"></span>
                <div>
                  <div className="font-semibold text-sm text-gray-900">Build iOS App</div>
                  <div className="text-xs text-gray-500">Due date: Jan 30, 2025</div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
        {/* Project Progress */}
        <div className="min-w-[250px] max-w-[310px] w-full flex-1 bg-white p-6 border border-gray-200 shadow-md flex flex-col items-center justify-center" style={{ height: '352px', borderRadius: '30px', opacity: 1 }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-6 self-start" style={{ fontFamily: 'Inter, sans-serif' }}>Project Progress</h3>
          <div className="flex flex-col items-center justify-center flex-1 w-full">
            <div className="relative w-72 h-52 flex items-center justify-center" >
              <ResponsiveContainer width="100%" height={180}>
                <PieChart style={{ marginTop: '-15%' }}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="100%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={70}
                    outerRadius={110}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    <Cell fill="#3182ce" />
                    <Cell fill="#4FC3F7" />
                    <Cell fill="#cbd5e0" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute left-1/2 top-[72%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full">
                <div className="text-4xl font-extrabold text-gray-900 leading-none">41%</div>
                <div className="text-xl text-blue-500 font-semibold mt-1">Project Ended</div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                <span className="text-xs text-gray-600">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                <span className="text-xs text-gray-600">Pending</span>
              </div>
            </div>
          </div>
        </div>
        {/* Team Collaboration */}
        <div className="min-w-[580px] max-w-[650px] w-full flex-1 bg-white p-6 border border-gray-200 shadow-md flex flex-col" style={{ height: '355px', borderRadius: '30px', opacity: 1 }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>Team Collaboration</h3>
            {isAdminPanelOpen && (
              <button className="border border-blue-500 text-blue-500 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-50">+ Add Member</button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-4">
              {/* Member 1 */}
              <div className="flex items-center gap-3">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Thor Odinson" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">Thor Odinson</div>
                  <div className="text-xs text-gray-500">Working on <span className="font-medium text-gray-900">GitHub Repository</span></div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Completed</span>
              </div>
              {/* Member 2 */}
              <div className="flex items-center gap-3">
                <img src="https://randomuser.me/api/portraits/men/33.jpg" alt="Loki Sharma" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">Loki Sharma</div>
                  <div className="text-xs text-gray-500">Working on <span className="font-medium text-gray-900">Time Software</span></div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Completed</span>
              </div>
              {/* Member 3 */}
              <div className="flex items-center gap-3">
                <img src="https://randomuser.me/api/portraits/men/34.jpg" alt="Tony Stark" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">Tony Stark</div>
                  <div className="text-xs text-gray-500">Working on <span className="font-medium text-gray-900">Responsive Layout for Homepage</span></div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Ongoing</span>
              </div>
              {/* Member 4 */}
              <div className="flex items-center gap-3">
                <img src="https://randomuser.me/api/portraits/men/35.jpg" alt="Happy Verma" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">Happy Verma</div>
                  <div className="text-xs text-gray-500">Working on <span className="font-medium text-gray-900">Management Tools</span></div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Ongoing</span>
              </div>
              {/* Member 5 */}
              <div className="flex items-center gap-3">
                <img src="https://randomuser.me/api/portraits/men/36.jpg" alt="Steve Rogers" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">Steve Rogers</div>
                  <div className="text-xs text-gray-500">Working on <span className="font-medium text-gray-900">User Authentication System</span></div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Pending</span>
              </div>
              <div className="flex items-center gap-3">
                <img src="https://randomuser.me/api/portraits/men/34.jpg" alt="Tony Stark" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">Tony Stark</div>
                  <div className="text-xs text-gray-500">Working on <span className="font-medium text-gray-900">Responsive Layout for Homepage</span></div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Ongoing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
