import { useGetStatsQuery } from "../store/analyticsApiSlice";
import { useSelector } from "react-redux";
import {
  Users,
  Calendar,
  FileText,
  Activity,
  ChevronRight,
  TrendingUp,
  Stethoscope,
  ClipboardPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* ── Static schedule data ────────────────────────────── */
const STATIC_SCHEDULE = [
  {
    patient: "Ayesha Khan",
    time: "09:00 AM",
    type: "Follow-up",
    status: "Completed",
    sc: { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0" },
  },
  {
    patient: "Bilal Ahmed",
    time: "10:30 AM",
    type: "Consultation",
    status: "In Progress",
    sc: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  },
  {
    patient: "Sara Malik",
    time: "11:00 AM",
    type: "Check-up",
    status: "Scheduled",
    sc: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  },
  {
    patient: "Usman Ali",
    time: "02:00 PM",
    type: "Diagnosis",
    status: "Scheduled",
    sc: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  },
  {
    patient: "Fatima Noor",
    time: "03:30 PM",
    type: "Follow-up",
    status: "Scheduled",
    sc: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  },
];

/* ── Stat card component ─────────────────────────────── */
const StatCard = ({ title, value, icon, gradient, trend, trendUp, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    style={{
      background: "rgba(255,255,255,0.8)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.9)",
      borderRadius: 18,
      padding: "22px 24px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12,
    }}
  >
    <div>
      <p
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 6,
        }}
      >
        {title}
      </p>
      <h4
        style={{
          fontSize: "2.2rem",
          fontWeight: 800,
          color: "#0f172a",
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {value}
      </h4>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <TrendingUp size={12} color={trendUp ? "#10b981" : "#94a3b8"} />
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 600,
            color: trendUp ? "#10b981" : "#94a3b8",
          }}
        >
          {trend}
        </p>
      </div>
    </div>
    <div
      style={{
        width: 50,
        height: 50,
        borderRadius: 14,
        background: gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
  </motion.div>
);

/* ── Main Component ──────────────────────────────────── */
const DoctorDashboard = () => {
  const { data: stats, isLoading } = useGetStatsQuery();
  const { user } = useSelector((state) => state.auth);

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
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "3px solid #e2e8f0",
            borderTopColor: "#0d9488",
            animation: "spin 0.9s linear infinite",
          }}
        />
      </div>
    );

  const docName = user?.fullname?.startsWith("Dr")
    ? user.fullname
    : `Dr. ${user?.fullname || ""}`;

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", paddingBottom: 48 }}>
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
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
          <span style={{ fontWeight: 700, color: "#0d9488" }}>{docName}</span> —
          here's today's overview
        </p>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 18,
          marginBottom: 22,
        }}
      >
        <StatCard
          title="Total Patients"
          value={stats?.totalPatients ?? 1248}
          icon={<Users size={22} />}
          gradient="linear-gradient(135deg, #0d9488, #0ea5e9)"
          trend="+12% from last month"
          trendUp
          delay={0.05}
        />
        <StatCard
          title="Today's Appointments"
          value={stats?.dailyAppointments ?? 18}
          icon={<Calendar size={22} />}
          gradient="linear-gradient(135deg, #3b82f6, #818cf8)"
          trend="3 remaining"
          trendUp={false}
          delay={0.1}
        />
        <StatCard
          title="Prescriptions Issued"
          value={stats?.totalPrescriptions ?? 342}
          icon={<FileText size={22} />}
          gradient="linear-gradient(135deg, #10b981, #34d399)"
          trend="+8% this week"
          trendUp
          delay={0.15}
        />
        <StatCard
          title="AI Diagnoses"
          value={stats?.totalDiagnoses ?? 89}
          icon={<Activity size={22} />}
          gradient="linear-gradient(135deg, #f59e0b, #fb923c)"
          trend="+23% accuracy boost"
          trendUp
          delay={0.2}
        />
      </div>

      {/* ── Middle Row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 18,
          marginBottom: 22,
        }}
      >
        {/* Quick Actions — 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            gridColumn: "span 2",
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.9)",
            borderRadius: 18,
            padding: "22px 26px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 18,
            }}
          >
            Smart Tool Access
          </p>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            {/* Smart Diagnosis */}
            <Link to="/smart-diagnosis" style={{ textDecoration: "none" }}>
              <div
                style={{
                  padding: "20px",
                  borderRadius: 14,
                  border: "1.5px solid #fde68a",
                  background: "linear-gradient(135deg, #fffbeb, #fef9c3)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(245,158,11,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 13,
                    background: "linear-gradient(135deg, #f59e0b, #fb923c)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(245,158,11,0.35)",
                    flexShrink: 0,
                  }}
                >
                  <Stethoscope size={24} color="white" />
                </div>
                <div>
                  <h4
                    style={{
                      fontWeight: 700,
                      color: "#1e293b",
                      fontSize: "0.95rem",
                      marginBottom: 3,
                    }}
                  >
                    Run Smart Diagnosis
                  </h4>
                  <p style={{ fontSize: "0.75rem", color: "#92400e" }}>
                    Analyze clinical symptoms with AI
                  </p>
                </div>
              </div>
            </Link>

            {/* New Prescription */}
            <Link to="/prescriptions/new" style={{ textDecoration: "none" }}>
              <div
                style={{
                  padding: "20px",
                  borderRadius: 14,
                  border: "1.5px solid #a7f3d0",
                  background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(16,185,129,0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 13,
                    background: "linear-gradient(135deg, #10b981, #34d399)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(16,185,129,0.35)",
                    flexShrink: 0,
                  }}
                >
                  <ClipboardPlus size={24} color="white" />
                </div>
                <div>
                  <h4
                    style={{
                      fontWeight: 700,
                      color: "#1e293b",
                      fontSize: "0.95rem",
                      marginBottom: 3,
                    }}
                  >
                    New Prescription
                  </h4>
                  <p style={{ fontSize: "0.75rem", color: "#065f46" }}>
                    Generate an instant PDF prescription
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Appointment Status Donut — 1 col */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.9)",
            borderRadius: 18,
            padding: "22px 26px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 16,
            }}
          >
            Appointment Status
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 18,
            }}
          >
            <div style={{ position: "relative", width: 120, height: 120 }}>
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background:
                    "conic-gradient(#10b981 0% 65%, #3b82f6 65% 90%, #ef4444 90% 100%)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 16,
                  background: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1,
                  }}
                >
                  65%
                </span>
                <span
                  style={{
                    fontSize: "0.55rem",
                    color: "#94a3b8",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  Done
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Completed", pct: "65%", color: "#10b981" },
              { label: "Scheduled", pct: "25%", color: "#3b82f6" },
              { label: "Cancelled", pct: "10%", color: "#ef4444" },
            ].map(({ label, pct, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "#64748b",
                      fontWeight: 500,
                    }}
                  >
                    {label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "#1e293b",
                  }}
                >
                  {pct}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Today's Schedule Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.9)",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        {/* Table header */}
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
            <Calendar size={17} color="#0d9488" />
            <h3
              style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}
            >
              Today's Schedule
            </h3>
            <span
              style={{
                background: "#0d9488",
                color: "white",
                borderRadius: 20,
                fontSize: "0.65rem",
                fontWeight: 800,
                padding: "2px 8px",
              }}
            >
              {STATIC_SCHEDULE.length}
            </span>
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

        {/* Table */}
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
                {["PATIENT", "TIME", "TYPE", "STATUS"].map((h) => (
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
              {STATIC_SCHEDULE.map((item, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderTop: "1px solid #f1f5f9",
                    transition: "background 0.15s",
                  }}
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
                          flexShrink: 0,
                        }}
                      >
                        {item.patient.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600, color: "#1e293b" }}>
                        {item.patient}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "13px 22px",
                      color: "#475569",
                      fontWeight: 500,
                    }}
                  >
                    {item.time}
                  </td>
                  <td style={{ padding: "13px 22px", color: "#64748b" }}>
                    {item.type}
                  </td>
                  <td style={{ padding: "13px 22px" }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: 999,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        background: item.sc.bg,
                        color: item.sc.color,
                        border: `1px solid ${item.sc.border}`,
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorDashboard;
