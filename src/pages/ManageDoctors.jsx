import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Stethoscope,
  Plus,
  Edit3,
  Ban,
  CheckCircle,
  Search,
  X,
  Eye,
  EyeOff,
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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.35 },
  }),
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "3px solid #e2e8f0",
            borderTopColor: "#0d9488",
            animation: "spin 0.9s linear infinite",
          }}
        />
      </div>
    );

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", paddingBottom: 40 }}>
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        style={{ marginBottom: 24 }}
      >
        <h2
          style={{
            fontSize: "1.6rem",
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: 4,
          }}
        >
          Manage Doctors
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
          Add, edit, or suspend doctor accounts in your clinic
        </p>
      </motion.div>

      {/* Actions bar */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          gap: 12,
        }}
      >
        <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94a3b8",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctors..."
            style={{
              width: "100%",
              paddingLeft: 38,
              paddingRight: 12,
              paddingTop: 9,
              paddingBottom: 9,
              border: "1.5px solid #e2e8f0",
              borderRadius: 10,
              fontSize: "0.875rem",
              fontFamily: "inherit",
              outline: "none",
              boxSizing: "border-box",
              background: "#f8fafc",
            }}
          />
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 18px",
            background: "#0d9488",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: "0.875rem",
            fontFamily: "inherit",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(13,148,136,0.3)",
          }}
        >
          <Plus size={16} /> Add Doctor
        </button>
      </motion.div>

      {/* Table */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.9)",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.875rem",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["DOCTOR", "SPECIALIZATION", "EMAIL", "PLAN", "ACTIONS"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 20px",
                        textAlign: "left",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: "#94a3b8",
                        letterSpacing: "0.07em",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    No doctors found. Add one above ↑
                  </td>
                </tr>
              )}
              {filtered.map((doc, i) => (
                <tr
                  key={doc._id}
                  style={{ borderTop: "1px solid #f1f5f9" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f8fafc55")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={{ padding: "14px 20px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "#0d9488",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                          flexShrink: 0,
                        }}
                      >
                        {doc.fullname?.charAt(0) || "D"}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, color: "#1e293b" }}>
                          {doc.fullname}
                        </p>
                        <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                          {doc.role}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", color: "#475569" }}>
                    {doc.specialization || "—"}
                  </td>
                  <td style={{ padding: "14px 20px", color: "#475569" }}>
                    {doc.email}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 999,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        background:
                          doc.subscriptionPlan === "Pro"
                            ? "#ede9fe"
                            : "#f1f5f9",
                        color:
                          doc.subscriptionPlan === "Pro"
                            ? "#7c3aed"
                            : "#64748b",
                        border:
                          doc.subscriptionPlan === "Pro"
                            ? "1px solid #c4b5fd"
                            : "1px solid #e2e8f0",
                      }}
                    >
                      {doc.subscriptionPlan || "Free"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => handleSuspend(doc)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 8,
                          border: "1px solid #fde68a",
                          background: "#fffbeb",
                          color: "#d97706",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Ban size={12} /> Suspend
                      </button>
                      <button
                        onClick={() => handleDelete(doc)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 8,
                          border: "1px solid #fecaca",
                          background: "#fef2f2",
                          color: "#dc2626",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <X size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

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
