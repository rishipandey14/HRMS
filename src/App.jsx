import { Route, Routes } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Calendar from "./pages/Calendar";
import Chat from "./pages/Chat";
import Team from "./pages/Team";
import Jobs from "./pages/Jobs";
import CreateProject from "./pages/CreateProject";
import ProtectedRoute from "./router/ProtectedRoute";
import PermissionRoute from "./router/PermissionRoute";
import MobileBlockPage from "./utility/MobileBlockPage";
import Login from "./pages/Login";
import OrgSetup from "./components/Company/orgsetup";
import ViewProfile from "./components/Basic/viewprofile";
import OW_Dashboard from "./pages/ow_dashboard";


import ContactPage from "./pages/ContactPage";

import ProjectPage from "./components/Project/ProjectPage";
import JobDetails from "./components/Job/JobDetails";
import Setting from "./pages/Settings";
 
import Plan from "./pages/Plan";
import TaskUpdates from "./pages/TaskUpdates";
import LeaveManagement from "./components/Leave/leave_apply";
import RegularizationWindow from "./components/Requlization/requlization_Apply";

function App() {
  return (
    <Routes>
      {/* login */}
      {/* <Route path="/login" element={<Login />} /> */}
      <Route index element={<Login />} />
      <Route path="/orgsetup" element={<OrgSetup />} />
      <Route
        path="/"
        element={
          <ProtectedRoute fallback={<MobileBlockPage />}>
            <RootLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<PermissionRoute requiredPermission="dashboard.view"><Dashboard /></PermissionRoute>} />
        <Route path="/wdashboard" element={<OW_Dashboard />} />
        <Route path="projects" element={<PermissionRoute requiredPermission="project.view"><Projects /></PermissionRoute>} />
        <Route path="projects/:projectId" element={<PermissionRoute requiredPermission="project.view"><ProjectPage /></PermissionRoute>} />
        <Route path="projects/:projectId/tasks/:taskId/updates" element={<PermissionRoute requiredPermission="update.view"><TaskUpdates /></PermissionRoute>} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="chat" element={<PermissionRoute requiredPermission="chat.view"><Chat /></PermissionRoute>} />
        <Route path="chat/:chatId" element={<PermissionRoute requiredPermission="chat.view"><Chat /></PermissionRoute>} />
        <Route path="team" element={<PermissionRoute requiredPermission="user.view"><Team /></PermissionRoute>} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/view" element={<JobDetails />} />
        <Route path="create-project" element={<PermissionRoute requiredPermission="project.create"><CreateProject /></PermissionRoute>} />
        <Route path="leaveApply" element={<LeaveManagement />} />
        <Route path="RegularizationApply" element={<RegularizationWindow/>} />
        

        {/* profile route */}
        <Route path="viewprofile/:id" element={<ViewProfile />} />

        {/* setting routes */}
        <Route path="settings" element={<PermissionRoute requiredPermission="settings.view"><Setting /></PermissionRoute>} />

       
        <Route path="contact" element={<ContactPage />} />

        <Route path="plan" element={<Plan />} />
        <Route path="Plan" element={<Plan />} />
      </Route>
    </Routes>
  );
}

export default App;