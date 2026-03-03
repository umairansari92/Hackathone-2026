import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Stethoscope,
  Plus,
  Trash2,
  Ban,
  CheckCircle,
  Search,
  X,
  Eye,
  EyeOff,
  Mail,
  Award,
} from "lucide-react";
import {
  useGetAllUsersQuery,
  useCreateDoctorMutation,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
} from "../store/userApiSlice";

const SPECIALIZATIONS = [
  "Cardiologist",
  "Neurologist",
  "Dermatologist",
  "Orthopedic",
  "Pediatrician",
  "General Physician",
  "Psychiatrist",
  "ENT Specialist",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ManageDoctors = () => {
  const {
    data: doctors = [],
    isLoading,
    refetch,
  } = useGetAllUsersQuery("Doctor");
  const [createDoctor, { isLoading: creating }] = useCreateDoctorMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateRole] = useUpdateUserRoleMutation();

  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    gender: "Male",
    specialization: "General Physician",
  });

  const filtered = doctors.filter(
    (d) =>
      d.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      d.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createDoctor(form).unwrap();
      toast.success(`✅ Dr. ${form.fullname} added successfully!`);
      setShowModal(false);
      setForm({
        fullname: "",
        email: "",
        password: "",
        gender: "Male",
        specialization: "General Physician",
      });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add doctor");
    }
  };

  const handleSuspend = async (doc) => {
    try {
      await updateRole({ id: doc._id, role: "Patient" }).unwrap();
      toast.error(`Dr. ${doc.fullname} has been suspended`);
      refetch();
    } catch {
      toast.error("Failed to suspend doctor");
    }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete ${doc.fullname}? This is permanent.`)) return;
    try {
      await deleteUser(doc._id).unwrap();
      toast.success("Doctor deleted");
      refetch();
    } catch {
      toast.error("Failed to delete doctor");
    }
  };

  if (isLoading)
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, background: "#f0fdfa", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: "2px solid #e0f2fe", animation: "spin 0.8s linear infinite" }}>
            <Stethoscope size={24} color="#0d9488" />
          </div>
          <p style={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Loading Doctors...
          </p>
        </div>
      </div>
    );

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", minHeight: "100vh", background: "#f8fafc", padding: "40px 20px", color: "#0f172a" }}>
      {/* Background Orbs */}
      <div style={{
        position: "fixed", top: "-10%", right: "-10%", width: 500, height: 500,
        background: "radial-gradient(circle, rgba(13, 148, 136, 0.1) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: "-10%", left: "-10%", width: 400, height: 400,
        background: "radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 10 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0d9488", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <Stethoscope size={14} /> Medical Staff
            </p>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a", marginBottom: 8 }}>
              Manage Doctors
            </h1>
            <p style={{ fontSize: "0.95rem", color: "#64748b" }}>Add, edit, or suspend doctor accounts</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              background: "#0d9488",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: "0.9rem",
              fontFamily: "inherit",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(13,148,136,0.3)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.transform = "translateY(-2px)"; e.currentTarget.boxShadow = "0 8px 20px rgba(13,148,136,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.transform = "translateY(0)"; e.currentTarget.boxShadow = "0 4px 12px rgba(13,148,136,0.3)"; }}
          >
            <Plus size={18} /> Add Doctor
          </button>
        </motion.div>

        {/* Search Bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: 24 }}>
          <div style={{ position: "relative", maxWidth: 400 }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor name or email..."
              style={{
                width: "100%",
                paddingLeft: 40,
                paddingRight: 16,
                paddingTop: 10,
                paddingBottom: 10,
                border: "1.5px solid #e2e8f0",
                borderRadius: 12,
                fontSize: "0.9rem",
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
                background: "rgba(255,255,255,0.8)",
                transition: "all 0.2s",
              }}
              onFocus={(e) => { e.currentTarget.borderColor = "#0d9488"; e.currentTarget.boxShadow = "0 0 0 3px rgba(13,148,136,0.1)"; }}
              onBlur={(e) => { e.currentTarget.borderColor = "#e2e8f0"; e.currentTarget.boxShadow = "none"; }}
            />
          </div>
        </motion.div>

        {/* Doctor Cards Grid */}
        {filtered?.length === 0 ? (
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{
            background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)",
            border: "2px dashed #e2e8f0", borderRadius: 24, padding: 60, textAlign: "center",
          }}>
            <Stethoscope size={48} style={{ margin: "0 auto 16px", color: "#cbd5e1", opacity: 0.4 }} />
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>No Doctors Found</h3>
            <p style={{ fontSize: "0.95rem", color: "#94a3b8" }}>Add your first doctor to get started.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {filtered?.map((doc) => {
              const colors = ["#0d9488", "#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"];
              const colorIndex = doc._id?.charCodeAt(0) % colors.length;
              const color = colors[colorIndex];

              return (
                <motion.div key={doc._id} variants={itemVariants}
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.9)",
                    borderRadius: 18,
                    padding: 20,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)";
                  }}
                >
                  {/* Avatar & Name */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 4 }}>
                    <div style={{
                      width: 54, height: 54, borderRadius: 14, background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontWeight: 800, fontSize: "1.4rem",
                      boxShadow: `0 4px 12px ${color}40`,
                      flexShrink: 0,
                    }}>
                      {doc.fullname?.charAt(0)?.toUpperCase() || "D"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>
                        {doc.fullname}
                      </h3>
                      <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0d9488", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Dr.
                      </p>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: 10 }}>
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", marginBottom: 3, display: "flex", alignItems: "center", gap: 5 }}>
                      <Award size={12} /> Specialization
                    </p>
                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a" }}>
                      {doc.specialization || "General Physician"}
                    </p>
                  </div>

                  {/* Email */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 6, borderTop: "1px solid #f1f5f9" }}>
                    <Mail size={13} style={{ color: "#94a3b8" }} />
                    <p style={{ fontSize: "0.8rem", color: "#64748b", wordBreak: "break-all" }}>
                      {doc.email}
                    </p>
                  </div>

                  {/* Plan Badge */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: 8,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      background: doc.subscriptionPlan === "Pro" ? "#ede9fe" : "#f1f5f9",
                      color: doc.subscriptionPlan === "Pro" ? "#7c3aed" : "#64748b",
                      border: doc.subscriptionPlan === "Pro" ? "1px solid #c4b5fd" : "1px solid #e2e8f0",
                    }}>
                      {doc.subscriptionPlan || "Free"}
                    </span>
                    <span style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "#0d9488",
                      textTransform: "uppercase",
                    }}>
                      {doc.role}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 8 }}>
                    <button
                      onClick={() => handleSuspend(doc)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: 10,
                        border: "1.5px solid #fde68a",
                        background: "#fffbeb",
                        color: "#d97706",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.background = "#fef3c7"; }}
                      onMouseLeave={(e) => { e.currentTarget.background = "#fffbeb"; }}
                    >
                      <Ban size={13} style={{ marginRight: 4, display: "inline" }} /> Suspend
                    </button>
                    <button
                      onClick={() => handleDelete(doc)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: 10,
                        border: "1.5px solid #fecaca",
                        background: "#fef2f2",
                        color: "#dc2626",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.background = "#fee2e2"; }}
                      onMouseLeave={(e) => { e.currentTarget.background = "#fef2f2"; }}
                    >
                      <Trash2 size={13} style={{ marginRight: 4, display: "inline" }} /> Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Add Doctor Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 32,
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Add New Doctor
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={handleCreate}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              {[
                {
                  label: "Full Name",
                  name: "fullname",
                  type: "text",
                  placeholder: "Dr. Sarah Jenkins",
                },
                {
                  label: "Email",
                  name: "email",
                  type: "email",
                  placeholder: "doctor@clinic.com",
                },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 5,
                    }}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [name]: e.target.value }))
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 10,
                      fontSize: "0.875rem",
                      fontFamily: "inherit",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: 5,
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "9px 40px 9px 12px",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 10,
                      fontSize: "0.875rem",
                      fontFamily: "inherit",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    style={{
                      position: "absolute",
                      right: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94a3b8",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 5,
                    }}
                  >
                    Gender
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, gender: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 10,
                      fontSize: "0.875rem",
                      fontFamily: "inherit",
                      outline: "none",
                      background: "#fff",
                    }}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: 5,
                    }}
                  >
                    Specialization
                  </label>
                  <select
                    value={form.specialization}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, specialization: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 10,
                      fontSize: "0.875rem",
                      fontFamily: "inherit",
                      outline: "none",
                      background: "#fff",
                    }}
                  >
                    {SPECIALIZATIONS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={creating}
                style={{
                  marginTop: 4,
                  width: "100%",
                  padding: "11px",
                  background: creating ? "#5eada8" : "#0d9488",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  fontFamily: "inherit",
                  cursor: creating ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {creating ? (
                  "Adding..."
                ) : (
                  <>
                    <Plus size={16} /> Add Doctor
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
