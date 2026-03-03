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
  Star,
  ShieldCheck,
  AlertCircle,
  Hash,
  Bell,
  Stethoscope,
  Brain,
  Ticket,
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
  const past = appointments.filter((a) => a.status === "Completed");

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
    borderRadius: "28px",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
  };

  const statusColors = {
    Scheduled: { text: "#0ea5e9", bg: "#e0f2fe", icon: <Clock size={12} /> },
    Completed: {
      text: "#10b981",
      bg: "#d1fae5",
      icon: <ShieldCheck size={12} />,
    },
    Cancelled: {
      text: "#ef4444",
      bg: "#fee2e2",
      icon: <AlertCircle size={12} />,
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-['Outfit'] text-slate-900">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-200/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-100/30 blur-[100px] rounded-full pointer-events-none" />

      {/* Hero Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-teal-600 font-bold tracking-widest uppercase text-xs">
            <Activity size={14} className="animate-pulse" />
            Patient Health Dashboard
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            {greeting},{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
              {user?.fullname?.split(" ")[0]}
            </span>
            ! 👋
          </h1>
          <p className="text-slate-500 font-medium">
            Stay on top of your health journey with real-time updates.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
              Current Date
            </p>
            <p className="text-sm font-bold text-slate-800">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center relative cursor-pointer group"
          >
            <Bell
              size={24}
              className="text-slate-600 border-slate-600 group-hover:text-teal-600 transition-colors"
            />
            <div className="absolute top-3.5 right-4 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
          </motion.div>
        </div>
      </motion.div>

      {/* Key Stats Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 relative z-10"
      >
        {[
          {
            label: "Blood Group",
            value: user?.bloodGroup || "A+",
            icon: <Droplets className="text-rose-500" />,
            sub: "Normal Range",
          },
          {
            label: "Avg Heart Rate",
            value: "72 bpm",
            icon: <Heart className="text-pink-500" />,
            sub: "Healthy",
          },
          {
            label: "Body Temp",
            value: "36.6°C",
            icon: <Thermometer className="text-amber-500" />,
            sub: "In Range",
          },
          {
            label: "Total Energy",
            value: "94%",
            icon: <Zap className="text-yellow-500" />,
            sub: "Excellent",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.06)" }}
            style={cardStyle}
            className="p-6 relative overflow-hidden group transition-all duration-300"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              {stat.icon}
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl">{stat.icon}</div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-slate-800">
                  {stat.value}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
              <Star size={10} fill="currentColor" /> {stat.sub}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Grid: Schedule & Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        {/* Left Column: Schedule Timeline (Span 8) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={cardStyle}
          className="lg:col-span-8 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Upcoming Schedule
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Your medical interventions for the coming days.
              </p>
            </div>
            <Link
              to="/patient/my-appointments"
              className="flex items-center gap-2 text-teal-600 font-bold text-sm bg-teal-50 px-4 py-2 rounded-xl border border-teal-100/50 hover:bg-teal-100 transition-colors group"
            >
              Manage All{" "}
              <ArrowUpRight
                size={16}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </Link>
          </div>

          <div className="space-y-6 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
            {apptLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-slate-100 rounded-2xl mx-12"
                  />
                ))}
              </div>
            ) : upcoming.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-100">
                  <Calendar size={32} className="text-teal-400" />
                </div>
                <h3 className="text-lg font-black text-slate-800">
                  Clear Skies!
                </h3>
                <p className="text-slate-400 text-sm font-medium mb-6">
                  No upcoming medical appointments found.
                </p>
                <Link
                  to="/patient/book"
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-500/20 hover:scale-105 transition-transform inline-flex items-center gap-2"
                >
                  <Plus size={16} /> Book New Session
                </Link>
              </div>
            ) : (
              upcoming.slice(0, 4).map((appt, i) => (
                <motion.div
                  key={appt._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-14 group"
                >
                  <div className="absolute left-4 top-1.5 w-4 h-4 rounded-full bg-white border-4 border-teal-500 group-hover:scale-125 transition-transform z-10" />
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-100 bg-white/50 rounded-3xl transition-all duration-300 hover:border-teal-200 hover:bg-white hover:shadow-xl hover:shadow-teal-500/5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-inner">
                        <Stethoscope size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 group-hover:text-teal-600 transition-colors uppercase tracking-tight">
                          Dr. {appt.doctorId?.fullname || "Specialist Visit"}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                            {appt.doctorId?.specialization ||
                              "General Medicine"}
                          </p>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-400 text-xs font-bold">
                            {new Date(appt.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 self-end md:self-center">
                      <div
                        style={{
                          color: statusColors[appt.status]?.text || "#64748b",
                          background:
                            statusColors[appt.status]?.bg || "#f1f5f9",
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm"
                      >
                        {statusColors[appt.status]?.icon} {appt.status}
                      </div>
                      <Link
                        to={`/patient/my-appointments`}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:bg-teal-600 hover:text-white rounded-xl transition-all"
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Right Column (Span 4) */}
        <div className="lg:col-span-4 space-y-10">
          {/* Live Queue Pulse Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              ...cardStyle,
              background: "linear-gradient(135deg, #0f172a, #1e293b)",
              color: "#fff",
            }}
            className="p-8 relative overflow-hidden group shadow-2xl shadow-slate-900/40"
          >
            <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-teal-500/20 blur-[50px] rounded-full" />

            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight text-white uppercase italic tracking-widest">
                  LIVE QUEUE
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                  <p className="text-slate-400 text-[10px] font-bold uppercase">
                    Real-time update
                  </p>
                </div>
              </div>
              <Ticket size={24} className="text-teal-400 opacity-50" />
            </div>

            {!queueData?.hasToken ? (
              <div className="py-6 text-center border border-white/5 rounded-[24px] bg-white/5">
                <Hash size={32} className="mx-auto mb-3 text-white/50" />
                <p className="text-sm font-bold text-slate-300">
                  No active token today.
                </p>
                <Link
                  to="/patient/book"
                  className="text-xs text-teal-400 font-black mt-2 inline-block uppercase tracking-wider hover:underline"
                >
                  Book Session Now
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-[24px]">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 tracking-widest mb-1 uppercase">
                      Your Token
                    </p>
                    <div className="text-4xl font-black text-white tracking-tighter">
                      #{queueData.tokenNumber || "—"}
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg border border-white/10">
                    {queueData.queueStats?.totalInQueue || 0}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-[20px] text-center">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Queue Ahead
                    </p>
                    <p className="text-xl font-black text-teal-400">
                      {queueData.queueStats?.waiting || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-[20px] text-center">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Est. Wait
                    </p>
                    <p className="text-xl font-black text-slate-200">
                      {queueData.queueStats?.estimatedWaitMins || 0}m
                    </p>
                  </div>
                </div>

                <Link
                  to="/patient/my-queue"
                  className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-[20px] font-black text-xs uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 group"
                >
                  Enter Live Queue{" "}
                  <ChevronRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            )}
          </motion.div>

          {/* Quick Tasks Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={cardStyle}
            className="p-8 border-t-4 border-t-teal-500"
          >
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2 tracking-tighter">
              Quick Actions <Plus size={20} className="text-teal-500" />
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  to: "/patient/book",
                  label: "Book Dr.",
                  icon: <Calendar size={18} />,
                  bg: "bg-teal-50 text-teal-600",
                },
                {
                  to: "/prescriptions",
                  label: "My Meds",
                  icon: <FileText size={18} />,
                  bg: "bg-blue-50 text-blue-600",
                },
                {
                  to: "/medical-history",
                  label: "Vital Logs",
                  icon: <ClipboardList size={18} />,
                  bg: "bg-rose-50 text-rose-600",
                },
                {
                  to: "/smart-diagnosis",
                  label: "AI Check",
                  icon: <Brain size={18} />,
                  bg: "bg-purple-50 text-purple-600",
                },
              ].map((act, i) => (
                <Link
                  key={i}
                  to={act.to}
                  className="flex flex-col items-center gap-3 p-5 rounded-[24px] border border-slate-100 hover:border-teal-400/30 hover:bg-white hover:shadow-lg transition-all"
                >
                  <div className={`p-3 rounded-2xl ${act.bg} shadow-sm`}>
                    {act.icon}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-tight text-slate-700">
                    {act.label}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Prescriptions Banner */}
      <AnimatePresence>
        {prescriptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            style={cardStyle}
            className="mt-12 p-8 border-l-8 border-l-emerald-500 shadow-xl overflow-hidden group relative"
          >
            <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-emerald-500/5 blur-[80px] rounded-full" />

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shrink-0 border border-emerald-100 group-hover:rotate-12 transition-transform">
                <FileText size={32} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">
                  Latest Medical Record
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Dr. {prescriptions[0].doctorId?.fullname || "—"} issued a new
                  prescription
                </h3>
                <p className="text-slate-500 font-medium mt-1">
                  Includes {prescriptions[0].medicines?.length || 0} medications
                  with detailed AI explanations.
                </p>
              </div>
              <Link
                to={`/prescriptions/${prescriptions[0]._id}`}
                className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-teal-600 transition-all flex items-center gap-3 shadow-lg group"
              >
                View Details{" "}
                <ArrowUpRight
                  size={18}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Health Footer */}
      <footer className="mt-20 pt-10 border-t border-slate-200 flex flex-col items-center gap-6 pb-12">
        <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">
          Powered by Gemini AI • End-to-End Encrypted Health Records
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all">
            <ShieldCheck size={20} />
            <span className="text-[10px] font-black uppercase">
              HIPAA Compliant
            </span>
          </div>
          <div className="flex items-center gap-2 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all">
            <Star size={20} />
            <span className="text-[10px] font-black uppercase">
              Premium Care
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PatientDashboard;
