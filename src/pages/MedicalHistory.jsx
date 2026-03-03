import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  Activity,
  Search,
  Filter,
  ArrowUpRight,
  Download,
  Stethoscope,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import { useGetMedicalHistoryQuery } from "../store/patientApiSlice";

const MedicalHistory = () => {
  const { data, isLoading, isError } = useGetMedicalHistoryQuery();
  const [expanded, setExpanded] = useState({});
  const [filter, setFilter] = useState("all"); // all, appointment, prescription

  const timeline = data?.timeline || [];
  const filteredTimeline = timeline.filter(
    (item) => filter === "all" || item.type === filter,
  );

  const toggle = (idx) => setExpanded((p) => ({ ...p, [idx]: !p[idx] }));

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
    borderRadius: "28px",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
  };

  const statusColors = {
    Scheduled: { text: "#0ea5e9", bg: "#e0f2fe" },
    Completed: { text: "#10b981", bg: "#d1fae5" },
    Cancelled: { text: "#ef4444", bg: "#fee2e2" },
  };

  const EventCard = ({ item, idx }) => {
    const isAppt = item.type === "appointment";
    const isExp = expanded[idx];
    const sc = statusColors[item.data?.status] || statusColors.Scheduled;

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.05 }}
        className="flex gap-6 items-start relative pb-12 last:pb-0"
      >
        {/* Timeline Line */}
        {idx < filteredTimeline.length - 1 && (
          <div className="absolute left-[27px] top-[60px] bottom-0 w-0.5 bg-slate-200/60" />
        )}

        {/* Timeline Connector Dot */}
        <div className="relative z-10 shrink-0">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white transform transition-transform group-hover:scale-110 ${
              isAppt
                ? "bg-gradient-to-br from-teal-400 to-emerald-600"
                : "bg-gradient-to-br from-blue-400 to-indigo-600"
            }`}
          >
            {isAppt ? (
              <Calendar size={20} className="text-white" />
            ) : (
              <FileText size={20} className="text-white" />
            )}
          </div>
        </div>

        {/* Record Card */}
        <div
          onClick={() => toggle(idx)}
          style={cardStyle}
          className={`flex-1 p-6 cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/5 ${isExp ? "border-teal-500/30 bg-white" : ""}`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                {isAppt && (
                  <span
                    style={{ color: sc.text, background: sc.bg }}
                    className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md"
                  >
                    {item.data?.status}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 group-hover:text-teal-600 transition-colors">
                {isAppt
                  ? `Dr. ${item.data?.doctorId?.fullname}`
                  : `Prescription: Dr. ${item.data?.doctorId?.fullname}`}
              </h3>
              <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest italic">
                <span className="flex items-center gap-1.5">
                  <Stethoscope size={12} />{" "}
                  {item.data?.doctorId?.specialization || "General"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />{" "}
                  {new Date(item.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                {isExp ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isExp && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        Detailed Context
                      </p>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        {isAppt
                          ? item.data?.reason || "No specific reason logged."
                          : item.data?.instructions ||
                            "Take as directed by your physician."}
                      </p>
                    </div>
                    {isAppt && item.data?.doctorId?.department && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-xl w-fit">
                        <Sparkles size={14} className="text-teal-600" />
                        <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">
                          {item.data.doctorId.department} Department
                        </span>
                      </div>
                    )}
                  </div>

                  {!isAppt && (
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Medical Directive
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {item.data?.medicines?.map((m, i) => (
                          <div
                            key={i}
                            className="flex flex-col p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-teal-200 transition-colors"
                          >
                            <span className="text-sm font-black text-slate-800">
                              {m.name}
                            </span>
                            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mt-0.5">
                              {m.dosage}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button className="flex items-center gap-2 text-teal-600 font-black text-[10px] uppercase tracking-[0.2em] hover:underline mt-4">
                        <Download size={14} /> Download PDF Record
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-['Outfit'] text-slate-900 relative">
      {/* Background Decor */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-200/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-100/30 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-teal-600 font-bold tracking-widest uppercase text-xs mb-1">
              <ClipboardList size={14} />
              Health Repository
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Medical{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
                History
              </span>
            </h1>
            <p className="text-slate-500 font-medium">
              A unified chronological record of your clinic interventions.
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
            {[
              { id: "all", label: "All Events" },
              { id: "appointment", label: "Sessions" },
              { id: "prescription", label: "Meds" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === btn.id
                    ? "bg-white text-teal-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </motion.div>

        {isLoading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto border border-teal-100 animate-pulse">
              <Activity size={24} className="text-teal-400" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              Assembling Timeline...
            </p>
          </div>
        ) : isError ? (
          <div style={cardStyle} className="p-12 text-center border-rose-100">
            <AlertCircle size={40} className="text-rose-400 mx-auto mb-4" />
            <p className="text-rose-600 font-bold tracking-tight text-lg">
              Failed to retrieve medical records.
            </p>
          </div>
        ) : filteredTimeline.length === 0 ? (
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            style={cardStyle}
            className="p-20 text-center border-dashed border-2 bg-slate-50/50"
          >
            <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 grayscale opacity-50">
              <Bookmark size={32} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">
              No Records Found
            </h3>
            <p className="text-slate-400 font-medium italic">
              Your health journey starts with your first appointment.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-0">
            {filteredTimeline.map((item, idx) => (
              <EventCard key={idx} item={item} idx={idx} />
            ))}
          </div>
        )}

        {/* Floating Stat summary */}
        {filteredTimeline.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-20 p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-t-2 border-slate-100 grayscale hover:grayscale-0 transition-all opacity-40 hover:opacity-100"
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-teal-500" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                End-to-End Encrypted Logs • HIPAA Compliant
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs font-black text-slate-800">
                  {timeline.filter((i) => i.type === "appointment").length}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Total Visits
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-black text-slate-800">
                  {timeline.filter((i) => i.type === "prescription").length}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Prescriptions
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Generic bookmark icon
const Bookmark = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);

export default MedicalHistory;
