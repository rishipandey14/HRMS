import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../utility/Config";

const COLORS = [
  "#2196F3", "#4CAF50", "#FF9800", "#9C27B0", "#E91E63",
  "#3F51B5", "#009688", "#FFC107", "#795548", "#00BCD4",
  "#FF5722", "#673AB7", "#8BC34A", "#607D8B", "#F44336"
];

const CARD_W = 240;
const CARD_H = 88;
const H_GAP = 80;
const V_GAP = 20;

const titleCase = (value = "") =>
  String(value)
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");

function countAll(node) {
  return node.children.reduce((a, c) => a + 1 + countAll(c), 0);
}

function subtreeHeight(node) {
  if (node.collapsed || node.children.length === 0) return CARD_H;
  const childrenH =
    node.children.reduce((a, c) => a + subtreeHeight(c), 0) +
    (node.children.length - 1) * V_GAP;
  return Math.max(CARD_H, childrenH);
}

function NodeTree({ node, level, onToggle }) {
  const sh = subtreeHeight(node);
  const childrenVisible = !node.collapsed && node.children.length > 0;

  let childOffsets = [];
  if (childrenVisible) {
    let y = 0;
    for (const child of node.children) {
      const h = subtreeHeight(child);
      childOffsets.push({ child, y, h });
      y += h + V_GAP;
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: sh, position: "relative", minWidth: CARD_W }}>
        <div
          style={{
            width: CARD_W,
            height: CARD_H,
            display: "flex",
            alignItems: "center",
            background: "#fff",
            border: "1px solid #e8edf2",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            borderRadius: 12,
            position: "relative",
            userSelect: "none",
          }}
        >
          <div style={{ width: 14, height: "100%", background: COLORS[level % COLORS.length], borderRadius: "12px 0 0 12px", flexShrink: 0 }} />

          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: `${COLORS[level % COLORS.length]}33`,
              margin: "0 8px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: "bold",
              color: COLORS[level % COLORS.length],
            }}
          >
            {node.name.charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{node.name}</div>
            <div style={{ fontSize: 11, color: "#666", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {node.role}
            </div>
            {node.meta && (
              <div style={{ fontSize: 10, color: "#999" }}>{node.meta}</div>
            )}
          </div>

          {node.children.length > 0 && (
            <button
              onClick={() => onToggle(node.id)}
              style={{
                position: "absolute",
                right: -14,
                bottom: -10,
                width: 22,
                height: 22,
                borderRadius: "50%",
                border: "2px solid #bbb",
                background: "#fff",
                cursor: "pointer",
                fontSize: 10,
                fontWeight: "bold",
                color: "#555",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 11,
              }}
            >
              {node.collapsed ? `+${countAll(node)}` : "-"}
            </button>
          )}
        </div>
      </div>

      {childrenVisible && childOffsets.length > 0 && (
        <div style={{ display: "flex", flexDirection: "row", position: "relative" }}>
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }} width={H_GAP} height={sh}>
            {childOffsets.map(({ child, y, h }) => {
              const childMidY = y + h / 2;
              const parentMidY = sh / 2;
              return (
                <path
                  key={child.id}
                  d={`M0,${parentMidY} C${H_GAP / 2},${parentMidY} ${H_GAP / 2},${childMidY} ${H_GAP},${childMidY}`}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth={1.5}
                />
              );
            })}
          </svg>

          <div style={{ marginLeft: H_GAP, display: "flex", flexDirection: "column", gap: V_GAP }}>
            {childOffsets.map(({ child }) => (
              <NodeTree key={child.id} node={child} level={level + 1} onToggle={onToggle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const cloneNode = (node) => ({
  ...node,
  collapsed: Boolean(node.collapsed),
  children: Array.isArray(node.children) ? node.children.map(cloneNode) : [],
});

const buildDisplayTree = (roleTree = [], unassignedUsers = []) => {
  const toPersonNode = (user) => ({
    id: `user-${user.userId}`,
    name: user.name,
    role: titleCase(user.roleName || "Unassigned"),
    meta: user.email || "",
    membersCount: 0,
    collapsed: false,
    children: [],
  });

  // Build person-only flow: empty role levels are skipped, descendants are promoted upward.
  const toPeopleNodes = (role) => {
    const childPeople = Array.isArray(role.children)
      ? role.children.flatMap((childRole) => toPeopleNodes(childRole))
      : [];

    const usersInRole = Array.isArray(role.users) ? role.users : [];
    if (usersInRole.length === 0) {
      return childPeople;
    }

    const peopleNodes = usersInRole.map((user) => toPersonNode(user));

    if (peopleNodes.length > 0) {
      peopleNodes[0].children = childPeople;
    }

    return peopleNodes;
  };

  const peopleByHierarchy = Array.isArray(roleTree)
    ? roleTree.flatMap((role) => toPeopleNodes(role))
    : [];

  const unassignedNodes = Array.isArray(unassignedUsers)
    ? unassignedUsers.map((user) => ({
        ...toPersonNode(user),
        role: "Unassigned",
      }))
    : [];

  const rootChildren = [...peopleByHierarchy, ...unassignedNodes];

  if (rootChildren.length === 0) {
    return {
      id: "root-empty",
      name: "No People Found",
      role: "No assigned people",
      membersCount: 0,
      collapsed: false,
      children: [],
    };
  }

  return {
    id: "root-company",
    name: "Company People",
    role: "Reporting Flow",
    membersCount: 0,
    collapsed: false,
    children: rootChildren,
  };
};

export default function OrgChart() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tree, setTree] = useState({
    id: "root-loading",
    name: "Loading",
    role: "People Flow",
    membersCount: 0,
    collapsed: false,
    children: [],
  });

  const containerRef = useRef(null);
  const isPanning = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const totalPeople = useMemo(() => countAll(tree), [tree]);

  const fetchRoleTree = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/rbac/orgchart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTree(buildDisplayTree(response.data?.tree || [], response.data?.unassignedUsers || []));
    } catch (fetchError) {
      setError(fetchError.response?.data?.msg || "Failed to load organization chart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleTree();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e) => {
      e.preventDefault();
      setZoom((z) => Math.min(Math.max(z + (e.deltaY < 0 ? 0.08 : -0.08), 0.3), 2.5));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  const onMouseDown = (e) => {
    if (e.target.closest("button")) return;
    isPanning.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e) => {
    if (!isPanning.current) return;
    setPan((p) => ({ x: p.x + e.clientX - lastMouse.current.x, y: p.y + e.clientY - lastMouse.current.y }));
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => {
    isPanning.current = false;
  };

  const toggleCollapse = (targetId) => {
    setTree((prev) => {
      const next = cloneNode(prev);
      const toggle = (node) => {
        if (String(node.id) === String(targetId)) {
          node.collapsed = !node.collapsed;
          return;
        }
        node.children.forEach(toggle);
      };

      toggle(next);
      return next;
    });
  };

  return (
    <div style={{ width: "100%", height: "70vh", overflow: "hidden", position: "relative", background: "#f0f4f8", borderRadius: 14 }}>
      <div style={{ position: "absolute", top: 10, left: 12, zIndex: 20, background: "rgba(255,255,255,0.9)", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 10px", fontSize: 12, color: "#334155" }}>
        <div>People: {totalPeople}</div>
        <div>Zoom: {Math.round(zoom * 100)}%</div>
      </div>

      <div style={{ position: "absolute", top: 10, right: 12, zIndex: 20, display: "flex", gap: 8 }}>
        <button
          onClick={fetchRoleTree}
          style={{ border: "1px solid #cbd5e1", background: "#fff", borderRadius: 8, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}
        >
          Reload
        </button>
      </div>

      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", overflowY: "auto", overflowX: "hidden", cursor: "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            display: "inline-block",
            padding: "20px",
          }}
        >
          {loading ? (
            <div style={{ color: "#64748b", fontSize: 14 }}>Loading company people flow...</div>
          ) : error ? (
            <div style={{ color: "#b91c1c", fontSize: 14 }}>{error}</div>
          ) : (
            <NodeTree node={tree} level={0} onToggle={toggleCollapse} />
          )}
        </div>
      </div>

      <div style={{ position: "fixed", right: 20, bottom: 20, display: "flex", flexDirection: "column", gap: 8, zIndex: 300 }}>
        {[["+", 0.1], ["-", -0.1]].map(([label, delta]) => (
          <button
            key={label}
            onClick={() => setZoom((z) => Math.min(Math.max(z + delta, 0.3), 2.5))}
            style={{ width: 42, height: 42, borderRadius: 10, border: "1px solid #ddd", background: "#fff", fontSize: 20, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 40, y: 40 });
          }}
          style={{ width: 42, height: 42, borderRadius: 10, border: "1px solid #ddd", background: "#fff", fontSize: 12, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}