import { useGetPrescriptionsQuery } from "../store/prescriptionApiSlice";
import { useSelector } from "react-redux";
import {
  FileText,
  Download,
  Calendar,
  Stethoscope,
  ShieldCheck,
  Brain,
  FileCheck,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const PrescriptionsList = () => {
  const {
    data: prescriptions,
    isLoading,
    isError,
    error,
  } = useGetPrescriptionsQuery();
  const { user } = useSelector((state) => state.auth);

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

  if (isLoading)
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, background: "#f0fdfa", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: "2px solid #e0f2fe", animation: "spin 0.8s linear infinite" }}>
            <FileText size={24} color="#14b8a6" />
          </div>
          <p style={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Retrieving Clinical Records...
          </p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#dc2626", background: "linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(220, 38, 38, 0.05))", borderRadius: 20, border: "1px solid rgba(239, 68, 68, 0.2)" }}>
        <FileText size={40} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
        <p style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: 6 }}>Clinical Records Synchronization Failed</p>
        <p style={{ fontSize: "0.9rem", color: "#991b1b" }}>{error?.data?.message || "Unknown error"}</p>
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

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 10 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0d9488", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <FileCheck size={14} /> Prescription Dossier
          </p>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#0f172a", marginBottom: 8, lineHeight: 1.1 }}>
            Clinical <span style={{ background: "linear-gradient(135deg, #0d9488 0%, #059669 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Archive</span>
          </h1>
          <p style={{ fontSize: "1rem", color: "#64748b", maxWidth: 600 }}>
            Access and audit all clinical directives and pharmacological interventions.
          </p>
        </motion.div>

        {prescriptions?.length === 0 ? (
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{
            background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)",
            border: "2px dashed #e2e8f0", borderRadius: 24, padding: 60, textAlign: "center",
          }}>
            <FileText size={48} style={{ margin: "0 auto 16px", color: "#cbd5e1", opacity: 0.4 }} />
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Dossier Initialized</h3>
            <p style={{ fontSize: "0.95rem", color: "#94a3b8" }}>Your pharmacological record registry is currently empty.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 24,
            }}
          >
            {prescriptions?.map((rx, idx) => (
              <motion.div key={rx._id} variants={itemVariants}
                style={{
                  background: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.9)",
                  borderRadius: 20,
                  padding: 24,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)";
                }}
              >
                {/* Header Section */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Registry ID</span>
                      <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#0d9488", background: "#ecfdf5", padding: "3px 8px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Verified Session</span>
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: 6, fontStyle: "italic" }}>
                      {user?.role === "Patient"
                        ? `Dr. ${rx.doctorId?.fullname}`
                        : `Patient: ${rx.patientId?.name}`}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Calendar size={12} color="#0d9488" />
                        {dayjs(rx.createdAt).format("MMM DD, YYYY")}
                      </span>
                      <span style={{ width: 4, height: 4, background: "#cbd5e1", borderRadius: "50%" }} />
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Stethoscope size={12} color="#0d9488" />
                        Clinical Audit
                      </span>
                    </div>
                  </div>
                  <div style={{ width: 48, height: 48, background: "#f0fdfa", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(13, 148, 136, 0.2)" }}>
                    <FileText size={24} color="#0d9488" />
                  </div>
                </div>

                {/* Medications Section */}
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                    Regimen Highlights
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {rx.medicines?.slice(0, 4).map((med, i) => (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "6px 12px", background: "#f8fafc", border: "1px solid #e2e8f0",
                        borderRadius: 10, fontSize: "0.75rem", fontWeight: 700, color: "#475569",
                      }}>
                        <span style={{ width: 6, height: 6, background: "#0d9488", borderRadius: "50%" }} />
                        {med.name}
                        {med.dosage && <span style={{ color: "#94a3b8" }}> • {med.dosage}</span>}
                      </div>
                    ))}
                    {rx.medicines?.length > 4 && (
                      <div style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "6px 12px", background: "#f1f5f9", border: "1px solid #e2e8f0",
                        borderRadius: 10, fontSize: "0.7rem", fontWeight: 700, color: "#64748b",
                      }}>
                        +{rx.medicines.length - 4} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                  {user?.role === "Patient" && (
                    <button style={{
                      flex: 1, padding: "8px 12px", borderRadius: 10, border: "1px solid #e2e8f0",
                      background: "#f0fdfa", color: "#0d9488", fontSize: "0.75rem", fontWeight: 700,
                      fontFamily: "inherit", cursor: "pointer", display: "flex", alignItems: "center",
                      justifyContent: "center", gap: 6, transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.background = "#dcf8f5"; e.currentTarget.borderColor = "#a7f3d0"; }}
                    onMouseLeave={(e) => { e.currentTarget.background = "#f0fdfa"; e.currentTarget.borderColor = "#e2e8f0"; }}>
                      <Brain size={13} /> AI Synopsis
                    </button>
                  )}
                  {rx.pdfUrl ? (
                    <a href={rx.pdfUrl} target="_blank" rel="noopener noreferrer"
                      style={{
                        flex: 1, padding: "8px 12px", borderRadius: 10, border: "none",
                        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "white",
                        fontSize: "0.75rem", fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        textDecoration: "none", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.3)",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.background = "linear-gradient(135deg, #0d9488 0%, #059669 100%)"; }}
                      onMouseLeave={(e) => { e.currentTarget.background = "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"; }}>
                        <Download size={13} /> View Dossier
                    </a>
                  ) : (
                    <div style={{
                      flex: 1, padding: "8px 12px", borderRadius: 10,
                      background: "#f1f5f9", color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      fontStyle: "italic",
                    }}>
                      Dossier Locked
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionsList;
