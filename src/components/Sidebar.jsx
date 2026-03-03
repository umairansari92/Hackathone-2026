import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  LogOut,
  Brain,
  Stethoscope,
  ChevronLeft,
  Settings,
  BarChart3,
  UserCog,
  ShieldCheck,
  Ticket,
  Hash,
  Activity,
  UserCircle,
} from "lucide-react";

/**
 * Premium Sidebar with Glassmorphism and Framer Motion
 * 🎨 Design tokens: Teal-500, Slate-800, Emerald-400
 */
const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const userRole = user?.role || "Patient";
  const isAdmin = userRole === "Admin";

  // Role-based menu items consolidation
  const allMenuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: `/${userRole.toLowerCase()}-dashboard`,
      roles: ["Admin", "Doctor", "Receptionist", "Patient"],
    },
    // Admin Only
    {
      title: "Manage Doctors",
      icon: <Stethoscope size={20} />,
      path: "/manage-doctors",
      roles: ["Admin"],
    },
    {
      title: "Manage Users",
      icon: <Users size={20} />,
      path: "/manage-users",
      roles: ["Admin"],
    },
    // Unified Appointments (Role based path)
    {
      title: userRole === "Patient" ? "My Appointments" : "Appointments",
      icon: <Calendar size={20} />,
      path:
        userRole === "Patient" ? "/patient/my-appointments" : "/appointments",
      roles: ["Admin", "Doctor", "Receptionist", "Patient"],
    },
    // Unified Prescriptions
    {
      title: "Prescriptions",
      icon: <FileText size={20} />,
      path: "/prescriptions",
      roles: ["Admin", "Doctor", "Patient"],
    },
    // Patient Search / Patients Directory
    {
      title: "Patients Profile",
      icon: <Users size={20} />,
      path: "/patients",
      roles: ["Doctor", "Receptionist"],
    },
    // Booking
    {
      title: "Book Appointment",
      icon: <Ticket size={20} />,
      path: userRole === "Patient" ? "/patient/book" : "/book-appointment",
      roles: ["Receptionist", "Patient"],
    },
    // Queue
    {
      title: userRole === "Patient" ? "Queue Status" : "Token Queue",
      icon: <Hash size={20} />,
      path: userRole === "Patient" ? "/patient/my-queue" : "/token-queue",
      roles: ["Receptionist", "Patient"],
    },
    // Doctor Specific
    {
      title: "Smart Diagnosis",
      icon: <Brain size={20} />,
      path: "/smart-diagnosis",
      roles: ["Doctor"],
    },
    {
      title: "Doctor Schedule",
      icon: <Stethoscope size={20} />,
      path: "/doctor-schedule",
      roles: ["Receptionist"],
    },
    // Patient Specific
    {
      title: "Medical History",
      icon: <Activity size={20} />,
      path: "/medical-history",
      roles: ["Patient"],
    },
    {
      title: "Account Settings",
      icon: <UserCog size={20} />,
      path: "/patient-profile",
      roles: ["Patient"],
    },
  ];

  const menuItems = allMenuItems.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="w-72 bg-[#0f172a] text-slate-300 h-screen flex flex-col relative z-50 shadow-2xl overflow-hidden border-r border-slate-800/50"
    >
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none rounded-full" />

      {/* Brand Header */}
      <div className="p-8 pb-6">
        <div className="flex items-center gap-4 group cursor-pointer">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="bg-gradient-to-br from-teal-400 to-cyan-500 p-2.5 rounded-2xl text-white shadow-lg shadow-cyan-500/30"
          >
            <Brain size={24} />
          </motion.div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight leading-none mb-1">
              MedClinic <span className="text-cyan-400">AI</span>
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Smart Diagnosis SaaS
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Portal Badge */}
      <AnimatePresence>
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-6 mb-6 px-4 py-3 bg-gradient-to-r from-teal-900/40 to-emerald-900/20 border border-teal-500/20 rounded-2xl backdrop-blur-md flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-teal-500/20 rounded-lg">
                <ShieldCheck size={16} className="text-teal-400" />
              </div>
              <span className="text-[11px] font-black tracking-widest text-teal-100 italic">
                ADMIN ACCESS
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_10px_#2dd4bf] group-hover:scale-125 transition-transform" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-px bg-slate-800/40 mx-8 mb-4" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 custom-scrollbar">
        <div className="space-y-1.5">
          {menuItems.map((item, idx) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(item.path));

            return (
              <motion.div
                key={`${item.title}-${item.path}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                <Link
                  to={item.path}
                  className={`group flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? "bg-teal-500/10 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <motion.div
                      layoutId="active-bar"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 rounded-r-full"
                    />
                  )}

                  <span
                    className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-teal-400" : "text-slate-500"}`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`text-[13.5px] font-bold tracking-wide transition-all ${isActive ? "ml-0.5" : "group-hover:translate-x-1"}`}
                  >
                    {item.title}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="glow"
                      className="absolute inset-0 bg-teal-500/5 blur-xl rounded-full"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* User Area Footer */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-[24px] p-4 flex items-center gap-3.5 group shadow-inner">
          <div className="relative group/avatar">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-lg group-hover/avatar:rotate-6 transition-transform">
              {isAdmin ? "SA" : user?.fullname?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0f172a] rounded-full shadow-sm" />
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <h4 className="text-[13px] font-black text-white truncate leading-tight group-hover:text-teal-400 transition-colors">
              {user?.fullname}
            </h4>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${isAdmin ? "text-teal-400" : "text-slate-500"}`}
              >
                {isAdmin ? "Super Admin" : userRole}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(239, 68, 68, 0.15)",
            }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/50 text-slate-400 hover:text-red-400 transition-colors border border-slate-700/50 group-hover:border-red-500/20"
            title="Logout Device"
          >
            <LogOut size={16} />
          </motion.button>
        </div>

        <p className="text-center text-[9px] text-slate-600 font-bold tracking-[0.2em] mt-4 uppercase opacity-50">
          Powered by Gemini AI
        </p>
      </div>
    </motion.div>
  );
};

export default Sidebar;
