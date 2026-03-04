import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { Bell, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Layout = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen w-full bg-(--bg) overflow-hidden gap-4 p-4 transition-colors duration-300">
      {/* Sidebar remains fixed on the left */}
      <div className="w-72 shrink-0">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden rounded-3xl bg-(--surface)/60 backdrop-blur-sm shadow-(--shadow-lg) border border-(--border)">
        {/* Modern Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-(--surface)/70 backdrop-blur-xl border-b border-(--border) h-16 shrink-0 flex items-center px-8 z-10 shadow-(--shadow-sm)"
        >
          <div className="flex items-center justify-between w-full">
            {/* Title & Branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-(--accent) to-(--accent-hover) flex items-center justify-center text-white font-black shadow-lg">
                ⚕️
              </div>
              <div>
                <h1 className="text-lg font-black text-(--text-primary) tracking-tight">
                  Dashboard
                </h1>
                <p className="text-xs text-(--accent) font-bold uppercase tracking-wider">
                  Al-Shifa Healthcare
                </p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="hidden md:flex items-center gap-2 bg-(--surface) border border-(--border) rounded-xl px-4 py-2 hover:border-(--accent) transition-colors">
                <Search size={18} className="text-(--text-muted)" />
                <input
                  type="text"
                  placeholder="Quick search..."
                  className="bg-transparent outline-none text-sm text-(--text-primary) placeholder-(--text-muted) w-48"
                />
              </div>

              {/* Notification Bell */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2.5 bg-(--surface) border border-(--border) rounded-xl hover:border-(--accent) hover:bg-(--accent)/5 transition-all hover:shadow-(--shadow-md)"
              >
                <Bell size={20} className="text-(--text-secondary)" />
                <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-(--danger) rounded-full shadow-lg animate-pulse" />
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2.5 bg-(--surface) border border-(--border) rounded-xl hover:border-(--accent) hover:bg-(--accent)/5 transition-all"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? (
                  <Sun size={20} className="text-(--accent)" />
                ) : (
                  <Moon size={20} className="text-(--text-secondary)" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 flex flex-col">
          <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col">
            {/* Background Elements */}
            <div className="fixed top-20 right-20 w-96 h-96 bg-(--accent)/10 blur-3xl rounded-full -z-10 pointer-events-none" />
            <div className="fixed bottom-20 left-20 w-96 h-96 bg-(--accent)/5 blur-3xl rounded-full -z-10 pointer-events-none" />

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
