import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login, reset } from "../store/userSlice";
import {
  Stethoscope,
  Eye,
  EyeOff,
  LogIn,
  CreditCard,
  User,
  Lock,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";

const ROLES = ["Admin", "Doctor", "Receptionist", "Patient"];

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState("Doctor");
  const [hoveredDemo, setHoveredDemo] = useState(null);

  const { email, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isSuccess || user) navigate("/");
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const DEMO_ACCOUNTS = [
    {
      label: "Admin",
      role: "Admin",
      email: "admin@smartcare.com",
      icon: "🛡️",
      color: "from-amber-500 to-orange-600",
    },
    {
      label: "Doctor",
      role: "Doctor",
      email: "ahmed.khan@smartcare.com",
      icon: "🩺",
      color: "from-teal-500 to-emerald-600",
    },
    {
      label: "Receptionist",
      role: "Receptionist",
      email: "reception1@smartcare.com",
      icon: "💼",
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Patient",
      role: "Patient",
      email: "patient@smartcare.com",
      icon: "👤",
      color: "from-purple-500 to-pink-600",
    },
  ];

  const handleRoleSelect = (role) => {
    const acct = DEMO_ACCOUNTS.find((a) => a.role === role);
    setActiveRole(role);
    setFormData({
      email: acct ? acct.email : `${role.toLowerCase()}@smartcare.com`,
      password: "demo1234",
    });
  };

  const handleDemoLogin = (acct) => {
    setActiveRole(acct.role);
    setFormData({ email: acct.email, password: "demo1234" });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password, role: activeRole }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen flex w-full font-['Outfit'] bg-slate-50">
      {/* LEFT PANEL – Gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #1e3a3a 100%)",
        }}
      >
        {/* Animated background orbs */}
        <motion.div
          animate={{
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 -left-32 w-72 h-72 bg-white/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-sm text-center"
        >
          {/* Icon Box */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl"
          >
            <Heart size={48} className="text-white" />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl font-black text-white mb-3 tracking-tight"
          >
            Al Shifa Hospital
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-white/80 text-lg font-semibold mb-4"
          >
            Modern Healthcare Management
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="text-white/60 text-base leading-relaxed"
          >
            Manage appointments, prescriptions, and patient care with our
            intelligent healthcare system.
          </motion.p>

          {/* Features */}
          <motion.div variants={itemVariants} className="mt-12 space-y-4">
            {[
              { icon: "🏥", text: "Complete Hospital Management" },
              { icon: "👥", text: "Multi-Role Access Control" },
              { icon: "📊", text: "Real-time Analytics & Reports" },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-white/70 text-sm font-medium"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                  {feature.icon}
                </div>
                {feature.text}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* RIGHT PANEL – Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 lg:p-0"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                <Stethoscope size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">Welcome</h2>
                <p className="text-xs font-semibold text-teal-600 tracking-widest uppercase">
                  Al Shifa
                </p>
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Sign In</h1>
            <p className="text-slate-600 font-medium">
              Access your clinic dashboard securely
            </p>
          </motion.div>

          {/* Error Banner */}
          {isError && (
            <motion.div
              variants={itemVariants}
              className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 font-bold text-sm shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-lg">
                ⚠️
              </div>
              <p className="flex-1">
                {message || "Invalid credentials. Please try again."}
              </p>
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Role Selection */}
            <motion.div variants={itemVariants}>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-3">
                Select Your Role
              </p>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((role) => (
                  <motion.button
                    key={role}
                    type="button"
                    whileHover={{ y: -2 }}
                    onClick={() => handleRoleSelect(role)}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                      activeRole === role
                        ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/30"
                        : "bg-white border-2 border-slate-200 text-slate-700 hover:border-teal-500"
                    }`}
                  >
                    {role}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="form-group label text-sm font-bold text-slate-900 mb-2 block">
                <User size={16} className="inline mr-2 text-teal-600" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                placeholder="yourname@smartcare.com"
                className="form-control w-full"
              />
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="form-group label text-sm font-bold text-slate-900 mb-2 block">
                <Lock size={16} className="inline mr-2 text-teal-600" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  placeholder="••••••••"
                  className="form-control w-full pr-12"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>
              </div>
            </motion.div>

            {/* Sign In Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary flex items-center justify-center gap-2 text-lg font-bold"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Demo Accounts Section */}
          <motion.div
            variants={itemVariants}
            className="mt-8 pt-8 border-t-2 border-slate-200"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4 text-center">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-2 gap-3">
              {DEMO_ACCOUNTS.map((acct, i) => (
                <motion.button
                  key={acct.role}
                  type="button"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoveredDemo(i)}
                  onMouseLeave={() => setHoveredDemo(null)}
                  onClick={() => handleDemoLogin(acct)}
                  className={`py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 bg-white border-2 border-slate-200 hover:border-teal-500 ${
                    hoveredDemo === i
                      ? `bg-gradient-to-r ${acct.color} text-white shadow-lg`
                      : "text-slate-700"
                  }`}
                >
                  <div className="text-xl mb-1">{acct.icon}</div>
                  {acct.label}
                </motion.button>
              ))}
            </div>
            <p className="text-xs text-slate-400 text-center mt-3 font-medium">
              Password:{" "}
              <span className="font-bold text-slate-600">demo1234</span>
            </p>
          </motion.div>

          {/* Footer */}
          <motion.p
            variants={itemVariants}
            className="text-center mt-8 text-slate-600 font-medium"
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-teal-600 font-bold hover:text-emerald-600 transition-colors"
            >
              Create one now
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
