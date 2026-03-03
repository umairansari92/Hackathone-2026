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
  Mail,
  Calendar,
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, background: "#f0fdfa", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: "2px solid #e0f2fe", animation: "spin 0.8s linear infinite" }}>
            <Users size={24} color="#0d9488" />
          </div>
          <p style={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Loading Users...
          </p>
        </div>
      </div>
    );

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", background: "#f8fafc", padding: "40px 20px", color: "#0f172a" }}>
      {/* Background Orbs */}
      <div style={{
        position: "fixed", top: "-10%", right: "-10%", width: 500, height: 500,
        background: "radial-gradient(circle, rgba(13, 148, 136, 0.1) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: "-10%", left: "-10%", width: 400, height: 400,
        background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 10 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0d9488", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <Users size={14} /> User Management
            </p>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a", marginBottom: 8 }}>
              Manage Users
            </h1>
            <p style={{ fontSize: "0.95rem", color: "#64748b" }}>View all users, toggle plans, and manage access</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {Object.entries(roleCounts).map(([role, count]) => {
            const s = ROLE_STYLE[role];
            return (
              <motion.div
                key={role}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.02, translateY: -4 }}
                style={{
                  background: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(16px)",
                  border: `1.5px solid ${s.border}`,
                  borderRadius: 16,
                  padding: "20px",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                  transition: "all 0.3s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, background: s.bg,
                    display: "flex", alignItems: "center", justifyContent: "center", color: s.color,
                  }}>
                    {s.icon}
                  </div>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, color: s.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {role}s
                  </p>
                </div>
                <h3 style={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>
                  {count}
                </h3>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 24,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 360 }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user name or email..."
              style={{
                width: "100%",
                paddingLeft: 40,
                paddingRight: 16,
                paddingTop: 10,
                paddingBottom: 10,
                border: "1.5px solid #e2e8f0",
                borderRadius: 12,
                fontSize: "0.9rem",
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
                background: "rgba(255,255,255,0.8)",
                transition: "all 0.2s",
              }}
              onFocus={(e) => { e.currentTarget.borderColor = "#0d9488"; e.currentTarget.boxShadow = "0 0 0 3px rgba(13,148,136,0.1)"; }}
              onBlur={(e) => { e.currentTarget.borderColor = "#e2e8f0"; e.currentTarget.boxShadow = "none"; }}
            />
          </div>
          {["All", "Admin", "Doctor", "Receptionist", "Patient"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                border: "1.5px solid",
                borderColor: roleFilter === r ? "#0d9488" : "#e2e8f0",
                background: roleFilter === r ? "#ecfdf5" : "white",
                color: roleFilter === r ? "#0d9488" : "#64748b",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (roleFilter !== r) e.currentTarget.borderColor = "#cbd5e1"; }}
              onMouseLeave={(e) => { if (roleFilter !== r) e.currentTarget.borderColor = "#e2e8f0"; }}
            >
              {r}
            </button>
          ))}
          <button
            onClick={refetch}
            style={{
              background: "none",
              border: "1.5px solid #e2e8f0",
              borderRadius: 10,
              padding: "8px 12px",
              cursor: "pointer",
              color: "#64748b",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.borderColor = "#0d9488"; e.currentTarget.color = "#0d9488"; }}
            onMouseLeave={(e) => { e.currentTarget.borderColor = "#e2e8f0"; e.currentTarget.color = "#64748b"; }}
          >
            <RefreshCcw size={16} />
          </button>
        </motion.div>

        {/* User Cards Grid */}
        {filtered?.length === 0 ? (
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{
            background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)",
            border: "2px dashed #e2e8f0", borderRadius: 24, padding: 60, textAlign: "center",
          }}>
            <Users size={48} style={{ margin: "0 auto 16px", color: "#cbd5e1", opacity: 0.4 }} />
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>No Users Found</h3>
            <p style={{ fontSize: "0.95rem", color: "#94a3b8" }}>Try adjusting your search or filter criteria.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {filtered?.map((u) => {
              const rs = ROLE_STYLE[u.role] || ROLE_STYLE.Patient;
              const colors = ["#0d9488", "#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"];
              const colorIndex = u._id?.charCodeAt(0) % colors.length;
              const bgColor = colors[colorIndex];

              return (
                <motion.div key={u._id} variants={itemVariants}
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.9)",
                    borderRadius: 18,
                    padding: 20,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)";
                  }}
                >
                  {/* Avatar & Name */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 4 }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: 12, background: `linear-gradient(135deg, ${bgColor}, ${bgColor}dd)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontWeight: 800, fontSize: "1.3rem",
                      boxShadow: `0 4px 12px ${bgColor}40`,
                      flexShrink: 0,
                    }}>
                      {u.fullname?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>
                        {u.fullname}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "3px 10px",
                          borderRadius: 8,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          background: rs.bg,
                          color: rs.color,
                          border: `1px solid ${rs.border}`,
                        }}>
                          {rs.icon} {u.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#f8fafc", borderRadius: 10 }}>
                    <Mail size={12} style={{ color: "#94a3b8", flexShrink: 0 }} />
                    <p style={{ fontSize: "0.8rem", color: "#64748b", wordBreak: "break-all" }}>
                      {u.email}
                    </p>
                  </div>

                  {/* Join Date & Plan */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingTop: 4, borderTop: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 6 }}>
                      <Calendar size={12} style={{ color: "#94a3b8" }} />
                      <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: 8,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      background: u.subscriptionPlan === "Pro" ? "#ede9fe" : "#f1f5f9",
                      color: u.subscriptionPlan === "Pro" ? "#7c3aed" : "#64748b",
                      border: u.subscriptionPlan === "Pro" ? "1px solid #c4b5fd" : "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                    }}>
                      {u.subscriptionPlan === "Pro" && <Crown size={10} />}
                      {u.subscriptionPlan || "Free"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  {u.role !== "Admin" && (
                    <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 8 }}>
                      <button
                        onClick={() => handleTogglePlan(u)}
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          borderRadius: 10,
                          border: "1.5px solid #c4b5fd",
                          background: "#f5f3ff",
                          color: "#7c3aed",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.background = "#ede9fe"; }}
                        onMouseLeave={(e) => { e.currentTarget.background = "#f5f3ff"; }}
                      >
                        <Crown size={12} style={{ marginRight: 4, display: "inline" }} />
                        {u.subscriptionPlan === "Pro" ? "Downgrade" : "Upgrade"}
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          borderRadius: 10,
                          border: "1.5px solid #fecaca",
                          background: "#fef2f2",
                          color: "#dc2626",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.background = "#fee2e2"; }}
                        onMouseLeave={(e) => { e.currentTarget.background = "#fef2f2"; }}
                      >
                        <Trash2 size={12} style={{ marginRight: 4, display: "inline" }} /> Delete
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
