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
import MobileBlockPage from "./utility/MobileBlockPage";
import Login from "./pages/Login";
import OrgSetup from "./components/Company/orgsetup";
import ViewProfile from "./components/Basic/viewprofile";


import ContactPage from "./pages/ContactPage";

import ProjectPage from "./components/Project/ProjectPage";
import JobDetails from "./components/Job/JobDetails";
import Setting from "./pages/Settings";
 
import Plan from "./pages/Plan";
import TaskUpdates from "./pages/TaskUpdates";

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
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:projectId" element={<ProjectPage />} />
        <Route path="projects/:projectId/tasks/:taskId/updates" element={<TaskUpdates />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="chat" element={<Chat />} />
        <Route path="chat/:chatId" element={<Chat />} />
        <Route path="team" element={<Team />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/view" element={<JobDetails />} />
        <Route path="create-project" element={<CreateProject />} />

        {/* profile route */}
        <Route path="viewprofile/:id" element={<ViewProfile />} />

        {/* setting routes */}
        <Route path="settings" element={<Setting />} />

       
        <Route path="contact" element={<ContactPage />} />

        <Route path="plan" element={<Plan />} />
      </Route>
    </Routes>
  );
}

export default App;