import { useState } from "react";
import { useGetAppointmentsQuery } from "../store/appointmentApiSlice";
import { useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  User,
  Activity,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import dayjs from "dayjs";

const STATUS_SC = {
  Scheduled: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Completed: { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0" },
  Cancelled: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

const AppointmentsList = () => {
  const {
    data: appointments,
    isLoading,
    isError,
    error,
  } = useGetAppointmentsQuery();
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? appointments
      : appointments?.filter((a) => a.status?.toLowerCase() === filter);

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
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "3px solid #e2e8f0",
            borderTopColor: "#0d9488",
            animation: "spin 0.9s linear infinite",
          }}
        />
      </div>
    );

  if (isError)
    return (
      <div
        style={{
          padding: "32px",
          textAlign: "center",
          color: "#dc2626",
          background: "#fef2f2",
          borderRadius: 16,
          border: "1px solid #fecaca",
        }}
      >
        Error loading appointments: {error?.data?.message || "Unknown error"}
      </div>
    );

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", paddingBottom: 48 }}>
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: 28,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 14,
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
            Schedule Overview
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
            {user?.role === "Patient"
              ? "Your upcoming and past clinic visits."
              : "Manage all clinic appointments and schedules."}
          </p>
        </div>
        {user?.role !== "Patient" && (
          <div
            style={{
              display: "flex",
              background: "#f1f5f9",
              padding: 4,
              borderRadius: 999,
              gap: 2,
            }}
          >
            {["all", "scheduled", "completed", "cancelled"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  transition: "all 0.18s",
                  background: filter === f ? "#0d9488" : "transparent",
                  color: filter === f ? "white" : "#64748b",
                  boxShadow:
                    filter === f ? "0 2px 8px rgba(13,148,136,0.3)" : "none",
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Table Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.9)",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Calendar size={18} color="#0d9488" />
          <h3
            style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}
          >
            Appointments
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
            {filtered?.length || 0}
          </span>
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
                <th style={thStyle}>Date & Time</th>
                {user?.role !== "Patient" && <th style={thStyle}>Patient</th>}
                {user?.role !== "Doctor" && <th style={thStyle}>Doctor</th>}
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((appt) => {
                const sc = STATUS_SC[appt.status] || STATUS_SC.Scheduled;
                return (
                  <tr
                    key={appt._id}
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
                    <td style={tdStyle}>
                      <p style={{ fontWeight: 700, color: "#1e293b" }}>
                        {dayjs(appt.date).format("MMM DD, YYYY")}
                      </p>
                      <p
                        style={{
                          fontSize: "0.72rem",
                          color: "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          marginTop: 2,
                        }}
                      >
                        <Clock size={11} /> {dayjs(appt.date).format("hh:mm A")}
                      </p>
                    </td>
                    {user?.role !== "Patient" && (
                      <td style={tdStyle}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 9,
                              background:
                                "linear-gradient(135deg, #3b82f6, #818cf8)",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              fontSize: "0.8rem",
                              flexShrink: 0,
                            }}
                          >
                            {appt.patientId?.name?.charAt(0) || "P"}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, color: "#1e293b" }}>
                              {appt.patientId?.name || "Unknown"}
                            </p>
                            <p
                              style={{ fontSize: "0.72rem", color: "#94a3b8" }}
                            >
                              {appt.patientId?.contact}
                            </p>
                          </div>
                        </div>
                      </td>
                    )}
                    {user?.role !== "Doctor" && (
                      <td
                        style={{
                          ...tdStyle,
                          color: "#475569",
                          fontWeight: 500,
                        }}
                      >
                        Dr.{" "}
                        {appt.doctorId?.fullname?.split(" ")[1] ||
                          appt.doctorId?.fullname ||
                          "Unassigned"}
                      </td>
                    )}
                    <td style={tdStyle}>
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: 999,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          background: sc.bg,
                          color: sc.color,
                          border: `1px solid ${sc.border}`,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        {appt.status === "Completed" && (
                          <CheckCircle2 size={11} />
                        )}
                        {appt.status === "Cancelled" && <XCircle size={11} />}
                        {appt.status === "Scheduled" && <Clock size={11} />}
                        {appt.status}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {user?.role !== "Patient" &&
                      appt.status === "Scheduled" ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 6,
                          }}
                        >
                          <button
                            style={{
                              padding: "5px 12px",
                              borderRadius: 8,
                              border: "1px solid #a7f3d0",
                              background: "#ecfdf5",
                              color: "#059669",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              fontFamily: "inherit",
                            }}
                          >
                            Complete
                          </button>
                          <button
                            style={{
                              padding: "5px 12px",
                              borderRadius: 8,
                              border: "1px solid #fecaca",
                              background: "#fef2f2",
                              color: "#dc2626",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              fontFamily: "inherit",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span
                          style={{
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: "#0d9488",
                            cursor: "pointer",
                          }}
                        >
                          View →
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {(!filtered || filtered.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    style={{ padding: "48px", textAlign: "center" }}
                  >
                    <Calendar
                      size={40}
                      style={{ margin: "0 auto 12px", color: "#e2e8f0" }}
                    />
                    <p style={{ fontWeight: 700, color: "#64748b" }}>
                      No appointments found
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#94a3b8",
                        marginTop: 4,
                      }}
                    >
                      Your schedule is currently clear.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

const thStyle = {
  padding: "11px 22px",
  textAlign: "left",
  fontSize: "0.65rem",
  fontWeight: 700,
  color: "#94a3b8",
  letterSpacing: "0.07em",
};
const tdStyle = { padding: "13px 22px" };

export default AppointmentsList;
