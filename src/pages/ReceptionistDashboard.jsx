import { motion } from "framer-motion";
import {
  Users,
  Clock,
  CheckCircle2,
  UserCheck,
  Activity,
  Stethoscope,
} from "lucide-react";
import { useGetReceptionistDashboardQuery } from "../store/tokenApiSlice";
import { useGetAllSchedulesQuery } from "../store/scheduleApiSlice";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.38 },
  }),
};

const StatCard = ({ title, value, icon, color, bg, i }) => (
  <motion.div
    custom={i}
    initial="hidden"
    animate="visible"
    variants={fadeUp}
    style={{
      background: "rgba(255,255,255,0.75)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.9)",
      borderRadius: 18,
      padding: "18px 22px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
    }}
  >
    <div>
      <p
        style={{
          fontSize: "0.68rem",
          fontWeight: 700,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
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
        }}
      >
        {value ?? 0}
      </h4>
    </div>
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: 12,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: `0 4px 12px ${bg}55`,
      }}
    >
      {icon}
    </div>
  </motion.div>
);

const ReceptionistDashboard = () => {
  const { data: dash, isLoading } = useGetReceptionistDashboardQuery(
    undefined,
    { pollingInterval: 30000 },
  );
  const { data: schedules = [] } = useGetAllSchedulesQuery();

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

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", paddingBottom: 40 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        style={{ marginBottom: 26 }}
      >
        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: 4,
          }}
        >
          Receptionist Dashboard
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <StatCard
          i={1}
          title="Total Today"
          value={dash?.totalToday}
          icon={<Activity size={20} color="#fff" />}
          bg="#0d9488"
        />
        <StatCard
          i={2}
          title="Waiting"
          value={dash?.waiting}
          icon={<Clock size={20} color="#fff" />}
          bg="#f59e0b"
        />
        <StatCard
          i={3}
          title="Being Served"
          value={dash?.serving}
          icon={<UserCheck size={20} color="#fff" />}
          bg="#3b82f6"
        />
        <StatCard
          i={4}
          title="Completed"
          value={dash?.completed}
          icon={<CheckCircle2 size={20} color="#fff" />}
          bg="#10b981"
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        custom={5}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        style={{ marginBottom: 24 }}
      >
        <h3
          style={{
            fontSize: "0.9rem",
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: 12,
          }}
        >
          Quick Actions
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          {[
            {
              label: "Generate Token",
              to: "/book-appointment",
              color: "#0d9488",
              bg: "#ecfdf5",
            },
            {
              label: "View Queue",
              to: "/token-queue",
              color: "#3b82f6",
              bg: "#eff6ff",
            },
            {
              label: "Patients List",
              to: "/patients",
              color: "#6366f1",
              bg: "#f5f3ff",
            },
            {
              label: "Appointments",
              to: "/appointments",
              color: "#f59e0b",
              bg: "#fffbeb",
            },
          ].map(({ label, to, color, bg }) => (
            <Link key={to} to={to} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: bg,
                  border: `1.5px solid ${color}22`,
                  borderRadius: 14,
                  padding: "14px 16px",
                  textAlign: "center",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color,
                  transition: "transform 0.15s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                {label}
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Doctor Availability */}
      <motion.div
        custom={6}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.9)",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            padding: "16px 22px",
            borderBottom: "1px solid #f1f5f9",
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "#1e293b",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <Stethoscope size={16} color="#0d9488" /> Doctor Availability Today
        </div>
        <div style={{ padding: "8px 0" }}>
          {(dash?.doctorAvailability || []).length === 0 && (
            <p
              style={{
                padding: "20px 22px",
                color: "#94a3b8",
                fontSize: "0.875rem",
              }}
            >
              No schedules configured yet. Admin needs to set up doctor
              schedules.
            </p>
          )}
          {(dash?.doctorAvailability || []).map((d, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 22px",
                borderBottom: "1px solid #f8fafc",
              }}
            >
              <div>
                <p
                  style={{
                    fontWeight: 700,
                    color: "#1e293b",
                    fontSize: "0.875rem",
                  }}
                >
                  {d.doctor?.fullname || "—"}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  {d.doctor?.specialization || "Doctor"}
                </p>
              </div>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  background: d.available ? "#ecfdf5" : "#fef2f2",
                  color: d.available ? "#059669" : "#dc2626",
                  border: `1px solid ${d.available ? "#a7f3d0" : "#fecaca"}`,
                }}
              >
                {d.available ? "Available" : d.reason || "Unavailable"}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ReceptionistDashboard;
