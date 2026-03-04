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
  ChevronRight,
  Settings,
  BarChart3,
  UserCog,
  ShieldCheck,
  Ticket,
  Hash,
  Activity,
  UserCircle,
  Mail,
  FlaskConical,
  Scan,
  Pill,
  DollarSign,
  Heart,
  ClipboardList,
  Layers,
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
      roles: [
        "Admin",
        "Doctor",
        "Receptionist",
        "Patient",
        "Nurse",
        "LabStaff",
        "Pharmacist",
        "Accountant",
        "Supervisor",
      ],
    },
    // ─── Admin Only ───
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
    // ─── OPD Module ───
    {
      title: "OPD Queue",
      icon: <Layers size={20} />,
      path: "/opd-module",
      roles: ["Admin", "Doctor", "Receptionist", "Nurse", "Supervisor"],
    },
    // ─── Appointments ───
    {
      title: userRole === "Patient" ? "My Appointments" : "Appointments",
      icon: <Calendar size={20} />,
      path:
        userRole === "Patient" ? "/patient/my-appointments" : "/appointments",
      roles: ["Admin", "Doctor", "Receptionist", "Patient"],
    },
    // ─── Prescriptions ───
    {
      title: "Prescriptions",
      icon: <FileText size={20} />,
      path: "/prescriptions",
      roles: ["Admin", "Doctor", "Patient"],
    },
    // ─── Patients ───
    {
      title: "Patients Profile",
      icon: <Users size={20} />,
      path: "/patients",
      roles: ["Doctor", "Receptionist", "Nurse"],
    },
    // ─── Booking ───
    {
      title: "Book Appointment",
      icon: <Ticket size={20} />,
      path: userRole === "Patient" ? "/patient/book" : "/book-appointment",
      roles: ["Receptionist", "Patient"],
    },
    // ─── Queue ───
    {
      title: userRole === "Patient" ? "Queue Status" : "Token Queue",
      icon: <Hash size={20} />,
      path: userRole === "Patient" ? "/patient/my-queue" : "/token-queue",
      roles: ["Receptionist", "Patient"],
    },
    // ─── Doctor Specific ───
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
    // ─── Lab Module ───
    {
      title: "Lab Module",
      icon: <FlaskConical size={20} />,
      path: "/lab-module",
      roles: ["Admin", "Doctor", "LabStaff", "Supervisor"],
    },
    // ─── Ultrasound Module ───
    {
      title: "Ultrasound",
      icon: <Scan size={20} />,
      path: "/ultrasound-module",
      roles: ["Admin", "Doctor", "Supervisor"],
    },
    // ─── Pharmacy Module ───
    {
      title: "Pharmacy",
      icon: <Pill size={20} />,
      path: "/pharmacy-module",
      roles: ["Admin", "Pharmacist", "Supervisor"],
    },
    // ─── Accounts Module ───
    {
      title: "Accounts",
      icon: <DollarSign size={20} />,
      path: "/accounts-module",
      roles: ["Admin", "Accountant", "Supervisor"],
    },
    // ─── Nurse Specific ───
    {
      title: "Vitals & Queue",
      icon: <Heart size={20} />,
      path: "/nurse-dashboard",
      roles: ["Nurse"],
    },
    // ─── Patient Specific ───
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

  const roleDisplayMap = {
    Admin: "Hospital Admin",
    Doctor: "Doctor",
    Nurse: "Nurse",
    Receptionist: "Receptionist",
    LabStaff: "Lab Staff",
    Pharmacist: "Pharmacist",
    Accountant: "Accountant",
    Supervisor: "Supervisor",
    Patient: "Patient",
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 80 }}
      className="w-72 h-screen relative flex flex-col 
    bg-(--surface) border-r border-(--border) 
    text-(--text-secondary) shadow-[0_0_40px_rgba(0,0,0,0.15)] overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-(--accent)/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-(--accent)/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Brand - Al-Shifa Health Care Center */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-center gap-4 group">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.08 }}
            className="p-3 rounded-2xl bg-linear-to-br from-(--accent) to-(--accent-hover) 
          text-white shadow-lg shadow-(--accent)/30"
          >
            <Stethoscope size={22} />
          </motion.div>

          <div>
            <h2 className="text-sm font-extrabold text-(--text-primary) tracking-tight leading-tight">
              Al-Shifa <br /> Health Care
            </h2>
            <p className="text-[9px] uppercase tracking-widest text-(--text-muted) font-semibold mt-1">
              Medical Management Center
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-(--border) to-transparent mx-6 mb-4" />

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, idx) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
            >
              <Link
                to={item.path}
                className={`relative flex items-center gap-4 px-5 py-3 rounded-xl 
              transition-all duration-300 group ${
                isActive
                  ? "bg-(--accent)/10 text-(--text-primary) shadow-inner border border-(--accent)/20"
                  : "hover:bg-(--hover) text-(--text-secondary) hover:text-(--text-primary)"
              }`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-(--accent) rounded-r-full"
                  />
                )}

                <span
                  className={`transition-all duration-300 ${
                    isActive
                      ? "text-(--accent)"
                      : "text-(--text-muted) group-hover:text-(--accent)"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="text-sm font-semibold tracking-wide flex-1">
                  {item.title}
                </span>

                {isActive && (
                  <ChevronRight
                    size={14}
                    className="text-(--accent) opacity-60"
                  />
                )}

                {isActive && (
                  <motion.div
                    layoutId="active-glow"
                    className="absolute inset-0 bg-(--accent)/5 blur-xl rounded-xl"
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
        bg-(--accent)/5 backdrop-blur-xl border border-(--border)"
        >
          <div
            className="w-11 h-11 rounded-xl bg-linear-to-br from-(--accent) to-(--accent-hover) 
        flex items-center justify-center text-white font-bold shadow-md"
          >
            {user?.fullname?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-(--text-primary) truncate">
              {user?.fullname}
            </h4>
            <p className="text-xs text-(--text-muted) uppercase tracking-wider">
              {roleDisplayMap[userRole] || userRole}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout}
            className="w-9 h-9 rounded-lg flex items-center justify-center 
          bg-(--hover) hover:bg-(--danger)/20 text-(--text-secondary) hover:text-(--danger) transition"
          >
            <LogOut size={16} />
          </motion.button>
        </div>

        <p className="text-center text-[9px] text-(--text-muted) mt-4 tracking-widest uppercase">
          Al-Shifa Healthcare Center
        </p>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
