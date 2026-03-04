import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../store/userSlice";
import { motion } from "framer-motion";
import {
  LogOut,
  Shield,
  Zap,
  Heart,
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Stethoscope,
  Users,
  FlaskConical,
} from "lucide-react";

// Role-based quick access links
const getRoleLinks = (role) => {
  switch (role) {
    case "Admin":
      return [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/admin-dashboard",
          gradient: "from-blue-500 to-indigo-600",
          bg: "bg-blue-50",
          text: "text-blue-600",
        },
        {
          icon: Users,
          label: "Manage Users",
          path: "/manage-users",
          gradient: "from-purple-500 to-pink-600",
          bg: "bg-purple-50",
          text: "text-purple-600",
        },
        {
          icon: Stethoscope,
          label: "Manage Doctors",
          path: "/manage-doctors",
          gradient: "from-teal-500 to-emerald-600",
          bg: "bg-teal-50",
          text: "text-teal-600",
        },
      ];
    case "Doctor":
      return [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/doctor-dashboard",
          gradient: "from-blue-500 to-indigo-600",
          bg: "bg-blue-50",
          text: "text-blue-600",
        },
        {
          icon: FlaskConical,
          label: "Smart Diagnosis",
          path: "/smart-diagnosis",
          gradient: "from-teal-500 to-emerald-600",
          bg: "bg-teal-50",
          text: "text-teal-600",
        },
        {
          icon: ClipboardList,
          label: "Prescriptions",
          path: "/prescriptions",
          gradient: "from-purple-500 to-pink-600",
          bg: "bg-purple-50",
          text: "text-purple-600",
        },
      ];
    case "Receptionist":
      return [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/receptionist-dashboard",
          gradient: "from-blue-500 to-indigo-600",
          bg: "bg-blue-50",
          text: "text-blue-600",
        },
        {
          icon: CalendarDays,
          label: "Book Appointment",
          path: "/book-appointment",
          gradient: "from-teal-500 to-emerald-600",
          bg: "bg-teal-50",
          text: "text-teal-600",
        },
        {
          icon: ClipboardList,
          label: "Token Queue",
          path: "/token-queue",
          gradient: "from-orange-500 to-rose-500",
          bg: "bg-orange-50",
          text: "text-orange-600",
        },
      ];
    case "Nurse":
      return [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/nurse-dashboard",
          gradient: "from-blue-500 to-indigo-600",
          bg: "bg-blue-50",
          text: "text-blue-600",
        },
        {
          icon: Users,
          label: "OPD Queue",
          path: "/opd-module",
          gradient: "from-teal-500 to-emerald-600",
          bg: "bg-teal-50",
          text: "text-teal-600",
        },
        {
          icon: ClipboardList,
          label: "Patients",
          path: "/patients",
          gradient: "from-purple-500 to-pink-600",
          bg: "bg-purple-50",
          text: "text-purple-600",
        },
      ];
    case "LabStaff":
      return [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/labstaff-dashboard",
          gradient: "from-blue-500 to-indigo-600",
          bg: "bg-blue-50",
          text: "text-blue-600",
        },
        {
          icon: FlaskConical,
          label: "Lab Module",
          path: "/lab-module",
          gradient: "from-teal-500 to-emerald-600",
          bg: "bg-teal-50",
          text: "text-teal-600",
        },
        {
          icon: CalendarDays,
          label: "Pending Tests",
          path: "/lab-module",
          gradient: "from-yellow-500 to-amber-600",
          bg: "bg-yellow-50",
          text: "text-yellow-700",
        },
      ];
    case "Pharmacist":
      return [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/pharmacist-dashboard",
          gradient: "from-blue-500 to-indigo-600",
          bg: "bg-blue-50",
          text: "text-blue-600",
        },
        {
          icon: ClipboardList,
          label: "Pharmacy",
          path: "/pharmacy-module",
          gradient: "from-emerald-500 to-teal-600",
          bg: "bg-emerald-50",
          text: "text-emerald-600",
        },
        {
          icon: Users,
          label: "Prescriptions",
          path: "/prescriptions",
          gradient: "from-purple-500 to-pink-600",
          bg: "bg-purple-50",
          text: "text-purple-600",
        },
      ];
    case "Accountant":
      return [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/accountant-dashboard",
          gradient: "from-blue-500 to-indigo-600",
          bg: "bg-blue-50",
          text: "text-blue-600",
        },
        {
          icon: CalendarDays,
          label: "Accounts",
          path: "/accounts-module",
          gradient: "from-amber-500 to-orange-600",
          bg: "bg-amber-50",
          text: "text-amber-700",
        },
        {
          icon: FlaskConical,
          label: "Finance Report",
          path: "/accounts-module",
          gradient: "from-emerald-500 to-teal-600",
          bg: "bg-emerald-50",
          text: "text-emerald-600",
        },
      ];
    case "Supervisor":
      return [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/supervisor-dashboard",
          gradient: "from-blue-500 to-indigo-600",
          bg: "bg-blue-50",
          text: "text-blue-600",
        },
        {
          icon: FlaskConical,
          label: "Lab Overview",
          path: "/lab-module",
          gradient: "from-teal-500 to-emerald-600",
          bg: "bg-teal-50",
          text: "text-teal-600",
        },
        {
          icon: CalendarDays,
          label: "Accounts",
          path: "/accounts-module",
          gradient: "from-amber-500 to-orange-600",
          bg: "bg-amber-50",
          text: "text-amber-700",
        },
      ];
    case "Patient":
    default:
      return [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          path: "/patient-dashboard",
          gradient: "from-blue-500 to-indigo-600",
          bg: "bg-blue-50",
          text: "text-blue-600",
        },
        {
          icon: CalendarDays,
          label: "My Appointments",
          path: "/patient/my-appointments",
          gradient: "from-teal-500 to-emerald-600",
          bg: "bg-teal-50",
          text: "text-teal-600",
        },
        {
          icon: ClipboardList,
          label: "Medical Records",
          path: "/medical-history",
          gradient: "from-purple-500 to-pink-600",
          bg: "bg-purple-50",
          text: "text-purple-600",
        },
      ];
  }
};

