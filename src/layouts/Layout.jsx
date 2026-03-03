import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { Bell, Search } from "lucide-react";

const Layout = () => {
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 via-slate-50 to-teal-50 overflow-hidden gap-4 p-4">
      {/* Sidebar remains fixed on the left */}
      <div className="w-72 shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden rounded-3xl bg-white/60 backdrop-blur-sm shadow-xl border border-white/80">
        {/* Modern Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 h-16 shrink-0 flex items-center px-8 z-10 shadow-sm"
        >
          <div className="flex items-center justify-between w-full">
            {/* Title & Branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white font-black shadow-lg">
                🏥
              </div>
              <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight">Dashboard</h1>
                <p className="text-xs text-cyan-600 font-bold uppercase tracking-wider">MedClinic AI</p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="hidden md:flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 hover:border-teal-500 transition-colors">
                <Search size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400 w-48"
                />
              </div>

              {/* Notification Bell */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all hover:shadow-md"
              >
                <Bell size={20} className="text-slate-600" />
                <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full shadow-lg animate-pulse" />
              </motion.button>

              {/* Theme Toggle (Optional) */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-teal-500 hover:bg-slate-50 transition-all"
              >
                🌙
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
          <div className="max-w-7xl mx-auto">
            {/* Background Elements */}
            <div className="fixed top-20 right-20 w-96 h-96 bg-teal-200/20 blur-3xl rounded-full -z-10 pointer-events-none" />
            <div className="fixed bottom-20 left-20 w-96 h-96 bg-emerald-200/20 blur-3xl rounded-full -z-10 pointer-events-none" />
            
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
