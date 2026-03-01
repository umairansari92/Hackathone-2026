import { useGetPrescriptionsQuery } from "../store/prescriptionApiSlice";
import { useSelector } from "react-redux";
import {
  FileText,
  Download,
  Activity,
  Calendar,
  Link as LinkIcon,
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
            width: 36,
            height: 36,
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
          padding: "32px",
          textAlign: "center",
          color: "#dc2626",
          background: "#fef2f2",
          borderRadius: 16,
          border: "1px solid #fecaca",
        }}
      >
        Error loading prescriptions: {error?.data?.message || "Unknown error"}
      </div>
    );

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", paddingBottom: 48 }}>
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: 28,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "1.65rem",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 4,
            }}
          >
            Prescription Archive
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
            {user?.role === "Patient"
              ? "Access and download your medical prescriptions."
              : "Repository of all prescriptions issued by the clinic."}
          </p>
        </div>
        {user?.role === "Doctor" && (
          <Link to="/prescriptions/new" style={{ textDecoration: "none" }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                background: "linear-gradient(135deg, #0d9488, #0ea5e9)",
                color: "white",
                border: "none",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: "0.875rem",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 4px 14px rgba(13,148,136,0.3)",
              }}
            >
              <FileText size={16} /> Write New Rx
            </button>
          </Link>
        )}
      </motion.div>

      {/* ── Table Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.9)",
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <FileText size={18} color="#0d9488" />
          <h3
            style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}
          >
            Issued Records
          </h3>
          <span
            style={{
              background: "#0d9488",
              color: "white",
              borderRadius: 20,
              fontSize: "0.65rem",
              fontWeight: 800,
              padding: "2px 8px",
            }}
          >
            {prescriptions?.length || 0}
          </span>
        </div>

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
                <th style={thStyle}>Date Issued</th>
                {user?.role !== "Patient" && <th style={thStyle}>Patient</th>}
                {user?.role !== "Doctor" && <th style={thStyle}>Doctor</th>}
                <th style={thStyle}>Medications</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions?.map((rx) => (
                <tr
                  key={rx._id}
                  style={{
                    borderTop: "1px solid #f1f5f9",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f8fafc88")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {/* Date */}
                  <td style={tdStyle}>
                    <p style={{ fontWeight: 700, color: "#1e293b" }}>
                      {dayjs(rx.createdAt).format("MMM DD, YYYY")}
                    </p>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        color: "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        marginTop: 2,
                      }}
                    >
                      <Calendar size={11} />{" "}
                      {dayjs(rx.createdAt).format("hh:mm A")}
                    </p>
                  </td>
                  {/* Patient */}
                  {user?.role !== "Patient" && (
                    <td style={tdStyle}>
                      <p style={{ fontWeight: 600, color: "#1e293b" }}>
                        {rx.patientId?.name || "Unknown"}
                      </p>
                      <p
                        style={{
                          fontSize: "0.68rem",
                          color: "#94a3b8",
                          fontFamily: "monospace",
                        }}
                      >
                        {rx.patientId?._id
                          ?.substring(rx.patientId._id.length - 6)
                          .toUpperCase() || "N/A"}
                      </p>
                    </td>
                  )}
                  {/* Doctor */}
                  {user?.role !== "Doctor" && (
                    <td style={tdStyle}>
                      <p style={{ fontWeight: 600, color: "#1e293b" }}>
                        Dr.{" "}
                        {rx.doctorId?.fullname?.split(" ")[1] ||
                          rx.doctorId?.fullname ||
                          "Unassigned"}
                      </p>
                      <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                        General Practice
                      </p>
                    </td>
                  )}
                  {/* Medicines */}
                  <td style={tdStyle}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {rx.medicines?.slice(0, 2).map((med, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: "3px 9px",
                            background: "#eff6ff",
                            border: "1px solid #bfdbfe",
                            borderRadius: 8,
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            color: "#2563eb",
                            maxWidth: 120,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {med.name}
                        </span>
                      ))}
                      {rx.medicines?.length > 2 && (
                        <span
                          style={{
                            padding: "3px 9px",
                            background: "#f1f5f9",
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            color: "#64748b",
                          }}
                        >
                          +{rx.medicines.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  {/* Actions */}
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 6,
                        justifyContent: "flex-end",
                      }}
                    >
                      {user?.role === "Patient" && (
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "5px 12px",
                            border: "1px solid #a7f3d0",
                            background: "#ecfdf5",
                            color: "#059669",
                            borderRadius: 9,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          <Activity size={12} /> AI Explain
                        </button>
                      )}
                      {rx.pdfUrl ? (
                        <a
                          href={rx.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "5px 12px",
                            border: "1px solid #bfdbfe",
                            background: "#eff6ff",
                            color: "#2563eb",
                            borderRadius: 9,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            textDecoration: "none",
                          }}
                        >
                          <Download size={12} /> PDF
                        </a>
                      ) : (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "5px 12px",
                            border: "1px solid #e2e8f0",
                            background: "#f8fafc",
                            color: "#94a3b8",
                            borderRadius: 9,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                          }}
                        >
                          <Download size={12} /> No PDF
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {(!prescriptions || prescriptions.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    style={{ padding: "48px", textAlign: "center" }}
                  >
                    <FileText
                      size={40}
                      style={{ margin: "0 auto 12px", color: "#e2e8f0" }}
                    />
                    <p style={{ fontWeight: 700, color: "#64748b" }}>
                      No prescriptions found
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#94a3b8",
                        marginTop: 4,
                      }}
                    >
                      {user?.role === "Patient"
                        ? "You have no medical records on file."
                        : "No prescriptions issued yet."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

const thStyle = {
  padding: "11px 22px",
  textAlign: "left",
  fontSize: "0.65rem",
  fontWeight: 700,
  color: "#94a3b8",
  letterSpacing: "0.07em",
};
const tdStyle = { padding: "13px 22px" };

export default PrescriptionsList;
