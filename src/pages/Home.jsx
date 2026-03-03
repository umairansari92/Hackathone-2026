import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../store/userSlice";
import { motion } from "framer-motion";
import { LogOut, Shield, Zap, Heart } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-6 lg:p-10 font-['Outfit']">
      {/* Background Orbs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-200/20 blur-3xl rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-emerald-200/20 blur-3xl rounded-full -z-10 pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100/80 backdrop-blur-sm rounded-full border border-teal-200/50 mb-6">
            <Zap size={16} className="text-teal-600" />
            <span className="text-sm font-semibold text-teal-700">Welcome Back!</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-slate-900 mb-3 tracking-tight">
            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">{user.fullname?.split(" ")[0]}</span>! 👋
          </h1>
          <p className="text-lg text-slate-600 font-medium">You've successfully logged into Al Shifa Hospital</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="glass-card p-8 lg:p-10 mb-8"
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex-shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-3xl blur-2xl opacity-30" />
              <img
                src={user.image}
                alt={user.fullname}
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl object-cover border-3 border-white shadow-2xl relative z-10"
              />
            </motion.div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2">{user.fullname}</h2>
              <div className="space-y-3 text-slate-600 font-medium mb-6">
                <div className="flex items-center gap-3 lg:justify-start justify-center">
                  <Shield size={18} className="text-teal-600 flex-shrink-0" />
                  <span><strong>Role:</strong> {user.role}</span>
                </div>
                <div className="flex items-center gap-3 lg:justify-start justify-center">
                  <Heart size={18} className="text-rose-500 flex-shrink-0" />
                  <span><strong>Email:</strong> {user.email}</span>
                </div>
                <div className="flex items-center gap-3 lg:justify-start justify-center">
                  <span className="w-5 h-5 bg-gradient-to-r from-teal-600 to-emerald-500 rounded-full flex-shrink-0" />
                  <span><strong>Gender:</strong> {user.gender}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full border border-emerald-200/50 lg:justify-start">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-emerald-700">Active & Ready</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Access Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          {[
            { icon: "📊", label: "Dashboard", color: "from-blue-500 to-blue-600" },
            { icon: "📅", label: "My Appointments", color: "from-teal-500 to-emerald-600" },
            { icon: "📋", label: "Medical Records", color: "from-purple-500 to-pink-600" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3 }}
              className={`glass-card p-5 text-center cursor-pointer group hover:shadow-xl transition-all`}
            >
              <div className={`text-4xl mb-3 group-hover:scale-110 transition-transform`}>{item.icon}</div>
              <p className="font-semibold text-slate-800">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Logout Button */}
        <motion.div variants={itemVariants}>
          <button
            onClick={onLogout}
            className="w-full btn btn-danger flex items-center justify-center gap-2 text-lg"
          >
            <LogOut size={20} />
            Sign Out from Your Account
          </button>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          variants={itemVariants}
          className="text-center text-slate-500 text-sm mt-8 font-medium"
        >
          You are securely logged into Al Shifa Hospital. Your session includes all role-based features and data.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Home;
