import { useState } from "react";
import { useGetSmartDiagnosisMutation } from "../store/aiApiSlice";
import { useForm } from "react-hook-form";
import {
  Brain,
  AlertTriangle,
  CheckCircle,
  Activity,
  FileText,
  Zap,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RISK_SC = {
  low: {
    bg: "#ecfdf5",
    color: "#059669",
    border: "#a7f3d0",
    label: "Low Risk",
  },
  medium: {
    bg: "#fffbeb",
    color: "#d97706",
    border: "#fde68a",
    label: "Medium Risk",
  },
  high: {
    bg: "#fff7ed",
    color: "#ea580c",
    border: "#fed7aa",
    label: "High Risk",
  },
  critical: {
    bg: "#fef2f2",
    color: "#dc2626",
    border: "#fecaca",
    label: "Critical Risk",
  },
};

const inputStyle = {
  width: "100%",
  padding: "0.65rem 0.9rem",
  border: "1.5px solid #e2e8f0",
  borderRadius: 10,
  fontSize: "0.875rem",
  color: "#1e293b",
  fontFamily: "inherit",
  outline: "none",
  background: "#f8fafc",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};
const labelStyle = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 5,
};

const SmartDiagnosis = () => {
  const { register, handleSubmit, reset } = useForm();
  const [getDiagnosis, { isLoading }] = useGetSmartDiagnosisMutation();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    try {
      setError(null);
      const res = await getDiagnosis(data).unwrap();
      setResult(res.data);
    } catch (err) {
      setError(
        "Failed to fetch diagnosis. AI may be down. Please proceed manually.",
      );
    }
  };

  const riskSc = RISK_SC[result?.riskLevel?.toLowerCase()] || RISK_SC.low;

  return (
    <div
      style={{
        fontFamily: "'Outfit', sans-serif",
        maxWidth: 960,
        margin: "0 auto",
        paddingBottom: 48,
      }}
    >
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #f59e0b, #fb923c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(245,158,11,0.35)",
              flexShrink: 0,
            }}
          >
            <Brain size={26} color="white" />
          </div>
          <div>
            <h2
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 3,
              }}
            >
              Smart Diagnosis Toolkit
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
              AI-powered clinical assessment assistant for doctors
            </p>
          </div>
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* ── Input Form Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          style={{
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.9)",
            borderRadius: 18,
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 20,
            }}
          >
            <Activity size={17} color="#0d9488" />
            <h3
              style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}
            >
              Patient Details
            </h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div>
                  <label style={labelStyle}>Age</label>
                  <input
                    type="number"
                    {...register("age")}
                    placeholder="e.g. 45"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Gender</label>
                  <div style={{ position: "relative" }}>
                    <select
                      {...register("gender")}
                      style={{
                        ...inputStyle,
                        appearance: "none",
                        paddingRight: "2.5rem",
                        cursor: "pointer",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    >
                      <option value="">Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown
                      size={15}
                      style={{
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#94a3b8",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Medical History</label>
                <textarea
                  {...register("history")}
                  rows={2}
                  placeholder="Past illnesses, chronic conditions, allergies..."
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                  onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 5,
                  }}
                >
                  <label style={{ ...labelStyle, marginBottom: 0 }}>
                    Current Symptoms
                  </label>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "#dc2626",
                      fontWeight: 700,
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                      borderRadius: 6,
                      padding: "1px 6px",
                    }}
                  >
                    Required
                  </span>
                </div>
                <textarea
                  {...register("symptoms", { required: true })}
                  rows={5}
                  placeholder="Describe the current symptoms in detail — onset, duration, severity, location..."
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                  onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "13px",
                  background: isLoading
                    ? "#fde68a"
                    : "linear-gradient(135deg, #f59e0b, #fb923c)",
                  color: isLoading ? "#92400e" : "white",
                  border: "none",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  boxShadow: isLoading
                    ? "none"
                    : "0 6px 20px rgba(245,158,11,0.35)",
                  transition: "all 0.2s",
                }}
              >
                {isLoading ? (
                  <>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: "2px solid #92400e",
                        borderTopColor: "transparent",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />{" "}
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain size={18} /> Run Smart Diagnosis
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  reset();
                  setResult(null);
                  setError(null);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "10px",
                  background: "#f1f5f9",
                  color: "#64748b",
                  border: "none",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#e2e8f0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#f1f5f9")
                }
              >
                <RefreshCw size={15} /> Clear Form
              </button>
            </div>
          </form>
        </motion.div>

        {/* ── Results Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: "#f8fafc",
            border: "1.5px solid #e2e8f0",
            borderRadius: 18,
            padding: "24px",
            minHeight: 500,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Empty State */}
          {!result && !isLoading && !error && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Brain size={40} color="#f59e0b" />
              </div>
              <p
                style={{
                  fontWeight: 700,
                  color: "#1e293b",
                  fontSize: "1rem",
                  marginBottom: 6,
                }}
              >
                Awaiting Patient Data
              </p>
              <p
                style={{ fontSize: "0.8rem", color: "#94a3b8", maxWidth: 240 }}
              >
                Enter symptoms and patient details to let AI assist with the
                diagnosis.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              style={{
                padding: "16px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 12,
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <AlertTriangle
                size={18}
                color="#dc2626"
                style={{ flexShrink: 0, marginTop: 1 }}
              />
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#dc2626",
                  fontWeight: 500,
                }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "#fef3c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  animation: "pulse 1.5s ease infinite",
                }}
              >
                <Zap size={30} color="#f59e0b" />
              </div>
              <p
                style={{
                  fontWeight: 700,
                  color: "#f59e0b",
                  fontSize: "1rem",
                  marginBottom: 6,
                }}
              >
                Analyzing Symptoms...
              </p>
              <p
                style={{ fontSize: "0.78rem", color: "#94a3b8", maxWidth: 220 }}
              >
                Comparing against medical databases to suggest possible
                conditions.
              </p>
            </div>
          )}

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {/* Risk Badge */}
                <div
                  style={{
                    padding: "14px 18px",
                    background: riskSc.bg,
                    border: `1.5px solid ${riskSc.border}`,
                    borderRadius: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontWeight: 700,
                      color: "#1e293b",
                    }}
                  >
                    <Activity size={18} color={riskSc.color} /> Risk Assessment
                  </div>
                  <span
                    style={{
                      padding: "5px 14px",
                      background: riskSc.color,
                      color: "white",
                      borderRadius: 999,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "capitalize",
                    }}
                  >
                    {riskSc.label}
                  </span>
                </div>

                {/* Possible Conditions */}
                <div>
                  <p
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: 10,
                    }}
                  >
                    Possible Conditions
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {result.possibleConditions?.map((c, i) => (
                      <span
                        key={i}
                        style={{
                          padding: "5px 12px",
                          background: "#eff6ff",
                          border: "1px solid #bfdbfe",
                          borderRadius: 10,
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: "#2563eb",
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Brief Explanation */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 8,
                    }}
                  >
                    <FileText size={14} color="#94a3b8" />
                    <p
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                      }}
                    >
                      Brief Explanation
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#475569",
                      lineHeight: 1.7,
                      background: "white",
                      padding: "14px",
                      borderRadius: 10,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    {result.briefExplanation}
                  </p>
                </div>

                {/* Suggested Tests */}
                {result.suggestedTests?.length > 0 && (
                  <div>
                    <p
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        marginBottom: 10,
                      }}
                    >
                      Suggested Tests
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 7,
                      }}
                    >
                      {result.suggestedTests.map((test, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            padding: "10px 14px",
                            background: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: 10,
                            fontSize: "0.875rem",
                            color: "#475569",
                          }}
                        >
                          <CheckCircle
                            size={15}
                            color="#0d9488"
                            style={{ flexShrink: 0, marginTop: 2 }}
                          />
                          {test}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#94a3b8",
                    textAlign: "center",
                    paddingTop: 8,
                    borderTop: "1px solid #e2e8f0",
                    fontStyle: "italic",
                  }}
                >
                  Disclaimer: AI diagnosis is for informational purposes only.
                  Final clinical decisions must be made by the attending
                  physician.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default SmartDiagnosis;
