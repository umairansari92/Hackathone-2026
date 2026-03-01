import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Search,
  Ticket,
  AlertCircle,
  CheckCircle2,
  User,
  CalendarCheck,
} from "lucide-react";
import { useGetAllSchedulesQuery } from "../store/scheduleApiSlice";
import { useGenerateTokenMutation } from "../store/tokenApiSlice";
import { useGetPatientsQuery } from "../store/patientApiSlice";

const BookAppointment = () => {
  const { data: schedules = [] } = useGetAllSchedulesQuery();
  const { data: patients = [] } = useGetPatientsQuery();
  const [generateToken, { isLoading: generating }] = useGenerateTokenMutation();

  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [generatedToken, setGeneratedToken] = useState(null);

  const filteredPatients = patients.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.contact?.includes(search),
  );

  // Check doctor availability for selected date
  const selectedSchedule = schedules.find(
    (s) => (s.doctorId?._id || s.doctorId) === selectedDoctor,
  );
  const checkDate = new Date(selectedDate);
  const dayName = checkDate.toLocaleDateString("en-US", { weekday: "long" });
  const doctorWorksToday = selectedSchedule
    ? selectedSchedule.workingDays?.includes(dayName)
    : true;
  const today = new Date().toISOString().split("T")[0];
  const doctorOnLeave =
    selectedSchedule?.leaveDates?.some(
      (d) => new Date(d).toISOString().split("T")[0] === selectedDate,
    ) ||
    (selectedSchedule?.isOnLeave &&
      selectedSchedule?.leaveDate &&
      new Date(selectedSchedule.leaveDate).toISOString().split("T")[0] ===
        selectedDate);

  const canBook =
    selectedPatient && selectedDoctor && doctorWorksToday && !doctorOnLeave;

  const handleGenerate = async () => {
    if (!canBook) return;
    try {
      const result = await generateToken({
        patientId: selectedPatient._id,
        doctorId: selectedDoctor,
        date: selectedDate,
      }).unwrap();
      setGeneratedToken(result);
      toast.success(
        `🎫 Token #${result.tokenNumber} generated for ${selectedPatient.name}!`,
      );
    } catch (err) {
      toast.error(err?.data?.message || "Token generation failed");
    }
  };

  const handlePrint = () => {
    if (!generatedToken) return;
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
          <div class="token">#${generatedToken.tokenNumber}</div>
          <div class="row"><span class="label">Patient</span><span>${generatedToken.patientId?.name}</span></div>
          <div class="row"><span class="label">Doctor</span><span>${generatedToken.doctorId?.fullname}</span></div>
          <div class="row"><span class="label">Date</span><span>${generatedToken.date}</span></div>
          <div class="row"><span class="label">Time</span><span>${selectedSchedule?.startTime || "—"} – ${selectedSchedule?.endTime || "—"}</span></div>
          <div class="row"><span class="label">Status</span><span>${generatedToken.status}</span></div>
          <div class="footer">Please wait at the reception. Your token will be called in order.<br/>Thank you for choosing Al Shifa Hospital.</div>
        </div>
        <script>window.onload = () => { window.print(); window.close(); }</script>
      </body></html>
    `);
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", paddingBottom: 48 }}>
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
          Book Appointment & Generate Token
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
          Search a patient, select doctor & date, then generate their token
          automatically
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Left: Patient Search */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.9)",
            borderRadius: 18,
            padding: 22,
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              color: "#1e293b",
              fontSize: "0.9rem",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <User size={16} color="#0d9488" /> Select Patient
          </h3>
          <div style={{ position: "relative", marginBottom: 14 }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or contact..."
              style={{
                width: "100%",
                paddingLeft: 36,
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

          <div
            style={{
              maxHeight: 260,
              overflowY: "auto",
              borderRadius: 10,
              border: "1px solid #e2e8f0",
            }}
          >
            {filteredPatients.length === 0 && (
              <p
                style={{
                  padding: "16px",
                  textAlign: "center",
                  color: "#94a3b8",
                  fontSize: "0.85rem",
                }}
              >
                No patients found
              </p>
            )}
            {filteredPatients.map((p) => (
              <div
                key={p._id}
                onClick={() => setSelectedPatient(p)}
                style={{
                  padding: "10px 14px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f1f5f9",
                  background:
                    selectedPatient?._id === p._id ? "#f0fdfa" : "transparent",
                  borderLeft:
                    selectedPatient?._id === p._id
                      ? "3px solid #0d9488"
                      : "3px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    color: "#1e293b",
                    fontSize: "0.875rem",
                  }}
                >
                  {p.name}
                </p>
                <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                  {p.age} yrs · {p.gender} · {p.contact}
                </p>
              </div>
            ))}
          </div>

          {selectedPatient && (
            <div
              style={{
                marginTop: 10,
                padding: "10px 14px",
                background: "#f0fdfa",
                border: "1px solid #a7f3d0",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <CheckCircle2 size={16} color="#059669" />
              <span
                style={{
                  fontWeight: 700,
                  color: "#059669",
                  fontSize: "0.85rem",
                }}
              >
                Selected: {selectedPatient.name}
              </span>
            </div>
          )}
        </motion.div>

        {/* Right: Doctor + Date + Generate */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.9)",
            borderRadius: 18,
            padding: 22,
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              color: "#1e293b",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <CalendarCheck size={16} color="#0d9488" /> Doctor & Date
          </h3>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: 5,
              }}
            >
              Select Doctor
            </label>
            <select
              value={selectedDoctor}
              onChange={(e) => {
                setSelectedDoctor(e.target.value);
                setGeneratedToken(null);
              }}
              style={{
                width: "100%",
                padding: "9px 12px",
                border: "1.5px solid #e2e8f0",
                borderRadius: 10,
                fontSize: "0.875rem",
                fontFamily: "inherit",
                outline: "none",
                background: "#fff",
              }}
            >
              <option value="">— Choose Doctor —</option>
              {schedules.map((s) => (
                <option key={s.doctorId?._id} value={s.doctorId?._id}>
                  {s.doctorId?.fullname}{" "}
                  {s.doctorId?.specialization
                    ? `(${s.doctorId.specialization})`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#374151",
                marginBottom: 5,
              }}
            >
              Appointment Date
            </label>
            <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setGeneratedToken(null);
              }}
              style={{
                width: "100%",
                padding: "9px 12px",
                border: "1.5px solid #e2e8f0",
                borderRadius: 10,
                fontSize: "0.875rem",
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Availability Warning */}
          {selectedDoctor && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                background:
                  !doctorWorksToday || doctorOnLeave ? "#fef2f2" : "#ecfdf5",
                border: `1px solid ${!doctorWorksToday || doctorOnLeave ? "#fecaca" : "#a7f3d0"}`,
              }}
            >
              {!doctorWorksToday || doctorOnLeave ? (
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <AlertCircle size={15} color="#dc2626" />
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: "#dc2626",
                    }}
                  >
                    {doctorOnLeave
                      ? "Doctor is on leave this day"
                      : `Doctor doesn't work on ${dayName}`}
                  </span>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <CheckCircle2 size={15} color="#059669" />
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: "#059669",
                    }}
                  >
                    Doctor available · {selectedSchedule?.startTime} –{" "}
                    {selectedSchedule?.endTime}
                  </span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!canBook || generating}
            style={{
              padding: "11px",
              background: canBook
                ? "linear-gradient(135deg, #0d9488, #0ea5e9)"
                : "#e2e8f0",
              color: canBook ? "#fff" : "#94a3b8",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: canBook ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: canBook ? "0 4px 14px rgba(13,148,136,0.3)" : "none",
              marginTop: "auto",
            }}
          >
            <Ticket size={18} />{" "}
            {generating ? "Generating..." : "Generate Token"}
          </button>
        </motion.div>
      </div>

      {/* Generated Token Card */}
      {generatedToken && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            marginTop: 24,
            background: "linear-gradient(135deg, #0d9488, #0ea5e9)",
            borderRadius: 20,
            padding: 28,
            color: "#fff",
            boxShadow: "0 8px 30px rgba(13,148,136,0.3)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ fontSize: "0.8rem", opacity: 0.8, marginBottom: 6 }}>
              Token Generated Successfully!
            </p>
            <div style={{ fontSize: "5rem", fontWeight: 900, lineHeight: 1 }}>
              #{generatedToken.tokenNumber}
            </div>
            <p style={{ opacity: 0.9, marginTop: 8 }}>
              {generatedToken.patientId?.name} ·{" "}
              {generatedToken.doctorId?.fullname}
            </p>
            <p style={{ opacity: 0.75, fontSize: "0.8rem" }}>
              {generatedToken.date} · Status: {generatedToken.status}
            </p>
          </div>
          <button
            onClick={handlePrint}
            style={{
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              border: "1.5px solid rgba(255,255,255,0.4)",
              borderRadius: 12,
              padding: "10px 20px",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.875rem",
              fontFamily: "inherit",
            }}
          >
            🖨️ Print Slip
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default BookAppointment;
