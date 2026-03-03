import { useState } from "react";
import {
  useGetAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
} from "../store/appointmentApiSlice";
import { useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  Stethoscope,
  CheckCircle2,
  XCircle,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";

const STATUS_CONFIG = {
  Scheduled: { bg: "#eff6ff", text: "#0ea5e9", border: "#bfdbfe" },
  Completed: { bg: "#ecfdf5", text: "#10b981", border: "#a7f3d0" },
  "In Progress": { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
  Cancelled: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" },
};

const AppointmentsList = () => {
  const { data: appointments, isLoading, isError, error } = useGetAppointmentsQuery();
  const [updateStatus] = useUpdateAppointmentStatusMutation();
  const { user } = useSelector((state) => state.auth);
  const [filter, setFilter] = useState("all");

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(status === "Completed" ? "Session finalized! ✅" : "Appointment cancelled");
    } catch {
      toast.error("Status update failed");
    }
  };

  const filtered =
    filter === "all"
      ? appointments
      : appointments?.filter((a) => a.status?.toLowerCase() === filter);

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

  if (isLoading)
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, background: "#f0fdfa", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: "2px solid #e0f2fe", animation: "spin 0.8s linear infinite" }}>
            <Calendar size={24} color="#14b8a6" />
          </div>
          <p style={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Assembling Schedule...
          </p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#dc2626", background: "linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(220, 38, 38, 0.05))", borderRadius: 20, border: "1px solid rgba(239, 68, 68, 0.2)" }}>
        <AlertCircle size={40} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
        <p style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: 6 }}>Error Loading Appointments</p>
        <p style={{ fontSize: "0.9rem", color: "#991b1b" }}>{error?.data?.message || "Unknown error"}</p>
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
              <Calendar size={14} /> Appointments
            </p>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a", marginBottom: 8 }}>
              Manage clinic schedule & patient visits
            </h1>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {["all", "scheduled", "completed", "in progress", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                border: "1.5px solid",
                borderColor: filter === f ? "#0d9488" : "#e2e8f0",
                background: filter === f ? "#ecfdf5" : "white",
                color: filter === f ? "#0d9488" : "#64748b",
                fontSize: "0.8rem",
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (filter !== f) e.currentTarget.borderColor = "#cbd5e1"; }}
              onMouseLeave={(e) => { if (filter !== f) e.currentTarget.borderColor = "#e2e8f0"; }}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {filtered?.length === 0 ? (
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{
            background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)",
            border: "2px dashed #e2e8f0", borderRadius: 24, padding: 60, textAlign: "center",
          }}>
            <Calendar size={48} style={{ margin: "0 auto 16px", color: "#cbd5e1", opacity: 0.4 }} />
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>No Appointments Found</h3>
            <p style={{ fontSize: "0.95rem", color: "#94a3b8" }}>No appointments match the current filter.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 20,
            }}
          >
            {filtered?.map((appt) => {
              const statusConfig = STATUS_CONFIG[appt.status] || STATUS_CONFIG.Scheduled;
              const patientInitial = (user?.role === "Patient" ? appt.doctorId?.fullname : appt.patientId?.name)?.charAt(0)?.toUpperCase() || "U";
              const colors = ["#0d9488", "#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"];
              const colorIndex = appt._id?.charCodeAt(0) % colors.length;
              const color = colors[colorIndex];

              return (
                <motion.div key={appt._id} variants={itemVariants}
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
                    gap: 14,
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
                  {/* Header with Status */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
                        {user?.role === "Patient" ? "Doctor" : "Patient"}
                      </p>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
                        {user?.role === "Patient" ? `Dr. ${appt.doctorId?.fullname}` : appt.patientId?.name}
                      </h3>
                      <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
                        {user?.role === "Patient" ? appt.doctorId?.specialization : "Standard Checkup"}
                      </p>
                    </div>
                    <div style={{
                      padding: "6px 12px", borderRadius: 10, background: statusConfig.bg,
                      color: statusConfig.text, border: `1.5px solid ${statusConfig.border}`,
                      fontSize: "0.7rem", fontWeight: 700, whiteSpace: "nowrap",
                    }}>
                      {appt.status}
                    </div>
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width: 50, height: 50, borderRadius: 14, background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: 800, fontSize: "1.2rem",
                    boxShadow: `0 4px 12px ${color}40`,
                  }}>
                    {patientInitial}
                  </div>

                  {/* Details Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "12px 0", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
                    <div>
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 4 }}>Date</p>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a" }}>{dayjs(appt.date).format("MMM DD, YYYY")}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 4 }}>Time</p>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a", display: "flex", alignItems: "center", gap: 5 }}>
                        <Clock size={13} /> {dayjs(appt.date).format("HH:mm")}
                      </p>
                    </div>
                  </div>

                  {/* Notes */}
                  {appt.reason && (
                    <div style={{ padding: 10, background: "#f8fafc", borderRadius: 10, fontSize: "0.8rem", color: "#475569", fontStyle: "italic" }}>
                      📝 {appt.reason}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                    {user?.role !== "Patient" && appt.status === "Scheduled" && (
                      <>
                        <button onClick={() => handleStatusUpdate(appt._id, "Cancelled")}
                          style={{
                            flex: 1, padding: "8px 12px", borderRadius: 10, border: "1.5px solid #fecaca",
                            background: "#fef2f2", color: "#dc2626", fontSize: "0.75rem", fontWeight: 700,
                            fontFamily: "inherit", cursor: "pointer", transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.background = "#fee2e2"; }}
                          onMouseLeave={(e) => { e.currentTarget.background = "#fef2f2"; }}>
                          Cancel
                        </button>
                        <button onClick={() => handleStatusUpdate(appt._id, "Completed")}
                          style={{
                            flex: 1, padding: "8px 12px", borderRadius: 10, border: "none",
                            background: color, color: "white", fontSize: "0.75rem", fontWeight: 700,
                            fontFamily: "inherit", cursor: "pointer", transition: "all 0.2s",
                            boxShadow: `0 4px 12px ${color}40`,
                          }}
                          onMouseEnter={(e) => { e.currentTarget.transform = "scale(1.02)"; }}
                          onMouseLeave={(e) => { e.currentTarget.transform = "scale(1)"; }}>
                          Complete
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;
