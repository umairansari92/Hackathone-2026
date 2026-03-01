import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signup, reset } from "../store/userSlice";
import { Stethoscope, Eye, EyeOff, UserPlus, Camera } from "lucide-react";

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

  /* ── shared input style ── */
  const inputStyle = {
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
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
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
            Join thousands of healthcare professionals using AI-powered tools to
            deliver smarter patient care.
          </p>

          {/* Feature stats row */}
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

      {/* ── RIGHT PANEL – Signup Form ────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
          padding: "3rem 2rem",
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: 460 }}>
          {/* Heading */}
          <div style={{ marginBottom: "1.75rem" }}>
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: 6,
              }}
            >
              Create your account
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Set up your profile to get started with Al Shifa Hospital
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
              {message || "Something went wrong. Please try again."}
            </div>
          )}

          <form onSubmit={onSubmit}>
            {/* Avatar Upload */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ position: "relative", cursor: "pointer" }}>
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    border: imagePreview
                      ? "3px solid #0d9488"
                      : "2.5px dashed #cbd5e1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    background: "#f8fafc",
                    transition: "border-color 0.2s",
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Camera size={28} color="#94a3b8" />
                  )}
                </div>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={onFileChange}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                />
              </div>
              <p
                style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 8 }}
              >
                {imagePreview
                  ? "Tap to change photo"
                  : "Upload profile photo (optional)"}
              </p>
            </div>

            {/* Full Name */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                name="fullname"
                value={fullname}
                onChange={onChange}
                required
                placeholder="e.g. Dr. Sarah Khan"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                placeholder="sarah@medclinic.com"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  minLength="6"
                  placeholder="Minimum 6 characters"
                  style={{ ...inputStyle, paddingRight: "3rem" }}
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

            {/* Gender + Role in 2 cols */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.75rem",
              }}
            >
              {/* Gender */}
              <div>
                <label style={labelStyle}>Gender</label>
                <div style={{ position: "relative" }}>
                  <select
                    name="gender"
                    value={gender}
                    onChange={onChange}
                    style={{
                      ...inputStyle,
                      paddingRight: "2.5rem",
                      appearance: "none",
                      cursor: "pointer",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <div
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#94a3b8",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Role */}
              <div>
                <label style={labelStyle}>Account Role</label>
                <div style={{ position: "relative" }}>
                  <select
                    name="role"
                    value={role}
                    onChange={onChange}
                    style={{
                      ...inputStyle,
                      paddingRight: "2.5rem",
                      appearance: "none",
                      cursor: "pointer",
                      color: "#0d9488",
                      fontWeight: 700,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  >
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Receptionist">Receptionist</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <div
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#0d9488",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit button */}
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
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
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
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#0d9488",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
