import { useState } from "react";
import { useGetStatsQuery } from "../store/analyticsApiSlice";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Users, Calendar, FileText, Activity, TrendingUp, Clock,
  MoreVertical, CheckCircle, XCircle, Edit3, Ban, Zap,
  DollarSign, Stethoscope, ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie,
} from "recharts";

// ─── Static Demo Data ─────────────────────────────────────────────────────────

const MONTHLY_DATA = [
  { month: "Aug", appointments: 120, revenue: 4200 },
  { month: "Sep", appointments: 145, revenue: 5100 },
  { month: "Oct", appointments: 132, revenue: 4800 },
  { month: "Nov", appointments: 168, revenue: 6200 },
  { month: "Dec", appointments: 155, revenue: 5700 },
  { month: "Jan", appointments: 189, revenue: 7100 },
  { month: "Feb", appointments: 210, revenue: 8400 },
];

const DOCTORS = [
  { name: "Dr. Sarah Jenkins", spec: "Cardiologist",   status: "Online",  patients: 48 },
  { name: "Dr. Michael Chang", spec: "Neurologist",    status: "Online",  patients: 35 },
  { name: "Dr. Ayesha Raza",   spec: "Dermatologist",  status: "Offline", patients: 62 },
  { name: "Dr. Bilal Hassan",  spec: "Orthopedic",     status: "Online",  patients: 29 },
  { name: "Dr. Fatima Noor",   spec: "Pediatrician",   status: "Offline", patients: 41 },
];

const DONUT_DATA = [
  { name: "Completed", value: 65, color: "#10b981" },
  { name: "Scheduled", value: 25, color: "#3b82f6" },
  { name: "Cancelled",  value: 10, color: "#ef4444" },
];

const SCHEDULE = [
  { patient: "Ayesha Khan",  time: "09:00 AM", type: "Follow-up",    status: "Completed"   },
  { patient: "Bilal Ahmed",  time: "10:30 AM", type: "Consultation", status: "In Progress" },
  { patient: "Sara Malik",   time: "11:00 AM", type: "Check-up",     status: "Scheduled"   },
  { patient: "Usman Ali",    time: "02:00 PM", type: "Diagnosis",    status: "Scheduled"   },
  { patient: "Fatima Noor",  time: "03:30 PM", type: "Follow-up",    status: "Scheduled"   },
];

const STATUS_COLOR = {
  Completed:     { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0" },
  "In Progress": { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Scheduled:     { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
};

// ─── Animation Variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
  }),
};

