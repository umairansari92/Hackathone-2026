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
  Mail,
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
    {
      title: "Doctor Invites",
      icon: <Mail size={20} />,
      path: "/admin/invite-doctor",
      roles: ["Admin"],
    },
    {
      title: "Doctor Requests",
      icon: <ShieldCheck size={20} />,
      path: "/admin/doctor-requests",
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
  <motion.aside
    initial={{ x: -300 }}
    animate={{ x: 0 }}
    transition={{ type: "spring", stiffness: 80 }}
    className="w-72 h-screen relative flex flex-col 
    bg-gradient-to-b from-[#0b1220] via-[#0e1628] to-[#0b1220]
    text-slate-300 border-r border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.6)] overflow-hidden"
  >
    {/* Background Glow */}
    <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

    {/* Brand */}
    <div className="px-8 pt-8 pb-6">
      <div className="flex items-center gap-4 group">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.08 }}
          className="p-3 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-500 
          text-white shadow-lg shadow-cyan-500/30"
        >
          <Brain size={22} />
        </motion.div>

        <div>
          <h2 className="text-lg font-extrabold text-white tracking-tight">
            MedClinic <span className="text-cyan-400">AI</span>
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
            Smart Diagnosis System
          </p>
        </div>
      </div>
    </div>

    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-6 mb-4" />

    {/* Navigation */}
    <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
      {menuItems.map((item, idx) => {
        const isActive =
          location.pathname === item.path ||
          (item.path !== "/" && location.pathname.startsWith(item.path));

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link
              to={item.path}
              className={`relative flex items-center gap-4 px-5 py-3 rounded-xl 
              transition-all duration-300 group ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 text-white shadow-inner border border-cyan-400/20"
                  : "hover:bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r-full"
                />
              )}

              <span
                className={`transition-all duration-300 ${
                  isActive
                    ? "text-cyan-400"
                    : "text-slate-500 group-hover:text-cyan-300"
                }`}
              >
                {item.icon}
              </span>

              <span className="text-sm font-semibold tracking-wide">
                {item.title}
              </span>

              {isActive && (
                <motion.div
                  layoutId="active-glow"
                  className="absolute inset-0 bg-cyan-400/5 blur-xl rounded-xl"
                />
              )}
            </Link>
          </motion.div>
        );
      })}
    </nav>

    {/* User Footer */}
    <div className="p-5">
      <div
        className="relative flex items-center gap-4 p-4 rounded-2xl 
        bg-white/5 backdrop-blur-xl border border-white/10"
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 
        flex items-center justify-center text-white font-bold shadow-md">
          {isAdmin ? "SA" : user?.fullname?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white truncate">
            {user?.fullname}
          </h4>
          <p className="text-xs text-slate-400 uppercase tracking-wider">
            {isAdmin ? "Super Admin" : userRole}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="w-9 h-9 rounded-lg flex items-center justify-center 
          bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
        >
          <LogOut size={16} />
        </motion.button>
      </div>

      <p className="text-center text-[9px] text-slate-600 mt-4 tracking-widest uppercase">
        Powered by AI Engine
      </p>
    </div>
  </motion.aside>
);
};

export default Sidebar;
