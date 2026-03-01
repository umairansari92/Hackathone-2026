import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  FileText,
  Download,
  ArrowLeft,
  User,
  Pill,
  CalendarDays,
  Stethoscope,
} from "lucide-react";
import {
  useGetPrescriptionByIdQuery,
  useGeneratePDFMutation,
} from "../store/prescriptionApiSlice";

const PrescriptionViewer = () => {
  const { id } = useParams();
  const {
    data: prescription,
    isLoading,
    error,
  } = useGetPrescriptionByIdQuery(id);
  const [generatePDF, { isLoading: generating }] = useGeneratePDFMutation();

  const handleDownload = async () => {
    try {
      if (prescription?.pdfUrl) {
        window.open(prescription.pdfUrl, "_blank");
        return;
      }
      const result = await generatePDF(id).unwrap();
      toast.success("📄 PDF generated! Opening now...");
      if (result?.pdfUrl) window.open(result.pdfUrl, "_blank");
    } catch {
      toast.error("Failed to generate PDF");
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

  if (error || !prescription)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p style={{ color: "#ef4444", fontWeight: 600 }}>
          Prescription not found.
        </p>
        <Link
          to="/prescriptions"
          style={{
            color: "#0d9488",
            fontWeight: 700,
            marginTop: 8,
            display: "inline-block",
          }}
        >
          ← Back to Prescriptions
        </Link>
      </div>
    );

  return (
    <div
      style={{
        fontFamily: "'Outfit', sans-serif",
        maxWidth: 760,
        margin: "0 auto",
        paddingBottom: 48,
      }}
    >
      {/* Back Nav */}
      <Link
        to="/prescriptions"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: "#64748b",
          textDecoration: "none",
          fontSize: "0.875rem",
          fontWeight: 600,
          marginBottom: 20,
          "&:hover": { color: "#0d9488" },
        }}
      >
        <ArrowLeft size={16} /> Back to Prescriptions
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.9)",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #0d9488, #0ea5e9)",
            padding: "24px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <FileText size={20} color="white" />
              <span
                style={{ color: "white", fontWeight: 700, fontSize: "1.1rem" }}
              >
                Medical Prescription
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.8rem" }}>
              Issued:{" "}
              {new Date(prescription.createdAt).toLocaleDateString("en-US", {
                dateStyle: "long",
              })}
            </p>
          </div>
          <button
            onClick={handleDownload}
            disabled={generating}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "9px 18px",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: 10,
              color: "white",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: generating ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            <Download size={16} />{" "}
            {generating
              ? "Generating..."
              : prescription?.pdfUrl
                ? "Download PDF"
                : "Generate PDF"}
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            padding: "28px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {/* Doctor & Patient */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <div
              style={{ background: "#f8fafc", borderRadius: 14, padding: 18 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "#0d9488",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Stethoscope size={15} color="white" />
                </div>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "#0d9488",
                  }}
                >
                  Prescribing Doctor
                </span>
              </div>
              <p style={{ fontWeight: 700, color: "#1e293b", marginBottom: 2 }}>
                {prescription.doctorId?.fullname || "N/A"}
              </p>
              <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                {prescription.doctorId?.email || "N/A"}
              </p>
            </div>

            <div
              style={{ background: "#f8fafc", borderRadius: 14, padding: 18 }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "#6366f1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User size={15} color="white" />
                </div>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "#6366f1",
                  }}
                >
                  Patient
                </span>
              </div>
              <p style={{ fontWeight: 700, color: "#1e293b", marginBottom: 2 }}>
                {prescription.patientId?.name || "N/A"}
              </p>
              <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                Age {prescription.patientId?.age} ·{" "}
                {prescription.patientId?.gender}
                {prescription.patientId?.contact &&
                  ` · ${prescription.patientId.contact}`}
              </p>
            </div>
          </div>

          {/* Medicines */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <Pill size={18} color="#0d9488" />
              <h3
                style={{ fontWeight: 700, color: "#1e293b", fontSize: "1rem" }}
              >
                Prescribed Medicines
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(prescription.medicines || []).map((med, i) => (
                <div
                  key={i}
                  style={{
                    background: "#f8fafc",
                    borderRadius: 12,
                    padding: "14px 18px",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontWeight: 700,
                        color: "#1e293b",
                        marginBottom: 3,
                      }}
                    >
                      <span style={{ color: "#0d9488", marginRight: 6 }}>
                        {i + 1}.
                      </span>
                      {typeof med === "string" ? med : med.name || "Unknown"}
                    </p>
                    {med.dosage && (
                      <p style={{ fontSize: "0.78rem", color: "#64748b" }}>
                        Dosage: {med.dosage}
                      </p>
                    )}
                    {med.frequency && (
                      <p style={{ fontSize: "0.78rem", color: "#64748b" }}>
                        Frequency: {med.frequency}
                      </p>
                    )}
                  </div>
                  {med.duration && (
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: "#ecfdf5",
                        color: "#059669",
                        border: "1px solid #a7f3d0",
                        flexShrink: 0,
                      }}
                    >
                      {med.duration}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          {prescription.instructions && (
            <div>
              <h3
                style={{
                  fontWeight: 700,
                  color: "#1e293b",
                  fontSize: "1rem",
                  marginBottom: 12,
                }}
              >
                📋 Instructions
              </h3>
              <div
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: 12,
                  padding: "14px 18px",
                }}
              >
                <p
                  style={{
                    color: "#92400e",
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                  }}
                >
                  {prescription.instructions}
                </p>
              </div>
            </div>
          )}

          {/* PDF status */}
          <div
            style={{
              borderTop: "1px solid #f1f5f9",
              paddingTop: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
              {prescription.pdfUrl
                ? "✅ PDF available"
                : "⏳ No PDF yet — click Generate PDF"}
            </p>
            {prescription.pdfUrl && (
              <a
                href={prescription.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "0.78rem",
                  color: "#0d9488",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Open PDF ↗
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrescriptionViewer;
