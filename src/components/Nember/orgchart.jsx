import React, { useState } from "react";

const COLORS = [
  "#000","#4CAF50","#FF9800","#9C27B0","#2196F3",
  "#E91E63","#3F51B5","#009688","#FFC107","#795548",
  "#607D8B","#8BC34A","#FF5722","#673AB7","#00BCD4"
];

const EMPLOYEES = [
  { name: "John Doe", role: "Manager", empId: "101" },
  { name: "Jane Smith", role: "Lead", empId: "102" },
  { name: "Alex Brown", role: "Engineer", empId: "103" },
];

export default function OrgChart() {
  const [zoom, setZoom] = useState(1);
  const [editingNode, setEditingNode] = useState(null);

  const [tree, setTree] = useState({
    id: 1,
    name: "Dianne Russell",
    role: "Director",
    empId: "001",
    collapsed: false,
    children: [],
  });

  const countChildren = (node) =>
    node.children.reduce((acc, c) => acc + 1 + countChildren(c), 0);

  const updateTree = (callback) => {
    const copy = JSON.parse(JSON.stringify(tree));
    callback(copy);
    setTree(copy);
  };

  const addNode = (id) => {
    updateTree((node) => {
      const add = (n) => {
        if (n.id === id) {
          n.children.push({
            id: Date.now(),
            name: "New Member",
            role: "Role",
            empId: Math.floor(Math.random() * 1000).toString(),
            collapsed: false,
            children: [],
          });
        } else n.children.forEach(add);
      };
      add(node);
    });
  };

  const removeNode = (id) => {
    if (id === tree.id) return;
    updateTree((node) => {
      const remove = (n) => {
        n.children = n.children.filter((c) => c.id !== id);
        n.children.forEach(remove);
      };
      remove(node);
    });
  };

  const toggleCollapse = (id) => {
    updateTree((node) => {
      const toggle = (n) => {
        if (n.id === id) n.collapsed = !n.collapsed;
        else n.children.forEach(toggle);
      };
      toggle(node);
    });
  };

  const applyEdit = (emp) => {
    updateTree((node) => {
      const edit = (n) => {
        if (n.id === editingNode.id) {
          n.name = emp.name;
          n.role = emp.role;
          n.empId = emp.empId;
        } else n.children.forEach(edit);
      };
      edit(node);
    });
    setEditingNode(null);
  };

  const Node = ({ node, level = 0 }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
      <div style={{ textAlign: "center" }}>
        {/* CARD */}
        <div
          style={{
            width: "280px",
            height: "90px",
            display: "flex",
            alignItems: "center",
            background: "#dfe7ea",
            borderRadius: "12px",
            margin: "10px auto",
            position: "relative",
          }}
        >
          {/* COLOR BAND */}
          <div
            style={{
              width: "20px",
              height: "100%",
              background: COLORS[level % COLORS.length],
              borderRadius: "12px 0 0 12px",
            }}
          />

          {/* AVATAR */}
          <div
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              background: "#000",
              margin: "0 10px",
            }}
          />

          {/* INFO */}
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontWeight: "bold" }}>{node.name}</div>
            <div style={{ fontSize: "12px" }}>{node.role}</div>
            <div style={{ fontSize: "11px" }}>
              <b>Emp ID:</b> {node.empId}
            </div>
          </div>

          {/* 3 DOT MENU */}
          <div style={{ position: "absolute", right: "8px", top: "8px" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ⋮
            </button>

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "22px",
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  overflow: "hidden",
                  zIndex: 100,
                }}
              >
                <div
                  style={{ padding: "8px", cursor: "pointer" }}
                  onClick={() => {
                    setEditingNode(node);
                    setMenuOpen(false);
                  }}
                >
                  Edit
                </div>

                {node.id !== tree.id && (
                  <div
                    style={{
                      padding: "8px",
                      color: "red",
                      cursor: "pointer",
                    }}
                    onClick={() => removeNode(node.id)}
                  >
                    Remove
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ADD BUTTON */}
          <button
            onClick={() => addNode(node.id)}
            style={{
              position: "absolute",
              right: "-15px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "none",
              background: "#2196f3",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            +
          </button>

          {/* COLLAPSE */}
          {node.children.length > 0 && (
            <div
              onClick={() => toggleCollapse(node.id)}
              style={{
                position: "absolute",
                bottom: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#ccc",
                padding: "2px 8px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              {node.collapsed ? `+${countChildren(node)}` : "-"}
            </div>
          )}
        </div>

        {/* CHILDREN */}
        {!node.collapsed && node.children.length > 0 && (
          <>
            <div style={{ width: "2px", height: "20px", background: "#555", margin: "0 auto" }} />

            <div style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
              {node.children.map((child) => (
                <Node key={child.id} node={child} level={level + 1} />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", background: "#f5f5f5", height: "100vh" }}>
      <h2>Team</h2>

      {/* CHART */}
      <div
        onWheel={(e) => {
          e.preventDefault();
          setZoom((z) =>
            Math.min(Math.max(z + (e.deltaY < 0 ? 0.1 : -0.1), 0.5), 2)
          );
        }}
        style={{
          height: "500px",
          background: "#eaeaea",
          borderRadius: "20px",
          overflow: "auto",
        }}
      >
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            padding: "40px",
          }}
        >
          <Node node={tree} />
        </div>
      </div>

      {/* EDIT POPUP */}
      {editingNode && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ background: "#fff", padding: "20px", borderRadius: "10px" }}>
            <h3>Select Employee</h3>

            {EMPLOYEES.map((emp) => (
              <div
                key={emp.empId}
                onClick={() => applyEdit(emp)}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer",
                }}
              >
                {emp.name} - {emp.role}
              </div>
            ))}

            <button onClick={() => setEditingNode(null)}>Close</button>
          </div>
        </div>
      )}

      {/* ZOOM BUTTONS */}
      <div style={{ position: "absolute", right: "20px", bottom: "20px" }}>
        <button style={{ width: "50px", height: "50px", fontSize: "22px" }} onClick={() => setZoom(z => Math.min(z+0.1,2))}>+</button>
        <button style={{ width: "50px", height: "50px", fontSize: "22px" }} onClick={() => setZoom(z => Math.max(z-0.1,0.5))}>-</button>
      </div>
    </div>
  );
}