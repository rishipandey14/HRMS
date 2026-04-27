import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utility/Config";
import { useRbac } from "../../context/RbacContext";

const ACTIONS = ["view", "create", "update", "delete"];

const groupPermissionsByModule = (permissions = []) => {
  const map = new Map();

  permissions.forEach((permission) => {
    const key = permission?.key || "";
    const [moduleName, action] = key.split(".");
    if (!moduleName || !action) return;

    if (!map.has(moduleName)) {
      map.set(moduleName, {
        moduleName,
        actions: {},
      });
    }

    map.get(moduleName).actions[action] = permission;
  });

  return Array.from(map.values()).sort((a, b) => a.moduleName.localeCompare(b.moduleName));
};

const buildAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const AccessControl = () => {
  const { hasPermission, refreshRbac } = useRbac();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tree, setTree] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [editableKeys, setEditableKeys] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [roleParentId, setRoleParentId] = useState("");
  const [newParentRoleId, setNewParentRoleId] = useState("");
  const [assignUserId, setAssignUserId] = useState("");
  const [assignRoleId, setAssignRoleId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const permissionMatrix = useMemo(() => groupPermissionsByModule(permissions), [permissions]);

  const selectedRole = useMemo(
    () => roles.find((role) => String(role.id) === String(selectedRoleId)) || null,
    [roles, selectedRoleId]
  );

  useEffect(() => {
    if (!selectedRole) {
      setEditableKeys([]);
      setNewParentRoleId("");
      return;
    }

    const selectedKeys = (selectedRole.permissions || []).map((item) => item.key);
    setEditableKeys(selectedKeys);
    setNewParentRoleId(selectedRole.parentRoleId ? String(selectedRole.parentRoleId) : "");
  }, [selectedRole]);

  const fetchAll = async () => {
    setLoading(true);
    setError("");

    try {
      const [permissionsRes, rolesRes, treeRes, usersRes] = await Promise.all([
        axios.get(`${BASE_URL}/rbac/permissions`, buildAuthHeader()),
        axios.get(`${BASE_URL}/rbac/roles`, buildAuthHeader()),
        axios.get(`${BASE_URL}/rbac/roles/tree`, buildAuthHeader()),
        axios.get(`${BASE_URL}/company/users?includeAllRoles=true`, buildAuthHeader()),
      ]);

      const nextPermissions = permissionsRes.data?.permissions || [];
      const nextRoles = rolesRes.data?.roles || [];

      setPermissions(nextPermissions);
      setRoles(nextRoles);
      setTree(treeRes.data?.tree || []);
      setUsers(usersRes.data?.users || []);

      if (nextRoles.length && !selectedRoleId) {
        setSelectedRoleId(String(nextRoles[0].id));
      }
    } catch (fetchError) {
      setError(fetchError.response?.data?.msg || "Failed to load access control data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasPermission("role.update")) {
      setLoading(false);
      return;
    }
    fetchAll();
  }, []);

  const togglePermission = (permissionKey) => {
    setEditableKeys((prev) => {
      if (prev.includes(permissionKey)) {
        return prev.filter((item) => item !== permissionKey);
      }
      return [...prev, permissionKey];
    });
  };

  const handleUpdateRolePermissions = async () => {
    if (!selectedRoleId) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await axios.patch(
        `${BASE_URL}/rbac/roles/${selectedRoleId}/permissions`,
        { permissionKeys: editableKeys },
        buildAuthHeader()
      );

      setMessage("Role permissions updated successfully");
      await fetchAll();
      await refreshRbac();
    } catch (updateError) {
      setError(updateError.response?.data?.msg || "Failed to update permissions");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRole = async () => {
    if (!roleName.trim()) {
      setError("Role name is required");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await axios.post(
        `${BASE_URL}/rbac/roles`,
        {
          name: roleName.trim().toLowerCase().replace(/\s+/g, "_"),
          parentRoleId: roleParentId ? Number(roleParentId) : null,
          permissionKeys: editableKeys,
        },
        buildAuthHeader()
      );

      setRoleName("");
      setRoleParentId("");
      setMessage("Role created successfully");
      await fetchAll();
    } catch (createError) {
      setError(createError.response?.data?.msg || "Failed to create role");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRoleParent = async () => {
    if (!selectedRoleId) {
      setError("Select a role to update hierarchy");
      return;
    }

    if (newParentRoleId && String(newParentRoleId) === String(selectedRoleId)) {
      setError("Role cannot be parent of itself");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await axios.patch(
        `${BASE_URL}/rbac/roles/${selectedRoleId}/parent`,
        { parentRoleId: newParentRoleId ? Number(newParentRoleId) : null },
        buildAuthHeader()
      );

      setMessage("Role parent updated successfully");
      await fetchAll();
    } catch (updateError) {
      setError(updateError.response?.data?.msg || "Failed to update role parent");
    } finally {
      setSaving(false);
    }
  };

  const handleAssignRole = async () => {
    if (!assignUserId || !assignRoleId) {
      setError("Select both user and role");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      await axios.patch(
        `${BASE_URL}/rbac/users/${assignUserId}/role`,
        { roleId: Number(assignRoleId) },
        buildAuthHeader()
      );

      setMessage("Role assigned to user successfully");
      await fetchAll();
    } catch (assignError) {
      setError(assignError.response?.data?.msg || "Failed to assign role");
    } finally {
      setSaving(false);
    }
  };

  const renderTree = (nodes = [], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.id} style={{ marginLeft: `${depth * 14}px` }} className="py-1">
        <div className="text-sm text-gray-700">
          {node.name} <span className="text-xs text-gray-400">({node.membersCount || 0} members)</span>
        </div>
        {node.children?.length > 0 && renderTree(node.children, depth + 1)}
      </div>
    ));
  };

  if (!hasPermission("role.update")) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
        You do not have permission to manage roles and permissions.
      </div>
    );
  }

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Loading role permissions...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Access Control</h3>
        <p className="text-sm text-gray-500">Manage company roles, permissions, and assignments.</p>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      {message && <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{message}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-2">Role</p>
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>

          <p className="text-xs font-medium text-gray-500 mt-3 mb-1">Parent Role</p>
          <select
            value={newParentRoleId}
            onChange={(e) => setNewParentRoleId(e.target.value)}
            disabled={!selectedRoleId || saving}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value="">No Parent Role</option>
            {roles
              .filter((role) => String(role.id) !== String(selectedRoleId))
              .map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
          </select>

          <button
            onClick={handleUpdateRoleParent}
            disabled={!selectedRoleId || saving}
            className="mt-3 w-full rounded-md bg-slate-700 text-white px-3 py-2 text-sm disabled:opacity-50"
          >
            Update Parent Role
          </button>

          <button
            onClick={handleUpdateRolePermissions}
            disabled={!selectedRoleId || saving}
            className="mt-3 w-full rounded-md bg-blue-600 text-white px-3 py-2 text-sm disabled:opacity-50"
          >
            Update Role Permissions
          </button>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-2">Create Role</p>
          <input
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="e.g. Senior Manager"
            className="w-full border rounded-md px-3 py-2 text-sm mb-2"
          />
          <select
            value={roleParentId}
            onChange={(e) => setRoleParentId(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value="">No Parent Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleCreateRole}
            disabled={saving}
            className="mt-3 w-full rounded-md bg-emerald-600 text-white px-3 py-2 text-sm disabled:opacity-50"
          >
            Create Role
          </button>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-2">Assign Role</p>
          <select
            value={assignUserId}
            onChange={(e) => setAssignUserId(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm mb-2"
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          <select
            value={assignRoleId}
            onChange={(e) => setAssignRoleId(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssignRole}
            disabled={saving}
            className="mt-3 w-full rounded-md bg-indigo-600 text-white px-3 py-2 text-sm disabled:opacity-50"
          >
            Assign User Role
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100 overflow-x-auto">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Permission Matrix</h4>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Module</th>
              {ACTIONS.map((action) => (
                <th key={action} className="py-2 px-3 capitalize">{action}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionMatrix.map((row) => (
              <tr key={row.moduleName} className="border-b">
                <td className="py-2 pr-4 capitalize">{row.moduleName.replace(/_/g, " ")}</td>
                {ACTIONS.map((action) => {
                  const permission = row.actions[action];
                  const permissionKey = permission?.key;
                  return (
                    <td key={`${row.moduleName}-${action}`} className="py-2 px-3">
                      <input
                        type="checkbox"
                        checked={Boolean(permissionKey && editableKeys.includes(permissionKey))}
                        disabled={!permissionKey}
                        onChange={() => permissionKey && togglePermission(permissionKey)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Role Hierarchy</h4>
        <div className="text-sm text-gray-700">{tree.length ? renderTree(tree) : "No hierarchy defined yet."}</div>
      </div>
    </div>
  );
};

export default AccessControl;
