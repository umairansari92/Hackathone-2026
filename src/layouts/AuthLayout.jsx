import { Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const AuthLayout = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="w-full min-h-screen bg-(--bg) transition-colors duration-300">
      {/* Theme Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="fixed top-8 right-8 p-3 rounded-xl bg-(--surface) border border-(--border) hover:border-(--accent) transition-all z-50"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? (
          <Sun size={20} className="text-(--accent)" />
        ) : (
          <Moon size={20} className="text-(--text-secondary)" />
        )}
      </motion.button>

      {/* Brand Header - Al-Shifa */}
      <div className="fixed top-8 left-8 z-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-(--accent) to-(--accent-hover) flex items-center justify-center text-white font-black shadow-lg">
            ⚕️
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-(--text-primary) tracking-tight leading-tight">
              Al-Shifa
            </h1>
            <p className="text-[11px] uppercase letter-spacing-widest text-(--text-muted) font-semibold">
              Health Care Center
            </p>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default AuthLayout;
