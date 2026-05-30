import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRbac } from "../context/RbacContext";

/**
 * Redirects users with 'director' role to the owner dashboard
 * All other users go to the regular dashboard
 */
const DashboardRedirect = () => {
  const navigate = useNavigate();
  const { role, loading } = useRbac();

  useEffect(() => {
    if (loading) return;

    const isDirector = typeof role === "string" && role.toLowerCase() === "director";
    navigate(isDirector ? "/wdashboard" : "/dashboard", { replace: true });
  }, [loading, role, navigate]);

  return null;
};

export default DashboardRedirect;
