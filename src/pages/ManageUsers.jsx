import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Search,
  Users,
  Crown,
  ShieldCheck,
  UserCog,
  UserCircle,
  Trash2,
  RefreshCcw,
} from "lucide-react";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateSubscriptionMutation,
} from "../store/userApiSlice";

const ROLE_STYLE = {
  Admin: {
    bg: "#ecfdf5",
    color: "#059669",
    border: "#a7f3d0",
    icon: <ShieldCheck size={12} />,
  },
  Doctor: {
    bg: "#eff6ff",
    color: "#2563eb",
    border: "#bfdbfe",
    icon: <UserCog size={12} />,
  },
  Receptionist: {
    bg: "#fefce8",
    color: "#ca8a04",
    border: "#fde68a",
    icon: <UserCog size={12} />,
  },
  Patient: {
    bg: "#f5f3ff",
    color: "#7c3aed",
    border: "#ddd6fe",
    icon: <UserCircle size={12} />,
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35 },
  }),
};

const ManageUsers = () => {
  const { data: users = [], isLoading, refetch } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateSubscription] = useUpdateSubscriptionMutation();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const filtered = users.filter((u) => {
    const matchSearch =
      u.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleTogglePlan = async (user) => {
    const newPlan = user.subscriptionPlan === "Pro" ? "Free" : "Pro";
    try {
      await updateSubscription({
        id: user._id,
        subscriptionPlan: newPlan,
      }).unwrap();
      toast.success(`${user.fullname} upgraded to ${newPlan} plan! 🚀`);
      refetch();
    } catch {
      toast.error("Failed to update subscription");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.fullname}? This cannot be undone.`))
      return;
    try {
      await deleteUser(user._id).unwrap();
      toast.success("User deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  const roleCounts = { Admin: 0, Doctor: 0, Receptionist: 0, Patient: 0 };
  users.forEach((u) => {
    if (roleCounts[u.role] !== undefined) roleCounts[u.role]++;
  });

  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "3px solid #e2e8f0",
            borderTopColor: "#0d9488",
            animation: "spin 0.9s linear infinite",
          }}
        />
      </div>
    );

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", paddingBottom: 40 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        style={{ marginBottom: 24 }}
      >
        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: 4,
          }}
        >
          Manage Users
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
          View all users, toggle plans, and manage access
        </p>
      </motion.div>

      {/* Stats Mini Cards */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {Object.entries(roleCounts).map(([role, count]) => {
          const s = ROLE_STYLE[role];
          return (
            <div
              key={role}
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.9)",
                borderRadius: 14,
                padding: "14px 16px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}
            >
              <p
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                {role}s
              </p>
              <h4
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  lineHeight: 1,
                }}
              >
                {count}
              </h4>
            </div>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            position: "relative",
            flex: 1,
            minWidth: 200,
            maxWidth: 360,
          }}
        >
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            style={{
              width: "100%",
              paddingLeft: 38,
              paddingRight: 12,
              paddingTop: 9,
              paddingBottom: 9,
              border: "1.5px solid #e2e8f0",
              borderRadius: 10,
              fontSize: "0.875rem",
              fontFamily: "inherit",
              outline: "none",
              background: "#f8fafc",
              boxSizing: "border-box",
            }}
          />
        </div>
        {["All", "Admin", "Doctor", "Receptionist", "Patient"].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: "1.5px solid",
              borderColor: roleFilter === r ? "#0d9488" : "#e2e8f0",
              background: roleFilter === r ? "#0d9488" : "#fff",
              color: roleFilter === r ? "#fff" : "#64748b",
              fontWeight: 600,
              fontSize: "0.78rem",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            {r}
          </button>
        ))}
        <button
          onClick={refetch}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "1.5px solid #e2e8f0",
            borderRadius: 10,
            padding: "7px 10px",
            cursor: "pointer",
            color: "#64748b",
          }}
        >
          <RefreshCcw size={15} />
        </button>
      </motion.div>

      {/* Table */}
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.9)",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.875rem",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["USER", "ROLE", "EMAIL", "PLAN", "ACTIONS"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "#94a3b8",
                      letterSpacing: "0.07em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    No users found
                  </td>
                </tr>
              )}
              {filtered.map((u) => {
                const rs = ROLE_STYLE[u.role] || ROLE_STYLE.Patient;
                return (
                  <tr
                    key={u._id}
                    style={{ borderTop: "1px solid #f1f5f9" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#f8fafc55")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={{ padding: "14px 20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: rs.bg,
                            border: `1.5px solid ${rs.border}`,
                            color: rs.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "0.9rem",
                            flexShrink: 0,
                          }}
                        >
                          {u.fullname?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, color: "#1e293b" }}>
                            {u.fullname}
                          </p>
                          <p style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                            Joined {new Date(u.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "3px 10px",
                          borderRadius: 999,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          background: rs.bg,
                          color: rs.color,
                          border: `1px solid ${rs.border}`,
                        }}
                      >
                        {rs.icon} {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", color: "#475569" }}>
                      {u.email}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "3px 10px",
                          borderRadius: 999,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          background:
                            u.subscriptionPlan === "Pro"
                              ? "#ede9fe"
                              : "#f1f5f9",
                          color:
                            u.subscriptionPlan === "Pro"
                              ? "#7c3aed"
                              : "#64748b",
                          border:
                            u.subscriptionPlan === "Pro"
                              ? "1px solid #c4b5fd"
                              : "1px solid #e2e8f0",
                        }}
                      >
                        {u.subscriptionPlan === "Pro" && <Crown size={10} />}{" "}
                        {u.subscriptionPlan || "Free"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {u.role !== "Admin" && (
                          <button
                            onClick={() => handleTogglePlan(u)}
                            style={{
                              padding: "5px 10px",
                              borderRadius: 8,
                              border: "1px solid #c4b5fd",
                              background: "#f5f3ff",
                              color: "#7c3aed",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              fontFamily: "inherit",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Crown size={11} />{" "}
                            {u.subscriptionPlan === "Pro"
                              ? "Downgrade"
                              : "Upgrade"}
                          </button>
                        )}
                        {u.role !== "Admin" && (
                          <button
                            onClick={() => handleDelete(u)}
                            style={{
                              padding: "5px 10px",
                              borderRadius: 8,
                              border: "1px solid #fecaca",
                              background: "#fef2f2",
                              color: "#dc2626",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              fontFamily: "inherit",
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Trash2 size={11} /> Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageUsers;
