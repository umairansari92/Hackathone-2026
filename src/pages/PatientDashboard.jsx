import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Calendar,
  FileText,
  Clock,
  Activity,
  ChevronRight,
  Plus,
  ArrowUpRight,
  ClipboardList,
  Heart,
  Droplets,
  Thermometer,
  Zap,
  Ticket,
  Brain,
  ShieldCheck,
} from "lucide-react";
import {
  useGetMyAppointmentsQuery,
  useGetMyQueueStatusQuery,
  useGetMyPrescriptionsQuery,
} from "../store/patientApiSlice";

const PatientDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: appointments = [], isLoading: apptLoading } =
    useGetMyAppointmentsQuery();
  const { data: prescriptions = [] } = useGetMyPrescriptionsQuery();
  const { data: queueData } = useGetMyQueueStatusQuery(undefined, {
    pollingInterval: 60000,
  });

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const upcoming = appointments.filter(
    (a) => a.status === "Scheduled" && new Date(a.date) >= new Date(),
  );

  // Design Tokens (Master System)
  const tokens = {
    colors: {
      bg: "#F5F7FA",
      master: "#FFFFFF",
      primary: "#0EA5A4",
      textNavy: "#0F172A",
      textSlate: "#64748B",
      border: "#E2E8F0",
      navyCard: "#0F172A",
    },
    spacing: {
      section: "32px",
      card: "24px",
      internal: "16px",
      element: "8px",
    },
    shadow:
      "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]",
    radius: "rounded-[16px]",
    hover: "transition-all duration-200 hover:-translate-y-[2px] ease-in-out",
  };

  const cardClass = `bg-white border border-[#E2E8F0] ${tokens.radius} ${tokens.shadow} p-6 ${tokens.hover}`;
  const labelClass =
    "text-[12px] uppercase tracking-widest text-[#64748B] font-bold mb-1";
  const btnPrimary =
    "h-[44px] flex items-center justify-center gap-2 px-6 bg-[#0EA5A4] text-white rounded-[12px] font-bold text-[14px] transition-colors hover:bg-[#0c8e8d] focus:ring-4 focus:ring-[#0EA5A4]/20 outline-none";

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center pt-10 pb-16 px-4 font-['Outfit']">
      {/* Master Container Card */}
      <div className="w-full max-w-[1240px] bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm p-8 flex flex-col gap-8">
        {/* Row 1: Greeting & Date */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-[32px] md:text-[36px] font-bold text-[#0F172A] leading-tight">
              {greeting}, {user?.fullname?.split(" ")[0]}
            </h1>
            <p className="text-[14px] text-[#64748B] font-medium">
              Your health overview is ready for review.
            </p>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-[12px] px-6 py-4 shadow-sm flex items-center gap-4">
            <Calendar size={20} className="text-[#0EA5A4] shrink-0" />
            <div className="flex flex-col gap-1">
              <p className={labelClass}>Today's Date</p>
              <p className="text-[14px] font-semibold text-[#0F172A]">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Row 2: Health Metrics (4 Equal Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Blood Group",
              val: user?.bloodGroup || "A+",
              icon: <Droplets size={20} />,
              status: "Healthy",
              color: "text-rose-500",
            },
            {
              label: "Heart Rate",
              val: "72 bpm",
              icon: <Heart size={20} />,
              status: "In Range",
              color: "text-pink-500",
            },
            {
              label: "Temperature",
              val: "36.6°C",
              icon: <Thermometer size={20} />,
              status: "Healthy",
              color: "text-amber-500",
            },
            {
              label: "Energy Level",
              val: "94%",
              icon: <Zap size={20} />,
              status: "Healthy",
              color: "text-teal-500",
            },
          ].map((m, i) => (
            <div
              key={i}
              className={`${cardClass} flex flex-col items-center text-center`}
            >
              <div
                className={`mb-3 w-12 h-12 ${m.color} flex items-center justify-center bg-slate-50 rounded-xl`}
              >
                {m.icon}
              </div>
              <p className={`${labelClass} text-center`}>{m.label}</p>
              <span className="text-[28px] font-bold text-[#0F172A] leading-none mt-1">
                {m.val}
              </span>
              <span
                className={`text-[10px] font-bold px-3 py-1 rounded-full mt-3 ${m.status === "Healthy" ? "bg-emerald-50 text-emerald-600" : "bg-teal-50 text-teal-600"}`}
              >
                {m.status}
              </span>
            </div>
          ))}
        </div>

        {/* Row 3: Schedule | Queue + Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Upcoming Schedule (8 Columns) */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-8 py-8 h-full">
              {/* Header Section */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-2">
                  <h3 className="text-[18px] md:text-[20px] font-bold text-[#0F172A]">
                    Upcoming Schedule
                  </h3>
                  <p className="text-[13px] text-[#64748B] font-medium">
                    Manage your medical sessions.
                  </p>
                </div>
                <Link
                  to="/patient/my-appointments"
                  className="text-[13px] font-bold text-[#0EA5A4] flex items-center gap-1 hover:underline shrink-0"
                >
                  View All <ChevronRight size={14} />
                </Link>
              </div>

              {/* Doctors List */}
              <div className="flex flex-col gap-0">
                {apptLoading ? (
                  <div className="py-10 text-center text-slate-400 font-medium">
                    Syncing profile...
                  </div>
                ) : upcoming.length === 0 ? (
                  <div className="py-12 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-[#F5F7FA] rounded-full flex items-center justify-center">
                      <Calendar size={28} className="text-slate-200" />
                    </div>
                    <p className="text-[14px] text-slate-500 font-medium max-w-[200px]">
                      No upcoming appointments found in your record.
                    </p>
                    <Link to="/patient/book" className={btnPrimary}>
                      Book Appointment
                    </Link>
                  </div>
                ) : (
                  upcoming.slice(0, 4).map((appt, i) => (
                    <div key={appt._id}>
                      <div className="flex items-center justify-between py-5 px-4 hover:bg-[#F5F7FA] rounded-lg transition-all duration-200">
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200 shrink-0 text-[14px]">
                            {appt.doctorId?.fullname?.charAt(0) || "D"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[14px] font-bold text-[#0F172A] truncate">
                              Dr. {appt.doctorId?.fullname || "Specialist"}
                            </p>
                            <p className="text-[12px] text-[#64748B] font-medium uppercase tracking-tight truncate mt-1">
                              {appt.doctorId?.specialization ||
                                "General Medicine"}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 text-right shrink-0 ml-4">
                          <p className="text-[13px] font-bold text-[#0F172A]">
                            {new Date(appt.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 uppercase tracking-wider">
                            {appt.status}
                          </span>
                        </div>
                      </div>
                      {i < Math.min(upcoming.length, 4) - 1 && (
                        <div className="h-px bg-[#E2E8F0]" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Queue + Actions (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Live Queue - Deep Navy Card */}
            <div className="bg-[#0F172A] rounded-[16px] p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[240px]">
              <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none">
                <Activity size={80} />
              </div>

              <div className="relative z-10 flex flex-col gap-8 h-full">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <p className="text-[12px] uppercase tracking-[0.2em] text-[#0EA5A4] font-black">
                      Live Queue
                    </p>
                    <p className="text-[11px] text-slate-500 font-bold">
                      Real-time update
                    </p>
                  </div>
                  <Ticket size={28} className="text-[#0EA5A4]/40" />
                </div>

                {!queueData?.hasToken ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
                    <p className="text-[15px] font-semibold text-slate-400">
                      No active token session.
                    </p>
                    <Link
                      to="/patient/book"
                      className="text-[#0EA5A4] text-[12px] font-black uppercase tracking-widest hover:text-[#22D3EE] transition-colors"
                    >
                      Book Now
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-8">
                    <div className="flex items-end justify-between border-b border-white/10 pb-6">
                      <div className="flex flex-col gap-2">
                        <p className="text-[11px] text-slate-500 uppercase tracking-widest font-black">
                          Your Token
                        </p>
                        <h2 className="text-[56px] font-black text-[#0EA5A4] leading-none tracking-tighter">
                          #{queueData.tokenNumber}
                        </h2>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] text-slate-500 uppercase tracking-widest font-black">
                          Est. Wait
                        </p>
                        <p className="text-[24px] font-black text-white">
                          {queueData.queueStats?.estimatedWaitMins || 0}m
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/patient/my-queue"
                      className={`${btnPrimary} w-full text-[12px] uppercase tracking-[0.1em]`}
                    >
                      Live Details
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions (2x2 Grid) */}
            <div className={`${cardClass} flex-1`}>
              <p className={labelClass}>Operational Actions</p>
              <div className="grid grid-cols-2 gap-4 mt-4 h-full">
                {[
                  {
                    to: "/patient/book",
                    label: "Book Dr.",
                    icon: <Calendar size={22} />,
                  },
                  {
                    to: "/prescriptions",
                    label: "My Meds",
                    icon: <FileText size={22} />,
                  },
                  {
                    to: "/medical-history",
                    label: "Vital Logs",
                    icon: <ClipboardList size={22} />,
                  },
                  {
                    to: "/smart-diagnosis",
                    label: "AI Check",
                    icon: <Brain size={22} />,
                  },
                ].map((act, i) => (
                  <Link
                    key={i}
                    to={act.to}
                    className="flex flex-col items-center justify-center gap-3 p-4 border border-[#E2E8F0] rounded-[16px] bg-[#F5F7FA]/30 hover:bg-[#0EA5A4]/5 hover:border-[#0EA5A4]/30 transition-all aspect-square text-center"
                  >
                    <div className="text-[#64748B] group-hover:text-[#0EA5A4]">
                      {act.icon}
                    </div>
                    <span className="text-[11px] font-bold text-[#64748B]">
                      {act.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 4: Medical Record Banner (Full Width) */}
        <AnimatePresence>
          {prescriptions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${cardClass} overflow-hidden`}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[#0EA5A4]/10 rounded-xl flex items-center justify-center text-[#0EA5A4] shrink-0">
                    <ClipboardList size={24} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[12px] uppercase tracking-[0.2em] text-[#0EA5A4] font-black">
                      Latest Medical Update
                    </p>
                    <h4 className="text-[18px] md:text-[20px] font-bold text-[#0F172A]">
                      New Prescription from Dr.{" "}
                      {prescriptions[0].doctorId?.fullname || "Specialist"}
                    </h4>
                    <p className="text-[14px] text-[#64748B] font-medium">
                      Record updated{" "}
                      {new Date(
                        prescriptions[0].createdAt,
                      ).toLocaleDateString()}{" "}
                      • {prescriptions[0].medicines?.length || 0} medications
                      prescribed.
                    </p>
                  </div>
                </div>
                <Link
                  to={`/prescriptions/${prescriptions[0]._id}`}
                  className={`${btnPrimary} shrink-0 uppercase tracking-widest`}
                >
                  Access Record
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Audit */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#E2E8F0] gap-4">
          <div className="flex items-center gap-6 opacity-30">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#0F172A]">
              <ShieldCheck size={14} /> HIPAA Secure
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#0F172A]">
              <Clock size={14} /> 24/7 Portal Access
            </div>
          </div>
          <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-400">
            Powered by MedClinic <span className="text-[#0EA5A4]">AI</span>{" "}
            Intelligent Engine
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
