import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login, reset } from "../store/userSlice";
import { Stethoscope, LogIn, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState("Doctor");

  const { email, password } = formData;

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

  const handleRoleSelection = (role) => {
    setActiveRole(role);
    // Auto-fill for hackathon testing convenience
    setFormData({
      email: `${role.toLowerCase()}@medclinic.com`,
      password: "password123",
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  return (
    <div className="min-h-screen flex w-full font-sans">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex flex-col flex-1 bg-gradient-to-br from-teal-500 to-blue-500 relative overflow-hidden items-center justify-center p-12 text-center text-white">
        {/* Decorative Circles */}
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
            Intelligent clinic management with AI-powered diagnostics. Digitize
            your workflow today.
          </p>

          {/* Stats */}
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

      {/* Right Column - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white p-8 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              Welcome back
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              Sign in to access your clinic dashboard
            </p>
          </div>

          {isError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
              {message}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Role Helper for Testing */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-3 tracking-wider">
                Login As
              </label>
              <div className="flex bg-slate-100 p-1 rounded-full w-fit">
                {["Admin", "Doctor", "Receptionist", "Patient"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelection(role)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      activeRole === role
                        ? "bg-teal-500 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
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
                  placeholder="doctor@medclinic.com"
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
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={18} /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="text-center text-sm">
            <span className="text-slate-500">Don't have an account? </span>
            <Link
              to="/signup"
              className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
