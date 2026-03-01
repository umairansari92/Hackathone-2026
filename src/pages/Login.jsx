import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login, reset } from "../store/userSlice";
import { Stethoscope, Eye, EyeOff, LogIn } from "lucide-react";

const ROLES = ["Admin", "Doctor", "Receptionist", "Patient"];

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState("Doctor");

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
    { label: "Admin", role: "Admin", email: "admin@smartcare.com", icon: "🛡️" },
    {
      label: "Doctor",
      role: "Doctor",
      email: "ahmed.khan@smartcare.com",
      icon: "🩺",
    },
    {
      label: "Receptionist",
      role: "Receptionist",
      email: "reception1@smartcare.com",
      icon: "💼",
    },
    {
      label: "Patient",
      role: "Patient",
      email: "patient@smartcare.com",
      icon: "👤",
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

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        width: "100%",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* ── LEFT PANEL – Teal gradient ──────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #0d9488 0%, #38bdf8 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem",
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
        className="hidden lg:flex"
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -60,
            left: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -60,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.08)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 340 }}>
          {/* Stethoscope icon box */}
          <div
            style={{
              width: 80,
              height: 80,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem",
              backdropFilter: "blur(8px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}
          >
            <Stethoscope size={40} color="white" />
          </div>

          <h1
            style={{
              fontSize: "2.4rem",
              fontWeight: 800,
              marginBottom: "1rem",
              letterSpacing: "-0.5px",
            }}
          >
            Al Shifa Hospital
          </h1>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.85)",
              marginBottom: "3rem",
            }}
          >
            Intelligent clinic management with AI-powered diagnostics. Digitize
            your workflow today.
          </p>

          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1.5rem",
              borderTop: "1px solid rgba(255,255,255,0.25)",
              paddingTop: "2rem",
            }}
          >
            {[
              { value: "1200+", label: "Patients" },
              { value: "98%", label: "Accuracy" },
              { value: "4 Roles", label: "RBAC" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "rgba(255,255,255,0.7)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL – Form ──────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
          padding: "3rem 2rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: 440 }}>
          {/* Heading */}
          <div style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: 6,
              }}
            >
              Welcome back
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Sign in to access your clinic dashboard
            </p>
          </div>

          {/* Error banner */}
          {isError && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                borderRadius: 10,
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
                marginBottom: "1.5rem",
              }}
            >
              {message || "Invalid credentials. Please try again."}
            </div>
          )}

          <form onSubmit={onSubmit}>
            {/* Login As label */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}
              >
                Login As
              </p>
              {/* Pill tab switcher */}
              <div
                style={{
                  display: "inline-flex",
                  background: "#f1f5f9",
                  padding: 4,
                  borderRadius: 999,
                  gap: 2,
                }}
              >
                {ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                    style={{
                      padding: "6px 16px",
                      borderRadius: 999,
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                      background:
                        activeRole === role ? "#0d9488" : "transparent",
                      color: activeRole === role ? "#ffffff" : "#64748b",
                      boxShadow:
                        activeRole === role
                          ? "0 2px 8px rgba(13,148,136,0.3)"
                          : "none",
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 6,
                }}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                placeholder="doctor@medclinic.com"
                style={{
                  width: "100%",
                  padding: "0.7rem 1rem",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 10,
                  fontSize: "0.95rem",
                  color: "#1e293b",
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                  background: "#f8fafc",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1.75rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "0.7rem 3rem 0.7rem 1rem",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 10,
                    fontSize: "0.95rem",
                    color: "#1e293b",
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                    background: "#f8fafc",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Sign In button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.85rem",
                background: isLoading ? "#5eada8" : "#0d9488",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontSize: "1rem",
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 4px 14px rgba(13,148,136,0.35)",
                transition: "all 0.2s ease",
              }}
            >
              {isLoading ? (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: "3px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>

            {/* ── Demo Accounts Panel ── */}
            <div style={{ marginTop: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    whiteSpace: "nowrap",
                  }}
                >
                  Demo Accounts
                </span>
                <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {DEMO_ACCOUNTS.map((acct) => {
                  const colors =
                    {
                      Admin: {
                        bg: "#fef3c7",
                        border: "#fde68a",
                        color: "#92400e",
                      },
                      Doctor: {
                        bg: "#ecfdf5",
                        border: "#a7f3d0",
                        color: "#065f46",
                      },
                      Receptionist: {
                        bg: "#eff6ff",
                        border: "#bfdbfe",
                        color: "#1e40af",
                      },
                      Patient: {
                        bg: "#f5f3ff",
                        border: "#ddd6fe",
                        color: "#5b21b6",
                      },
                    }[acct.role] || {};
                  return (
                    <button
                      key={acct.role}
                      type="button"
                      onClick={() => handleDemoLogin(acct)}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: `1.5px solid ${colors.border}`,
                        background: colors.bg,
                        color: colors.color,
                        fontWeight: 700,
                        fontSize: "0.78rem",
                        fontFamily: "inherit",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        justifyContent: "center",
                        transition: "opacity 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.opacity = "0.75")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = "1")
                      }
                    >
                      <span>{acct.icon}</span> {acct.label}
                    </button>
                  );
                })}
              </div>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.7rem",
                  color: "#cbd5e1",
                  marginTop: 8,
                }}
              >
                Password: <strong style={{ color: "#94a3b8" }}>demo1234</strong>
              </p>
            </div>
          </form>

          {/* Footer */}
          <p
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontSize: "0.875rem",
              color: "#64748b",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "#0d9488",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
