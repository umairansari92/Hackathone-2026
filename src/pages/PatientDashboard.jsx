import {
  Calendar,
  FileText,
  Activity,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PatientDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const quickLinks = [
    {
      to: "/appointments",
      icon: <Calendar size={26} color="white" />,
      title: "My Appointments",
      desc: "View upcoming and past clinic visits",
      gradient: "linear-gradient(135deg, #3b82f6, #818cf8)",
      shadow: "rgba(59,130,246,0.3)",
      border: "#bfdbfe",
      bg: "linear-gradient(135deg, #eff6ff, #e0e7ff)",
    },
    {
      to: "/prescriptions",
      icon: <FileText size={26} color="white" />,
      title: "Prescriptions",
      desc: "Access medical prescriptions & PDFs",
      gradient: "linear-gradient(135deg, #10b981, #34d399)",
      shadow: "rgba(16,185,129,0.3)",
      border: "#a7f3d0",
      bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
    },
    {
      to: "/smart-diagnosis",
      icon: <Activity size={26} color="white" />,
      title: "AI Symptom Checker",
      desc: "Analyze your conditions using AI",
      gradient: "linear-gradient(135deg, #f59e0b, #fb923c)",
      shadow: "rgba(245,158,11,0.3)",
      border: "#fde68a",
      bg: "linear-gradient(135deg, #fffbeb, #fef3c7)",
    },
  ];

  const upcomingAppointments = [
    {
      doctor: "Dr. Sarah Jenkins",
      time: "Today, 10:30 AM",
      type: "Follow-up",
      sc: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
    },
    {
      doctor: "Dr. Michael Chang",
      time: "Nov 15, 02:00 PM",
      type: "Consultation",
      sc: { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0" },
    },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", paddingBottom: 48 }}>
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.65rem",
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 4,
              }}
            >
              Dashboard
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
              Welcome back,{" "}
              <span style={{ fontWeight: 700, color: "#0d9488" }}>
                {user?.fullname || "Patient"}
              </span>{" "}
              — here's your health overview
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                borderRadius: 999,
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#059669",
              }}
            >
              <ShieldCheck size={13} /> Official Patient
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                background: "#f5f3ff",
                border: "1px solid #ddd6fe",
                borderRadius: 999,
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "#7c3aed",
              }}
            >
              <Sparkles size={13} /> {user?.subscriptionPlan || "Free"} Plan
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Quick Action Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 18,
          marginBottom: 24,
        }}
      >
        {quickLinks.map(
          ({ to, icon, title, desc, gradient, shadow, border, bg }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link to={to} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    background: bg,
                    border: `1.5px solid ${border}`,
                    borderRadius: 18,
                    padding: "22px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    height: "100%",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = `0 12px 32px ${shadow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(0,0,0,0.05)";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 14,
                        background: gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 6px 16px ${shadow}`,
                      }}
                    >
                      {icon}
                    </div>
                    <ChevronRight size={18} color="#94a3b8" />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "#1e293b",
                        marginBottom: 4,
                      }}
                    >
                      {title}
                    </h3>
                    <p style={{ fontSize: "0.78rem", color: "#64748b" }}>
                      {desc}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ),
        )}
      </div>

      {/* ── Upcoming Schedule Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.9)",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          marginBottom: 22,
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={17} color="#0d9488" />
            <h3
              style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}
            >
              Upcoming Schedule
            </h3>
          </div>
          <Link
            to="/appointments"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "#0d9488",
              fontSize: "0.8rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            View All <ChevronRight size={15} />
          </Link>
        </div>
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
                {["DOCTOR", "DATE & TIME", "TYPE", "STATUS"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 22px",
                      textAlign: "left",
                      fontSize: "0.65rem",
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
              {upcomingAppointments.map((appt, i) => (
                <tr
                  key={i}
                  style={{ borderTop: "1px solid #f1f5f9" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f8fafc88")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={{ padding: "13px 22px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 9,
                          background:
                            "linear-gradient(135deg, #0d9488, #0ea5e9)",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "0.8rem",
                        }}
                      >
                        {appt.doctor.split(" ")[1]?.charAt(0) || "D"}
                      </div>
                      <span style={{ fontWeight: 600, color: "#1e293b" }}>
                        {appt.doctor}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "13px 22px",
                      color: "#475569",
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Clock size={13} color="#94a3b8" /> {appt.time}
                  </td>
                  <td style={{ padding: "13px 22px", color: "#64748b" }}>
                    {appt.type}
                  </td>
                  <td style={{ padding: "13px 22px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: 999,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        background: appt.sc.bg,
                        color: appt.sc.color,
                        border: `1px solid ${appt.sc.border}`,
                      }}
                    >
                      Scheduled
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Pro Upgrade Banner ── */}
      {(!user?.subscriptionPlan || user?.subscriptionPlan === "Free") && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            borderRadius: 18,
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 8px 28px rgba(99,102,241,0.35)",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={24} color="white" />
            </div>
            <div>
              <h3
                style={{
                  fontWeight: 800,
                  color: "white",
                  fontSize: "1rem",
                  marginBottom: 4,
                }}
              >
                Elevate Your Healthcare
              </h3>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)" }}>
                Upgrade to Pro for AI analytics and priority bookings.
              </p>
            </div>
          </div>
          <button
            style={{
              whiteSpace: "nowrap",
              background: "white",
              color: "#6366f1",
              padding: "10px 22px",
              borderRadius: 12,
              fontWeight: 800,
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
            }}
          >
            Upgrade to Pro <ChevronRight size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default PatientDashboard;