// ─── Tooltip ─────────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: "#1e293b", color: "#fff", padding: "10px 16px", borderRadius: 10, fontSize: 12, boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}>
        <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || "#5eead4" }}>{p.name}: {p.name === "revenue" ? `$${p.value}` : p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Main Component ────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const { data: stats, isLoading } = useGetStatsQuery();
  const { user } = useSelector((state) => state.auth);
  const [openMenu, setOpenMenu] = useState(null);
  const [isPro, setIsPro] = useState(false);

  const handleDoctorAction = (action, docName) => {
    setOpenMenu(null);
    if (action === "edit") toast.success(`Editing Dr. ${docName}'s profile`);
    if (action === "suspend") toast.error(`Dr. ${docName} has been suspended`);
  };

  const togglePlan = () => {
    setIsPro((p) => {
      const next = !p;
      toast.success(next ? "🚀 Upgraded to Pro Plan!" : "Plan downgraded to Free");
      return next;
    });
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", border: "3px solid #e2e8f0", borderTopColor: "#0d9488", animation: "spin 0.9s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", paddingBottom: 48 }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
          Admin Dashboard
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
          Welcome back, <span style={{ fontWeight: 700, color: "#0d9488" }}>{user?.fullname || "Super Admin"}</span> — here's your clinic overview
        </p>
      </motion.div>

      {/* ── Stat Cards (Glassmorphism) ────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { i: 0, title: "Total Doctors",    value: stats?.totalDoctors ?? 5,    icon: <Stethoscope size={22} color="#fff" />, color: "#0d9488", bg: "#0d9488", trend: "+2 new onboarding", hasBtn: true },
          { i: 1, title: "Active Clinics",   value: stats?.activeClinics ?? 3,   icon: <Users size={22} color="#fff" />,       color: "#6366f1", bg: "#6366f1", trend: "2 branches live" },
          { i: 2, title: "Monthly Revenue",  value: "$8,400",                    icon: <DollarSign size={22} color="#fff" />,  color: "#10b981", bg: "#10b981", trend: "+18% this month", trendUp: true },
          { i: 3, title: "AI Diagnoses",     value: stats?.totalDiagnoses ?? 89, icon: <Zap size={22} color="#fff" />,         color: "#f59e0b", bg: "#f59e0b", trend: "+23% accuracy", trendUp: true },
        ].map(({ i, title, value, icon, color, bg, trend, trendUp, hasBtn }) => (
          <motion.div key={i} custom={i} initial="hidden" animate="visible" variants={fadeUp}
            style={{
              background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.9)", borderRadius: 18,
              padding: "18px 20px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${bg}55` }}>
                {icon}
              </div>
              {hasBtn && (
                <button onClick={() => toast.success("Doctor management opened")}
                  style={{ fontSize: "0.7rem", fontWeight: 700, padding: "4px 10px", borderRadius: 8, border: `1px solid ${color}`, color, background: "transparent", cursor: "pointer" }}>
                  Manage
                </button>
              )}
            </div>
            <div>
              <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>{title}</p>
              <h4 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", lineHeight: 1, marginBottom: 4 }}>{typeof value === "number" ? value.toLocaleString() : value}</h4>
              <p style={{ fontSize: "0.72rem", fontWeight: 600, color: trendUp ? "#10b981" : "#94a3b8" }}>
                {trendUp ? "↑ " : ""}{trend}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Area Chart + Donut ───────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>

        {/* Area Chart – Monthly Appointments vs Revenue */}
        <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}
          style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 18, padding: "20px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1e293b", display: "flex", alignItems: "center", gap: 6 }}>
                <TrendingUp size={16} color="#0d9488" /> Monthly Appointments vs Revenue
              </p>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 2 }}>Last 7 months performance</p>
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: "0.72rem", fontWeight: 600 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: "#0d9488", display: "inline-block" }} /> Appointments</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: "#6366f1", display: "inline-block" }} /> Revenue</span>
            </div>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_DATA} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="appointments" name="appointments" stroke="#0d9488" strokeWidth={2.5} fill="url(#colorAppts)" dot={false} />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#colorRev)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Donut Chart */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}
          style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 18, padding: "20px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column" }}>
          <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1e293b", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Clock size={15} color="#94a3b8" /> Appointment Status
          </p>
          <div style={{ display: "flex", justifyContent: "center", flex: 1, alignItems: "center" }}>
            <PieChart width={160} height={160}>
              <Pie data={DONUT_DATA} cx={75} cy={75} innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {DONUT_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
            </PieChart>
          </div>
          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
            {DONUT_DATA.map((d) => (
              <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: "0.78rem", color: "#475569", fontWeight: 500 }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: d.color, flexShrink: 0, display: "inline-block" }} />{d.name}
                </span>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1e293b" }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Doctor Management Table ───────────────────────────────────── */}
      <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}
        style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: 20 }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1e293b" }}>👨‍⚕️ Doctor Management</span>
          <button
            onClick={() => toast.success("New Doctor Added! 🎉")}
            style={{ fontSize: "0.78rem", fontWeight: 700, padding: "6px 14px", borderRadius: 10, border: "none", background: "#0d9488", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            + Add Doctor
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["NAME & SPECIALIZATION", "STATUS", "PATIENTS", "ACTIONS"].map((h) => (
                  <th key={h} style={{ padding: "10px 24px", textAlign: "left", fontSize: "0.68rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.07em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DOCTORS.map((doc, i) => (
                <tr key={i} style={{ borderTop: "1px solid #f8fafc", position: "relative" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc55"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 24px" }}>
                    <p style={{ fontWeight: 700, color: "#1e293b", marginBottom: 2 }}>{doc.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{doc.spec}</p>
                  </td>
                  <td style={{ padding: "12px 24px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "3px 10px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 700,
                      background: doc.status === "Online" ? "#ecfdf5" : "#f8fafc",
                      color: doc.status === "Online" ? "#059669" : "#94a3b8",
                      border: `1px solid ${doc.status === "Online" ? "#a7f3d0" : "#e2e8f0"}`,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: doc.status === "Online" ? "#10b981" : "#cbd5e1", display: "inline-block" }} />
                      {doc.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 24px", fontWeight: 600, color: "#475569" }}>{doc.patients}</td>
                  <td style={{ padding: "12px 24px", position: "relative" }}>
                    <button onClick={() => setOpenMenu(openMenu === i ? null : i)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center" }}>
                      <MoreVertical size={18} />
                    </button>
                    {openMenu === i && (
                      <div style={{ position: "absolute", right: 40, top: 8, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 50, minWidth: 140, overflow: "hidden" }}>
                        <button onClick={() => handleDoctorAction("edit", doc.name.split(".")[1]?.trim())}
                          style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 14px", border: "none", background: "none", cursor: "pointer", fontSize: "0.82rem", color: "#1e293b", fontWeight: 600 }}>
                          <Edit3 size={14} color="#0d9488" /> Edit Profile
                        </button>
                        <button onClick={() => handleDoctorAction("suspend", doc.name.split(".")[1]?.trim())}
                          style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 14px", border: "none", background: "none", cursor: "pointer", fontSize: "0.82rem", color: "#ef4444", fontWeight: 600 }}>
                          <Ban size={14} color="#ef4444" /> Suspend
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Bottom Row: Schedule + SaaS Panel ───────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Today's Schedule */}
        <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}
          style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", fontWeight: 700, fontSize: "0.9rem", color: "#1e293b" }}>
            📅 Today's Schedule
          </div>
          <div style={{ padding: "0 8px 8px" }}>
            {SCHEDULE.map((row, i) => {
              const sc = STATUS_COLOR[row.status];
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderBottom: i < SCHEDULE.length - 1 ? "1px solid #f8fafc" : "none" }}>
                  <div>
                    <p style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.82rem" }}>{row.patient}</p>
                    <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{row.time} • {row.type}</p>
                  </div>
                  <span style={{ padding: "3px 9px", borderRadius: 999, fontSize: "0.68rem", fontWeight: 700, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                    {row.status}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* SaaS Subscription Panel */}
        <motion.div custom={8} initial="hidden" animate="visible" variants={fadeUp}
          style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 18, padding: "20px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1e293b" }}>💎 SaaS Subscription</p>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: isPro ? "#6366f1" : "#f1f5f9", color: isPro ? "#fff" : "#64748b", border: isPro ? "none" : "1px solid #e2e8f0" }}>
              {isPro ? "PRO PLAN" : "FREE PLAN"}
            </span>
          </div>

          {[
            { label: "Doctors Slots",    used: isPro ? 5 : 5, max: isPro ? 50 : 5,   color: "#0d9488" },
            { label: "AI Diagnoses",     used: isPro ? 89 : 10, max: isPro ? 500 : 10, color: "#6366f1" },
            { label: "Storage Used",     used: isPro ? 12 : 1, max: isPro ? 100 : 2,   color: "#f59e0b" },
            { label: "Active Patients",  used: isPro ? 1248 : 50, max: isPro ? 10000 : 50, color: "#10b981" },
          ].map(({ label, used, max, color }) => {
            const pct = Math.min((used / max) * 100, 100);
            return (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569" }}>{label}</span>
                  <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{used.toLocaleString()} / {max.toLocaleString()}</span>
                </div>
                <div style={{ height: 6, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct >= 100 ? "#ef4444" : color, borderRadius: 999, transition: "width 0.5s ease" }} />
                </div>
              </div>
            );
          })}

          <button onClick={togglePlan}
            style={{
              width: "100%", marginTop: 4, padding: "10px", borderRadius: 12, border: "none",
              background: isPro ? "#f1f5f9" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: isPro ? "#64748b" : "#fff", fontWeight: 700, fontSize: "0.875rem",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontFamily: "inherit", boxShadow: isPro ? "none" : "0 4px 14px rgba(99,102,241,0.3)",
              transition: "all 0.2s ease",
            }}>
            {isPro ? "⬇️ Downgrade to Free" : "🚀 Upgrade to Pro"}
          </button>
        </motion.div>
      </div>

    </div>
  );
};

export default AdminDashboard;
