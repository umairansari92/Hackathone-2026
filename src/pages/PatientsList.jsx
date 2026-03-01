import { useState } from "react";
import { useGetPatientsQuery } from "../store/patientApiSlice";
import { Users, Search, Activity, Calendar, Phone } from "lucide-react";
import { motion } from "framer-motion";

const PatientsList = () => {
  const { data: patients, isLoading, isError, error } = useGetPatientsQuery();
  const [search, setSearch] = useState("");

  const filtered = patients?.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.contact?.includes(search),
  );

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
        Error loading patients: {error?.data?.message || "Unknown error"}
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
            Patient Directory
          </h2>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
            View and manage all registered clinic patients.
          </p>
        </div>
        {/* Search */}
        <div style={{ position: "relative" }}>
          <Search
            size={15}
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
            placeholder="Search by name or contact..."
            style={{
              paddingLeft: 36,
              paddingRight: 14,
              paddingTop: 9,
              paddingBottom: 9,
              border: "1.5px solid #e2e8f0",
              borderRadius: 12,
              fontSize: "0.875rem",
              fontFamily: "inherit",
              outline: "none",
              background: "white",
              minWidth: 240,
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
        </div>
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
          <Users size={18} color="#0d9488" />
          <h3
            style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}
          >
            Registered Patients
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
            {filtered?.length || 0}
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
                {[
                  "PATIENT INFO",
                  "DEMOGRAPHICS",
                  "CONTACT",
                  "REGISTERED BY",
                  "ACTIONS",
                ].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 22px",
                      textAlign: i === 4 ? "right" : "left",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: "#94a3b8",
                      letterSpacing: "0.07em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered?.map((patient, idx) => {
                const color = avatarColors[idx % avatarColors.length];
                return (
                  <tr
                    key={patient._id}
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
                    {/* Patient Info */}
                    <td style={{ padding: "13px 22px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: `linear-gradient(135deg, ${color}, ${color}bb)`,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "0.9rem",
                            flexShrink: 0,
                          }}
                        >
                          {patient.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, color: "#1e293b" }}>
                            {patient.name}
                          </p>
                          <p
                            style={{
                              fontSize: "0.68rem",
                              color: "#94a3b8",
                              fontFamily: "monospace",
                            }}
                          >
                            ID:{" "}
                            {patient._id
                              ?.substring(patient._id.length - 6)
                              .toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Demographics */}
                    <td style={{ padding: "13px 22px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <span
                          style={{
                            padding: "3px 9px",
                            background: "#f1f5f9",
                            borderRadius: 8,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            color: "#475569",
                          }}
                        >
                          {patient.age} yrs
                        </span>
                        <span
                          style={{
                            padding: "3px 9px",
                            background: "#f1f5f9",
                            borderRadius: 8,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            color: "#475569",
                          }}
                        >
                          {patient.gender}
                        </span>
                      </div>
                    </td>
                    {/* Contact */}
                    <td style={{ padding: "13px 22px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          color: "#475569",
                          fontWeight: 500,
                        }}
                      >
                        <Phone size={13} color="#94a3b8" />
                        {patient.contact}
                      </div>
                    </td>
                    {/* Registered By */}
                    <td style={{ padding: "13px 22px" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                          borderRadius: 8,
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          color: "#64748b",
                        }}
                      >
                        {patient.createdBy?.fullname || "System"}
                      </span>
                    </td>
                    {/* Actions */}
                    <td style={{ padding: "13px 22px", textAlign: "right" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          title="View Timeline"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 9,
                            border: "1px solid #e2e8f0",
                            background: "white",
                            color: "#64748b",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#818cf8";
                            e.currentTarget.style.color = "#6366f1";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e2e8f0";
                            e.currentTarget.style.color = "#64748b";
                          }}
                        >
                          <Activity size={15} />
                        </button>
                        <button
                          title="Book Appointment"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 9,
                            border: "1px solid #e2e8f0",
                            background: "white",
                            color: "#64748b",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#a7f3d0";
                            e.currentTarget.style.color = "#0d9488";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e2e8f0";
                            e.currentTarget.style.color = "#64748b";
                          }}
                        >
                          <Calendar size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {(!filtered || filtered.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    style={{ padding: "48px", textAlign: "center" }}
                  >
                    <Users
                      size={40}
                      style={{ margin: "0 auto 12px", color: "#e2e8f0" }}
                    />
                    <p style={{ fontWeight: 700, color: "#64748b" }}>
                      No patients found
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#94a3b8",
                        marginTop: 4,
                      }}
                    >
                      The directory is currently empty.
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

export default PatientsList;
