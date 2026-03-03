import { useState } from "react";
import { useGetPatientsQuery } from "../store/patientApiSlice";
import {
  Users,
  Search,
  Activity,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";

const PatientsList = () => {
  const { data: patients, isLoading, isError, error } = useGetPatientsQuery();
  const [search, setSearch] = useState("");

  const filtered = patients?.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.contact?.includes(search),
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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

  if (isError)
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#dc2626",
          background:
            "linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(220, 38, 38, 0.05))",
          borderRadius: 16,
          border: "1px solid rgba(239, 68, 68, 0.2)",
        }}
      >
        <Heart size={40} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
        <p style={{ fontWeight: 700, fontSize: "1.05rem" }}>
          Error loading patients
        </p>
        <p style={{ fontSize: "0.9rem", marginTop: 6, color: "#991b1b" }}>
          {error?.data?.message || "Unknown error"}
        </p>
      </div>
    );

  const avatarColors = [
    "#0d9488",
    "#3b82f6",
    "#8b5cf6",
    "#f59e0b",
    "#10b981",
    "#ef4444",
  ];
  const bgGradients = [
    "from-teal-50 to-emerald-50",
    "from-blue-50 to-indigo-50",
    "from-purple-50 to-violet-50",
    "from-amber-50 to-orange-50",
    "from-green-50 to-emerald-50",
    "from-red-50 to-rose-50",
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", paddingBottom: 48 }}>
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
          Patient Directory
        </h2>
        <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: 20 }}>
          Manage and view all {filtered?.length || 0} registered patients
        </p>

        {/* Search Bar */}
        <div style={{ position: "relative", maxWidth: 400 }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or contact..."
            style={{
              width: "100%", paddingLeft: 40, paddingRight: 14, paddingTop: 11, paddingBottom: 11,
              border: "1.5px solid #e2e8f0", borderRadius: 14, fontSize: "0.9rem", fontFamily: "inherit",
              outline: "none", background: "rgba(255,255,255,0.8)", boxSizing: "border-box",
              backdropFilter: "blur(8px)", transition: "all 0.2s",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#0d9488"; e.target.style.boxShadow = "0 0 0 3px rgba(13, 148, 136, 0.1)"; }}
            onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
          />
        </div>
      </motion.div>

      {/* ── Cards Grid ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 20,
        }}
      >
        {filtered?.map((patient, idx) => {
          const color = avatarColors[idx % avatarColors.length];
          const initial = patient.name?.charAt(0)?.toUpperCase() || "P";

          return (
            <motion.div key={patient._id} variants={itemVariants}
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.9)",
                borderRadius: 18,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.05)";
              }}
            >
              {/* Header with gradient */}
              <div style={{
                height: 80,
                background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
                borderBottom: `2px solid ${color}`,
                position: "relative",
              }}>
                <div style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  boxShadow: `0 6px 16px ${color}40`,
                }}>
                  {initial}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: 18 }}>
                {/* Name */}
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>
                  {patient.name}
                </h3>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 12, fontFamily: "monospace" }}>
                  ID: {patient._id?.substring(patient._id.length - 6).toUpperCase()}
                </p>

                {/* Info Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                  <div style={{ padding: "8px 10px", background: "#f8fafc", borderRadius: 10 }}>
                    <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginBottom: 2 }}>Age</p>
                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1e293b" }}>{patient.age || "N/A"}</p>
                  </div>
                  <div style={{ padding: "8px 10px", background: "#f8fafc", borderRadius: 10 }}>
                    <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginBottom: 2 }}>Gender</p>
                    <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1e293b" }}>{patient.gender || "N/A"}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 12, marginTop: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Phone size={14} color={color} />
                    <span style={{ fontSize: "0.85rem", color: "#475569", fontWeight: 600 }}>{patient.contact || "N/A"}</span>
                  </div>
                  {patient.email && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Mail size={14} color={color} />
                      <span style={{ fontSize: "0.8rem", color: "#475569", overflow: "hidden", textOverflow: "ellipsis" }}>{patient.email}</span>
                    </div>
                  )}
                  {patient.address && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <MapPin size={14} color={color} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: "0.8rem", color: "#475569", lineHeight: 1.4 }}>{patient.address}</span>
                    </div>
                  )}
                </div>

                {/* Registered By */}
                <div style={{ borderTop: "1px solid #f1f5f9", marginTop: 12, paddingTop: 12 }}>
                  <p style={{ fontSize: "0.7rem", color: "#94a3b8", marginBottom: 4 }}>Registered by</p>
                  <span style={{ display: "inline-block", padding: "4px 10px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: "0.75rem", fontWeight: 600, color: "#64748b" }}>
                    {patient.createdBy?.fullname || "System"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #f1f5f9", background: "#f8fafc88" }}>
                <button style={{
                  flex: 1, padding: "8px 12px", borderRadius: 10, border: "1px solid #e2e8f0", background: "white",
                  color: "#6366f1", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.background = "#e0e7ff"; e.currentTarget.borderColor = "#818cf8"; }}
                onMouseLeave={(e) => { e.currentTarget.background = "white"; e.currentTarget.borderColor = "#e2e8f0"; }}>
                  <Activity size={14} /> Timeline
                </button>
                <button style={{
                  flex: 1, padding: "8px 12px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                  color: "white", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  transition: "all 0.2s", boxShadow: `0 4px 12px ${color}40`,
                }}
                onMouseEnter={(e) => { e.currentTarget.transform = "scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.transform = "scale(1)"; }}>
                  <Calendar size={14} /> Book
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Empty State */}
      {(!filtered || filtered.length === 0) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
          padding: "60px 32px", textAlign: "center",
          background: "rgba(255,255,255,0.5)", backdropFilter: "blur(8px)",
          borderRadius: 20, border: "1px solid rgba(13, 148, 136, 0.1)",
        }}>
          <Users size={48} style={{ margin: "0 auto 16px", color: "#cbd5e1", opacity: 0.6 }} />
          <h3 style={{ fontWeight: 700, color: "#64748b", marginBottom: 6 }}>
            {search ? "No patients found" : "No patients yet"}
          </h3>
          <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
            {search ? `Try adjusting your search terms` : "Start by registering your first patient"}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PatientsList;
