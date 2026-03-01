import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Stethoscope,
  Calendar,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  Edit3,
} from "lucide-react";
import {
  useGetAllSchedulesQuery,
  useMarkLeaveMutation,
} from "../store/scheduleApiSlice";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DoctorScheduleView = () => {
  const {
    data: schedules = [],
    isLoading,
    refetch,
  } = useGetAllSchedulesQuery();
  const [markLeave] = useMarkLeaveMutation();
  const [leaveDates, setLeaveDates] = useState({});

  const today = new Date().toISOString().split("T")[0];
  const todayDay = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const handleMarkLeave = async (doctorId, isOnLeave) => {
    const leaveDate = leaveDates[doctorId] || today;
    try {
      await markLeave({ doctorId, isOnLeave, leaveDate }).unwrap();
      toast.success(
        isOnLeave ? "Doctor marked on leave 🏖️" : "Leave cancelled ✅",
      );
      refetch();
    } catch {
      toast.error("Failed to update leave status");
    }
  };

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
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
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
          Doctor Schedules
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
          View working hours, days, and manage doctor leave
        </p>
      </motion.div>

      {schedules.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "rgba(255,255,255,0.7)",
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.9)",
          }}
        >
          <Stethoscope
            size={48}
            style={{ color: "#e2e8f0", margin: "0 auto 12px" }}
          />
          <p style={{ color: "#94a3b8", fontWeight: 600 }}>
            No schedules configured yet.
          </p>
          <p style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>
            Admin needs to set up doctor working hours.
          </p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {schedules.map((s, i) => {
          const doc = s.doctorId;
          const isWorkingToday = s.workingDays?.includes(todayDay);
          const leaveDateStr = s.leaveDate
            ? new Date(s.leaveDate).toISOString().split("T")[0]
            : null;
          const onLeaveToday = s.isOnLeave && leaveDateStr === today;
          const onLeaveSet = s.leaveDates?.some(
            (d) => new Date(d).toISOString().split("T")[0] === today,
          );
          const unavailableToday =
            !isWorkingToday || onLeaveToday || onLeaveSet;

          return (
            <motion.div
              key={s._id}
              custom={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.9)",
                borderRadius: 18,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  padding: "16px 22px",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "#0d9488",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "1rem",
                    }}
                  >
                    {doc?.fullname?.charAt(0) || "D"}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: "#1e293b" }}>
                      {doc?.fullname || "—"}
                    </p>
                    <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                      {doc?.specialization || "Doctor"} · {doc?.email}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: 999,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    background: !unavailableToday ? "#ecfdf5" : "#fef2f2",
                    color: !unavailableToday ? "#059669" : "#dc2626",
                    border: `1px solid ${!unavailableToday ? "#a7f3d0" : "#fecaca"}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {!unavailableToday ? (
                    <>
                      <CheckCircle2 size={12} /> Available Today
                    </>
                  ) : (
                    <>
                      <AlertCircle size={12} />{" "}
                      {!isWorkingToday ? `Off ${todayDay}` : "On Leave"}
                    </>
                  )}
                </span>
              </div>

              {/* Schedule Info */}
              <div
                style={{
                  padding: "16px 22px",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "#f0fdfa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Clock size={15} color="#0d9488" />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Working Hours
                    </p>
                    <p
                      style={{
                        fontWeight: 700,
                        color: "#1e293b",
                        fontSize: "0.875rem",
                      }}
                    >
                      {s.startTime || "09:00"} – {s.endTime || "17:00"}
                    </p>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "#f0fdfa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Users size={15} color="#0d9488" />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Max Patients/Day
                    </p>
                    <p
                      style={{
                        fontWeight: 700,
                        color: "#1e293b",
                        fontSize: "0.875rem",
                      }}
                    >
                      {s.maxPatientsPerDay || 30}
                    </p>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "#f0fdfa",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Calendar size={15} color="#0d9488" />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Working Days
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,
                        marginTop: 3,
                      }}
                    >
                      {DAYS.map((d) => (
                        <span
                          key={d}
                          style={{
                            padding: "2px 6px",
                            borderRadius: 5,
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            background: s.workingDays?.includes(d)
                              ? "#0d9488"
                              : "#f1f5f9",
                            color: s.workingDays?.includes(d)
                              ? "#fff"
                              : "#cbd5e1",
                          }}
                        >
                          {d.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Leave Management */}
              <div
                style={{
                  padding: "12px 22px",
                  borderTop: "1px solid #f1f5f9",
                  background: "#fafafa",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#64748b",
                  }}
                >
                  Mark Leave:
                </span>
                <input
                  type="date"
                  value={leaveDates[doc?._id] || today}
                  onChange={(e) =>
                    setLeaveDates((p) => ({ ...p, [doc?._id]: e.target.value }))
                  }
                  style={{
                    padding: "5px 10px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 8,
                    fontSize: "0.8rem",
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => handleMarkLeave(doc?._id, true)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 8,
                    border: "1px solid #fde68a",
                    background: "#fffbeb",
                    color: "#d97706",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  🏖️ Mark On Leave
                </button>
                <button
                  onClick={() => handleMarkLeave(doc?._id, false)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 8,
                    border: "1px solid #a7f3d0",
                    background: "#ecfdf5",
                    color: "#059669",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  ✅ Cancel Leave
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorScheduleView;