// Get first meaningful name part (skip titles like Dr., Mr., Ms.)
const getFirstName = (fullname) => {
  if (!fullname) return "there";
  const titles = ["dr.", "mr.", "mrs.", "ms.", "prof."];
  const parts = fullname.trim().split(" ");
  const first = parts.find((p) => !titles.includes(p.toLowerCase()));
  return first || parts[0];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  if (!user) return null;

  const links = getRoleLinks(user.role);
  const firstName = getFirstName(user.fullname);

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center py-8 px-4 font-['Outfit']">
      {/* Background Orbs */}
      <div
        className="fixed top-[-80px] right-[-80px] w-96 h-96 rounded-full -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(20,184,166,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="fixed bottom-[-80px] left-[-80px] w-96 h-96 rounded-full -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-xl"
      >
        {/* ── Hero ── */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-5 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 backdrop-blur-sm">
            <Zap size={15} style={{ color: "var(--accent)" }} />
            <span className="text-sm font-semibold text-[var(--accent)]">
              Welcome Back!
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-[var(--text-primary)] mb-3 tracking-tight leading-tight">
            Hello,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]">
              {firstName}
            </span>
            ! 👋
          </h1>
          <p className="text-base text-[var(--text-secondary)] font-medium">
            You've successfully logged into{" "}
            <span className="text-[var(--accent)] font-semibold">
              Al-Shifa Health Care Center
            </span>
          </p>
        </motion.div>

        {/* ── Profile Card ── */}
        <motion.div
          variants={itemVariants}
          className="rounded-3xl p-6 mb-6 border border-[var(--border)]"
          style={{
            background: "var(--surface)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 8px 32px rgba(14,165,164,0.10), 0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="absolute inset-0 rounded-2xl blur-xl opacity-40"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                }}
              />
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.fullname}
                  className="w-28 h-28 rounded-2xl object-cover border-2 border-[var(--surface)] shadow-lg relative z-10"
                />
              ) : (
                <div
                  className="w-28 h-28 rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-lg relative z-10"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                  }}
                >
                  {firstName[0]?.toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-black text-[var(--text-primary)] mb-1">
                {user.fullname}
              </h2>

              <div className="space-y-2 text-sm text-[var(--text-secondary)] font-medium mb-4">
                <div className="flex items-center gap-2 sm:justify-start justify-center">
                  <Shield
                    size={15}
                    style={{ color: "var(--accent)" }}
                    className="flex-shrink-0"
                  />
                  <span>
                    <strong>Role:</strong> {user.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:justify-start justify-center">
                  <Heart
                    size={15}
                    style={{ color: "var(--danger)" }}
                    className="flex-shrink-0"
                  />
                  <span>
                    <strong>Email:</strong> {user.email}
                  </span>
                </div>
                {user.gender && (
                  <div className="flex items-center gap-2 sm:justify-start justify-center">
                    <span className="w-[15px] h-[15px] rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] flex-shrink-0" />
                    <span>
                      <strong>Gender:</strong> {user.gender}
                    </span>
                  </div>
                )}
              </div>

              {/* Status */}
              <span className="badge badge-success">
                <span className="w-2 h-2 bg-[var(--success)] rounded-full animate-pulse inline-block mr-1" />
                Active &amp; Ready
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Quick Access Cards ── */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {links.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={i}
                onClick={() => navigate(item.path)}
                whileHover={{ y: -4, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`${item.bg} rounded-2xl p-4 flex flex-col items-center gap-3 cursor-pointer border border-white/80 shadow-sm hover:shadow-md transition-all group`}
                style={{ backdropFilter: "blur(10px)" }}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br ${item.gradient} group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon size={22} className="text-white" />
                </div>
                <p
                  className={`text-xs font-bold text-center leading-tight ${item.text}`}
                >
                  {item.label}
                </p>
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── Sign Out ── */}
        <motion.div variants={itemVariants}>
          <motion.button
            onClick={onLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn btn-danger flex items-center justify-center gap-3 text-base font-bold"
            style={{
              boxShadow: "0 6px 20px rgba(239,68,68,0.30)",
            }}
          >
            <LogOut size={20} />
            Sign Out from Your Account
          </motion.button>
        </motion.div>

        {/* ── Footer ── */}
        <motion.p
          variants={itemVariants}
          className="text-center text-[var(--text-muted)] text-xs mt-6 font-medium"
        >
          🔒 You are securely logged in. Your session includes all role-based
          features.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Home;
