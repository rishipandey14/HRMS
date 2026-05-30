import { Navigate } from "react-router-dom";
import { useRbac } from "../context/RbacContext";
import Dashboard from "../pages/Dashboard";
import OW_Dashboard from "../pages/ow_dashboard";

export const OwnerDashboardRoute = () => {
  const { role, loading } = useRbac();
  const isDirector = typeof role === "string" && role.toLowerCase() === "director";

  if (loading) return null;

  return isDirector ? <OW_Dashboard /> : <Navigate to="/dashboard" replace />;
};

const DashboardRoute = () => {
  const { role, loading } = useRbac();
  const isDirector = typeof role === "string" && role.toLowerCase() === "director";

  if (loading) return null;

  return isDirector ? <OW_Dashboard /> : <Dashboard />;
};

export default DashboardRoute;
