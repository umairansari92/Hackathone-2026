import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signup, reset } from "../store/userSlice";
import {
  Heart,
  Eye,
  EyeOff,
  UserPlus,
  Camera,
  User,
  Mail,
  Lock,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    gender: "Male",
    role: "Patient",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const { fullname, email, password, gender, role } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError) console.error(message);
    if (isSuccess || user) navigate("/");
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = new FormData();
    userData.append("fullname", fullname);
    userData.append("email", email);
    userData.append("password", password);
    userData.append("gender", gender);
    userData.append("role", role);
    if (image) userData.append("image", image);
    dispatch(signup(userData));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen flex w-full font-['Outfit'] bg-slate-50">
      {/* LEFT PANEL */}
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
        {/* Background orbs */}
        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 -left-32 w-72 h-72 bg-white/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute bottom-20 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-sm text-center"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl"
          >
            <Heart size={48} className="text-white" />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl font-black text-white mb-3"
          >
            Join Our Team
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-white/80 text-lg font-semibold mb-6"
          >
            Deliver Better Healthcare Together
          </motion.p>

          <motion.div variants={itemVariants} className="space-y-4 text-left">
            {[
              {
                icon: "🏥",
                title: "Smart Management",
                desc: "Streamline your clinic operations",
              },
              {
                icon: "🔒",
                title: "Secure Access",
                desc: "Role-based security & encryption",
              },
              {
                icon: "📊",
                title: "Real-time Insights",
                desc: "Track appointments & analytics",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="text-2xl flex-shrink-0">{item.icon}</div>
                <div>
                  <p className="font-bold text-white text-sm">{item.title}</p>
                  <p className="text-white/60 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-12 pt-8 border-t border-white/20"
          >
            <p className="text-sm font-bold text-white/60 mb-4">
              Currently Serving 1200+ Healthcare Professionals
            </p>
            <div className="flex gap-2 justify-center">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/40" />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 lg:p-0 overflow-y-auto"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-lg"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                <Heart size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">Al Shifa</h2>
                <p className="text-xs font-semibold text-teal-600 tracking-widest uppercase">
                  Hospital
                </p>
              </div>
            </div>
          </motion.div>

          {/* Form title */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">
              Create Account
            </h1>
            <p className="text-slate-600 font-medium">
              Setup your profile in seconds
            </p>
          </motion.div>

          {/* Error Banner */}
          {isError && (
            <motion.div
              variants={itemVariants}
              className="error-message mb-6 flex items-center gap-2"
            >
              ⚠️ {message || "Something went wrong. Please try again."}
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Profile Image */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center"
            >
              <label className="cursor-pointer group relative">
                <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 group-hover:border-teal-500 flex items-center justify-center bg-slate-50 group-hover:bg-teal-50 transition-all relative overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera
                      size={32}
                      className="text-slate-400 group-hover:text-teal-600 transition-colors"
                    />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
                <p className="text-xs text-slate-500 mt-2 font-medium text-center">
                  {imagePreview ? "Tap to change" : "Upload profile photo"}
                </p>
              </label>
            </motion.div>

            {/* Full Name */}
            <motion.div variants={itemVariants}>
              <label className="form-group label text-sm font-bold text-slate-900 mb-2 block">
                <User size={16} className="inline mr-2 text-teal-600" />
                Full Name
              </label>
              <input
                type="text"
                name="fullname"
                value={fullname}
                onChange={onChange}
                required
                placeholder="Dr. Sarah Khan"
                className="form-control"
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="form-group label text-sm font-bold text-slate-900 mb-2 block">
                <Mail size={16} className="inline mr-2 text-teal-600" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                placeholder="sarah@smartcare.com"
                className="form-control"
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label className="form-group label text-sm font-bold text-slate-900 mb-2 block">
                <Lock size={16} className="inline mr-2 text-teal-600" />
                Password (Min 6 chars)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  minLength="6"
                  placeholder="••••••••"
                  className="form-control pr-12"
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

            {/* Gender & Role */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4"
            >
              {/* Gender */}
              <div>
                <label className="form-group label text-sm font-bold text-slate-900 mb-2 block">
                  Gender
                </label>
                <select
                  name="gender"
                  value={gender}
                  onChange={onChange}
                  className="form-control text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Role */}
              <div>
                <label className="form-group label text-sm font-bold text-slate-900 mb-2 block flex items-center gap-1">
                  <Briefcase size={16} className="text-teal-600" />
                  Role
                </label>
                <select
                  name="role"
                  value={role}
                  onChange={onChange}
                  className="form-control text-sm font-bold text-teal-600"
                >
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </motion.div>

            {/* Submit Button */}
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
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Account
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.p
            variants={itemVariants}
            className="text-center mt-8 text-slate-600 font-medium"
          >
            Already registered?{" "}
            <Link
              to="/login"
              className="text-teal-600 font-bold hover:text-emerald-600 transition-colors"
            >
              Sign in now
            </Link>
          </motion.p>

          {/* Terms */}
          <motion.p
            variants={itemVariants}
            className="text-center text-xs text-slate-500 mt-4 leading-relaxed"
          >
            By creating an account, you agree to our{" "}
            <span className="text-slate-700 font-semibold">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-slate-700 font-semibold">Privacy Policy</span>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
