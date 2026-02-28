import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signup, reset } from "../store/userSlice";
import { Stethoscope, UserPlus, Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    gender: "Male",
    role: "Patient",
  });
  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { fullname, email, password, gender, role } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      console.error(message);
    }
    if (isSuccess || user) {
      navigate("/");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onFileChange = (e) => {
    setImage(e.target.files[0]);
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

  return (
    <div className="min-h-screen flex w-full font-sans">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex flex-col flex-1 bg-gradient-to-br from-teal-500 to-blue-500 relative overflow-hidden items-center justify-center p-12 text-center text-white">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center max-w-md">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm mb-6 shadow-xl">
            <Stethoscope size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            MedClinic AI
          </h1>
          <p className="text-teal-50 text-lg mb-12 leading-relaxed">
            Join the future of healthcare. AI-powered management for modern
            clinics.
          </p>

          <div className="grid grid-cols-3 gap-8 w-full border-t border-white/20 pt-8">
            <div>
              <h3 className="text-2xl font-bold mb-1">1200+</h3>
              <p className="text-xs text-teal-100 uppercase tracking-wider">
                Patients
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">98%</h3>
              <p className="text-xs text-teal-100 uppercase tracking-wider">
                Accuracy
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">4 Roles</h3>
              <p className="text-xs text-teal-100 uppercase tracking-wider">
                RBAC
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Signup Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white p-8 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-lg space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              Create Account
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              Fill in the details below to register.
            </p>
          </div>

          {isError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
              {message}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={fullname}
                  onChange={onChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={gender}
                  onChange={onChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Account Role
                </label>
                <select
                  name="role"
                  value={role}
                  onChange={onChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white font-medium text-teal-700"
                >
                  <option value="Patient">Patient</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Profile Photo (Optional)
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={onFileChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus size={18} /> Complete Registration
                </>
              )}
            </button>
          </form>

          <div className="text-center text-sm pt-4 border-t border-slate-100">
            <span className="text-slate-500">Already have an account? </span>
            <Link
              to="/login"
              className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
