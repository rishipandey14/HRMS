import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useRbac } from "../context/RbacContext";

const PermissionRoute = ({ children, requiredPermission, anyOf = [] }) => {
  const location = useLocation();
  const { loading, hasPermission, hasAnyPermission } = useRbac();

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Loading access policy...</div>;
  }

  const isAllowed =
    (requiredPermission ? hasPermission(requiredPermission) : true) &&
    (anyOf?.length ? hasAnyPermission(anyOf) : true);

  if (!isAllowed) {
    return <Navigate to="/dashboard" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default PermissionRoute;
