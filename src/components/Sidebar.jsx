import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  LogOut,
  Brain,
  Stethoscope,
  ChevronLeft,
} from "lucide-react";

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

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: `/${userRole.toLowerCase()}-dashboard`,
      roles: ["Admin", "Doctor", "Receptionist", "Patient"],
    },
    {
      title: "Patients",
      icon: <Users size={18} />,
      path: "/patients",
      roles: ["Admin", "Doctor", "Receptionist"],
    },
    {
      title: "Appointments",
      icon: <Calendar size={18} />,
      path: "/appointments",
      roles: ["Admin", "Doctor", "Receptionist", "Patient"],
    },
    {
      title: "Prescriptions",
      icon: <FileText size={18} />,
      path: "/prescriptions",
      roles: ["Admin", "Doctor", "Patient"],
    },
    {
      title: "Smart Diagnosis",
      icon: <Brain size={18} />,
      path: "/smart-diagnosis",
      roles: ["Doctor"],
    },
  ];

  return (
    <div className="w-64 bg-[#111c22] text-white h-screen flex flex-col transition-all duration-300 shadow-xl overflow-hidden">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3">
        <div className="bg-teal-500 p-2 rounded-xl text-white shadow-lg">
          <Stethoscope size={22} />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-white tracking-wide">
            MedClinic AI
          </h2>
          <p className="text-[10px] text-teal-400 font-medium tracking-wider">
            Smart Diagnosis SaaS
          </p>
        </div>
        <button className="text-slate-500 hover:text-white transition-colors">
          <ChevronLeft size={16} />
        </button>
      </div>

      <div className="h-px bg-slate-800/50 mx-4 mb-4"></div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto w-full">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const userRole = user?.role || "Patient";
            if (item.roles.includes(userRole)) {
              let isActive = location.pathname.includes(item.path);
              // exact match for dashboard
              if (
                item.path.includes("dashboard") &&
                location.pathname !== item.path
              ) {
                isActive = false;
              }

              return (
                <li key={item.path} className="px-2">
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
                      isActive
                        ? "bg-[#173235] text-teal-400 relative"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                    }`}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    {isActive && (
                      <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                    )}
                  </Link>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 bg-[#0d161b] flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded bg-[#173235] flex items-center justify-center text-teal-400 font-bold border border-teal-900 shadow-sm shrink-0">
            {user?.role === "Doctor" ? "DR" : user?.fullname?.charAt(0) || "U"}
          </div>
          <div className="truncate">
            <p className="text-sm font-semibold text-slate-200 truncate">
              {user?.fullname}
            </p>
            <p className="text-xs text-slate-500 truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-slate-500 hover:text-red-400 transition-colors shrink-0"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
