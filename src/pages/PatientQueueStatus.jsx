import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetMyQueueStatusQuery } from "../store/patientApiSlice";
import {
  Clock,
  Users,
  Stethoscope,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Ticket,
  ChevronRight,
  User,
  Activity,
  Zap,
} from "lucide-react";

const PatientQueueStatus = () => {
  // Poll every 30 seconds for live updates
  const { data, isLoading, isError, refetch } = useGetMyQueueStatusQuery(
    undefined,
    {
      pollingInterval: 30000,
    },
  );

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
    borderRadius: "28px",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-['Outfit'] text-slate-900 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-200/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-100/30 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-teal-600 font-bold tracking-widest uppercase text-[10px]">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_#14b8a6]" />
              Live Pulse Monitoring
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Queue{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
                Live
              </span>
            </h1>
            <p className="text-slate-500 font-medium max-w-md">
              Track your clinical position and estimated visit time in
              real-time.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refetch}
            className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/80 shadow-sm font-black text-xs uppercase tracking-widest text-slate-600 hover:text-teal-600 transition-colors"
          >
            <RefreshCw
              size={16}
              className={`${isLoading ? "animate-spin" : ""}`}
            />
            Sync Status
          </motion.button>
        </motion.div>

        {isLoading ? (
          <div className="py-32 text-center space-y-4">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto border border-teal-100 animate-pulse">
              <Zap size={24} className="text-teal-400" />
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              Connecting to Server...
            </p>
          </div>
        ) : isError ? (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            style={cardStyle}
            className="p-12 text-center"
          >
            <AlertCircle size={48} className="text-rose-400 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-800 mb-2">
              Sync Synchronization Failed
            </h3>
            <p className="text-slate-500 mb-8">
              We couldn't retrieve the latest queue metrics. Please check your
              connection.
            </p>
            <button
              onClick={refetch}
              className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm"
            >
              Retry Sync
            </button>
          </motion.div>
        ) : !data?.hasToken ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={cardStyle}
            className="p-16 text-center border-dashed border-2 border-slate-200 bg-slate-50/50"
          >
            <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
              <Ticket size={32} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">
              No Active Token
            </h3>
            <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto italic">
              Your medical queue position will appear here once you have an
              appointment scheduled for today.
            </p>
            <button
              onClick={() => (window.location.href = "/patient/book")}
              className="px-10 py-4 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20 hover:scale-105 transition-transform"
            >
              Book Session
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {/* Main Token Hub */}
            <motion.div
              variants={itemVariants}
              style={{
                ...cardStyle,
                background: "linear-gradient(135deg, #0f172a, #1e293b)",
                color: "#fff",
                border: "none",
              }}
              className="p-10 relative overflow-hidden shadow-2xl shadow-slate-900/40"
            >
              <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-teal-500/10 blur-[100px] rounded-full" />
              <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-emerald-500/10 blur-[80px] rounded-full" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
                      <Stethoscope size={28} className="text-teal-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                        Assigned Specialist
                      </p>
                      <h3 className="text-2xl font-black text-white italic">
                        Dr. {data.doctor?.fullname}
                      </h3>
                      <p className="text-xs font-bold text-teal-400/80 uppercase tracking-widest">
                        {data.doctor?.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Session Intent
                    </p>
                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-sm font-medium text-slate-300 italic">
                      "
                      {data.appointment.reason ||
                        "General Medical Consultation"}
                      "
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center border-l border-white/5 pl-0 md:pl-12">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
                    Your Position
                  </p>
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-[120px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 tracking-tighter"
                    >
                      #{data.tokenNumber}
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Ticket
                        size={24}
                        className="text-teal-500/40 translate-y-16"
                      />
                    </div>
                  </div>
                  <div className="mt-4 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                    Status: Expected Soon
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  label: "Total in Queue",
                  value: data.queueStats.totalInQueue,
                  icon: <Users size={20} />,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  label: "Patients Ahead",
                  value: data.queueStats.waiting,
                  icon: <Activity size={20} />,
                  color: "text-rose-600",
                  bg: "bg-rose-50",
                },
                {
                  label: "Est. Wait Time",
                  value: `${data.queueStats.estimatedWaitMins}m`,
                  icon: <Clock size={20} />,
                  color: "text-teal-600",
                  bg: "bg-teal-50",
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  style={cardStyle}
                  className="p-8 text-center"
                >
                  <div
                    className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white`}
                  >
                    {stat.icon}
                  </div>
                  <p className="text-3xl font-black text-slate-800 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Currently Serving Pulse */}
            <motion.div
              variants={itemVariants}
              style={cardStyle}
              className="p-8 border-l-8 border-l-emerald-500 overflow-hidden relative group"
            >
              <div className="absolute top-[-50%] right-[-50%] w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full" />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center border border-emerald-100 group-hover:rotate-12 transition-transform">
                      <User size={28} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full animate-ping" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">
                      Live Entry
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      Currently being attended
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Active Token
                  </p>
                  <p className="text-4xl font-black text-emerald-600 tracking-tighter">
                    #{data.queueStats.serving?.tokenNumber || "—"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Auto-refresh Footer */}
            <footer className="pt-10 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Auto-syncing every 30 seconds{" "}
                <RefreshCw size={10} className="animate-spin" />
              </div>
              <p className="text-[10px] font-medium text-slate-400 opacity-60">
                Server timestamp: {new Date().toLocaleTimeString()} • Encrypted
                Live View
              </p>
            </footer>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PatientQueueStatus;
