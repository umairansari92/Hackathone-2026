import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Printer,
  RefreshCw,
  Hash,
  Users,
  User,
  Calendar,
  ChevronRight,
} from "lucide-react";
import {
  useGetTodayQueueQuery,
  useUpdateTokenStatusMutation,
  useCallNextPatientMutation,
  useResetTokensMutation,
} from "../store/tokenApiSlice";
import { useGetAllSchedulesQuery } from "../store/scheduleApiSlice";

const STATUS_COLOR = {
  Waiting: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Serving: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
  Completed: { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0" },
  Cancelled: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const TokenQueue = () => {
  const { data: schedules = [] } = useGetAllSchedulesQuery();
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const {
    data: queue = [],
    isLoading,
    refetch,
  } = useGetTodayQueueQuery(
    { doctorId: selectedDoctor, date: today },
    { pollingInterval: 15000 },
  );
  const [updateStatus] = useUpdateTokenStatusMutation();
  const [callNext, { isLoading: calling }] = useCallNextPatientMutation();
  const [resetTokens, { isLoading: resetting }] = useResetTokensMutation();

  const handleStatus = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      const labels = {
        Serving: "Patient called ✅",
        Completed: "Marked complete ✅",
        Cancelled: "Cancelled",
      };
      toast.success(labels[status] || "Status updated");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const handleCallNext = async () => {
    if (!selectedDoctor) {
      toast.error("Please select a doctor first");
      return;
    }
    try {
      const next = await callNext({ doctorId: selectedDoctor }).unwrap();
      toast.success(
        `📢 Calling Token #${next.tokenNumber} — ${next.patientId?.name}!`,
      );
    } catch (err) {
      toast.error(err?.data?.message || "No patients waiting");
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        "Reset all tokens for today? This will cancel all Waiting/Serving tokens.",
      )
    )
      return;
    try {
      await resetTokens({
        doctorId: selectedDoctor || undefined,
        date: today,
      }).unwrap();
      toast.success("🔄 Tokens reset successfully");
    } catch (err) {
      toast.error("Reset failed");
    }
  };

  const handlePrint = (token) => {
    // Find the doctor's actual schedule from already-loaded data
    const docSchedule = schedules.find(
      (s) =>
        (s.doctorId?._id || s.doctorId) ===
        (token.doctorId?._id || token.doctorId),
    );
    const timeDisplay =
      docSchedule?.startTime && docSchedule?.endTime
        ? `${docSchedule.startTime} – ${docSchedule.endTime}`
        : "Not configured";

    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Token Slip</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; max-width: 380px; margin: 0 auto; }
        .header { background: #0d9488; color: white; padding: 14px 18px; border-radius: 10px 10px 0 0; text-align: center; }
        .body { border: 2px solid #0d9488; border-top: none; padding: 20px; border-radius: 0 0 10px 10px; }
        .token { font-size: 72px; font-weight: 900; text-align: center; color: #0d9488; margin: 10px 0; }
        .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #e2e8f0; font-size: 13px; }
        .label { color: #64748b; font-weight: 600; }
        .footer { text-align: center; margin-top: 14px; color: #94a3b8; font-size: 11px; }
      </style></head>
      <body>
        <div class="header">
          <div style="font-size:18px;font-weight:700;">🏥 Al Shifa Hospital</div>
          <div style="font-size:12px;margin-top:3px;">Al Shifa Hospital — Token Slip</div>
        </div>
        <div class="body">
          <div class="token">#${token.tokenNumber}</div>
          <div class="row"><span class="label">Patient</span><span>${token.patientId?.name}</span></div>
          <div class="row"><span class="label">Doctor</span><span>${token.doctorId?.fullname}</span></div>
          <div class="row"><span class="label">Date</span><span>${token.date}</span></div>
          <div class="row"><span class="label">Time</span><span>${timeDisplay}</span></div>
          <div class="row"><span class="label">Status</span><span>${token.status}</span></div>
          <div class="footer">Please wait at the reception. Your token will be called in order.<br/>Thank you for choosing Al Shifa Hospital.</div>
        </div>
        <script>window.onload = () => { window.print(); window.close(); }</script>
      </body></html>
    `);
  };

  const waiting = queue.filter((t) => t.status === "Waiting").length;
  const serving = queue.filter((t) => t.status === "Serving").length;
  const completed = queue.filter((t) => t.status === "Completed").length;

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", paddingBottom: 40 }}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 22 }}
      >
        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: 4,
          }}
        >
          Token Queue
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
          Manage today's patient queue in real-time
        </p>
      </motion.div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          style={{
            padding: "9px 14px",
            border: "1.5px solid #e2e8f0",
            borderRadius: 10,
            fontSize: "0.875rem",
            fontFamily: "inherit",
            outline: "none",
            background: "#fff",
            minWidth: 200,
          }}
        >
          <option value="">All Doctors</option>
          {schedules.map((s) => (
            <option
              key={s.doctorId?._id || s._id}
              value={s.doctorId?._id || s._id}
            >
              {s.doctorId?.fullname || "Doctor"}
            </option>
          ))}
        </select>

        <button
          onClick={handleCallNext}
          disabled={calling}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 16px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: "0.875rem",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <ChevronRight size={16} /> Call Next
        </button>

        <button
          onClick={() => refetch()}
          style={{
            padding: "9px 12px",
            background: "#f1f5f9",
            border: "1.5px solid #e2e8f0",
            borderRadius: 10,
            cursor: "pointer",
            color: "#64748b",
          }}
        >
          <RefreshCw size={15} />
        </button>

        <button
          onClick={handleReset}
          disabled={resetting}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 16px",
            background: resetting ? "#f1f5f9" : "#fef2f2",
            color: "#dc2626",
            border: "1.5px solid #fecaca",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: "0.875rem",
            cursor: "pointer",
            fontFamily: "inherit",
            marginLeft: "auto",
          }}
        >
          <RotateCcw size={15} /> Reset Tokens
        </button>
      </div>

      {/* Mini Stats */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        {[
          { label: "Waiting", val: waiting, color: "#f59e0b" },
          { label: "Serving", val: serving, color: "#3b82f6" },
          { label: "Completed", val: completed, color: "#10b981" },
          { label: "Total", val: queue.length, color: "#0d9488" },
        ].map(({ label, val, color }) => (
          <div
            key={label}
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.9)",
              borderRadius: 12,
              padding: "10px 18px",
              minWidth: 90,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <p
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {label}
            </p>
            <h4
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                color,
                lineHeight: 1.1,
              }}
            >
              {val}
            </h4>
          </div>
        ))}
      </div>

      {/* Queue Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.9)",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        {isLoading ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "3px solid #e2e8f0",
                borderTopColor: "#0d9488",
                animation: "spin 0.9s linear infinite",
                margin: "0 auto",
              }}
            />
          </div>
        ) : queue.length === 0 ? (
          <div
            style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}
          >
            <Clock size={36} style={{ opacity: 0.3, margin: "0 auto 10px" }} />
            <p>No tokens generated yet today.</p>
          </div>
        ) : (
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
                  {["TOKEN", "PATIENT", "DOCTOR", "STATUS", "ACTIONS"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 18px",
                          textAlign: "left",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: "#94a3b8",
                          letterSpacing: "0.07em",
                        }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {queue.map((token) => {
                    const sc =
                      STATUS_COLOR[token.status] || STATUS_COLOR.Waiting;
                    return (
                      <motion.tr
                        key={token._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ borderTop: "1px solid #f1f5f9" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f8fafc55")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td style={{ padding: "12px 18px" }}>
                          <div
                            style={{
                              width: 42,
                              height: 42,
                              borderRadius: 10,
                              background:
                                "linear-gradient(135deg, #0d9488, #0ea5e9)",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              fontSize: "1.1rem",
                            }}
                          >
                            {token.tokenNumber}
                          </div>
                        </td>
                        <td style={{ padding: "12px 18px" }}>
                          <p style={{ fontWeight: 700, color: "#1e293b" }}>
                            {token.patientId?.name}
                          </p>
                          <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                            {token.patientId?.age} yrs ·{" "}
                            {token.patientId?.gender}
                          </p>
                        </td>
                        <td style={{ padding: "12px 18px", color: "#475569" }}>
                          {token.doctorId?.fullname}
                        </td>
                        <td style={{ padding: "12px 18px" }}>
                          <span
                            style={{
                              padding: "3px 10px",
                              borderRadius: 999,
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              background: sc.bg,
                              color: sc.color,
                              border: `1px solid ${sc.border}`,
                            }}
                          >
                            {token.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 18px" }}>
                          <div
                            style={{
                              display: "flex",
                              gap: 6,
                              flexWrap: "wrap",
                            }}
                          >
                            {token.status === "Waiting" && (
                              <button
                                onClick={() =>
                                  handleStatus(token._id, "Serving")
                                }
                                style={{
                                  padding: "4px 9px",
                                  borderRadius: 7,
                                  border: "1px solid #bfdbfe",
                                  background: "#eff6ff",
                                  color: "#2563eb",
                                  fontSize: "0.7rem",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  fontFamily: "inherit",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <UserCheck size={11} /> Serve
                              </button>
                            )}
                            {token.status === "Serving" && (
                              <button
                                onClick={() =>
                                  handleStatus(token._id, "Completed")
                                }
                                style={{
                                  padding: "4px 9px",
                                  borderRadius: 7,
                                  border: "1px solid #a7f3d0",
                                  background: "#ecfdf5",
                                  color: "#059669",
                                  fontSize: "0.7rem",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  fontFamily: "inherit",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <CheckCircle2 size={11} /> Done
                              </button>
                            )}
                            {["Waiting", "Serving"].includes(token.status) && (
                              <button
                                onClick={() =>
                                  handleStatus(token._id, "Cancelled")
                                }
                                style={{
                                  padding: "4px 9px",
                                  borderRadius: 7,
                                  border: "1px solid #fecaca",
                                  background: "#fef2f2",
                                  color: "#dc2626",
                                  fontSize: "0.7rem",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  fontFamily: "inherit",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <XCircle size={11} /> Cancel
                              </button>
                            )}
                            <button
                              onClick={() => handlePrint(token)}
                              style={{
                                padding: "4px 9px",
                                borderRadius: 7,
                                border: "1px solid #e2e8f0",
                                background: "#f8fafc",
                                color: "#64748b",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: "inherit",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <Printer size={11} /> Slip
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TokenQueue;
