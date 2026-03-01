import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useGetPatientsQuery } from "../store/patientApiSlice";
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  User,
  Pill,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useSelector } from "react-redux";

const NewPrescription = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: patients, isLoading: patientsLoading } = useGetPatientsQuery();
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      medicines: [{ name: "", dosage: "", duration: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  const selectedPatientId = watch("patientId");
  const selectedPatient = patients?.find((p) => p._id === selectedPatientId);

  const generatePDF = (data) => {
    const doc = new jsPDF();
    const patientName =
      patients?.find((p) => p._id === data.patientId)?.name ||
      "Unknown Patient";

    doc.setFontSize(22);
    doc.setTextColor(13, 148, 136);
    doc.text("Al Shifa Hospital", 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("123 Health Ave, Medical District", 14, 30);
    doc.text("Contact: +1 234 567 8900", 14, 35);
    doc.line(14, 40, 196, 40);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Doctor: ${user?.fullname}`, 14, 50);
    doc.text(`Patient: ${patientName}`, 14, 58);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 66);

    doc.setFontSize(24);
    doc.setTextColor(13, 148, 136);
    doc.text("Rx", 14, 85);

    const tableData = data.medicines.map((med, index) => [
      index + 1,
      med.name,
      med.dosage,
      med.duration,
    ]);

    autoTable(doc, {
      startY: 95,
      headStyles: { fillColor: [13, 148, 136] },
      head: [["#", "Medicine Name", "Dosage", "Duration"]],
      body: tableData,
    });

    const finalY = doc.lastAutoTable?.finalY ?? 90;
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Special Instructions:", 14, finalY + 15);
    doc.setFontSize(10);
    doc.setTextColor(80);
    const splitInstructions = doc.splitTextToSize(
      data.instructions || "None",
      180,
    );
    doc.text(splitInstructions, 14, finalY + 22);

    doc.line(14, 275, 196, 275);
    doc.setFontSize(10);
    doc.text("Signature: _______________________", 140, 265);
    doc.text("This is an electronically generated prescription.", 14, 282);
    doc.save(`Prescription_${patientName.replace(/\s+/g, "_")}.pdf`);
  };

  const onSubmit = (data) => {
    generatePDF(data);
  };

  if (patientsLoading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 200,
          color: "#94a3b8",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "3px solid #e2e8f0",
            borderTopColor: "#0d9488",
            animation: "spin 0.8s linear infinite",
            marginRight: 12,
          }}
        />
        Loading patients...
      </div>
    );

  /* ── shared styles ── */
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

  return (
    <div
      style={{
        fontFamily: "'Outfit', sans-serif",
        maxWidth: 860,
        margin: "0 auto",
        paddingBottom: 48,
      }}
    >
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #0d9488, #0ea5e9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(13,148,136,0.3)",
              flexShrink: 0,
            }}
          >
            <FileText size={26} color="white" />
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
              Write Prescription
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
              Create a digital prescription and generate a PDF document
            </p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* ── Card 1: Patient Selection ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.9)",
              borderRadius: 18,
              padding: "22px 26px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <User size={17} color="#0d9488" />
              <h3
                style={{
                  fontWeight: 700,
                  color: "#1e293b",
                  fontSize: "0.95rem",
                }}
              >
                Select Patient
              </h3>
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

            <div style={{ position: "relative" }}>
              <select
                {...register("patientId", { required: true })}
                style={{
                  ...inputStyle,
                  paddingRight: "2.5rem",
                  appearance: "none",
                  cursor: "pointer",
                  fontWeight: selectedPatientId ? 600 : 400,
                  color: selectedPatientId ? "#1e293b" : "#94a3b8",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              >
                <option value="">— Choose a Patient —</option>
                {patients?.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} · {p.age} yrs · {p.gender}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Live patient info chip */}
            <AnimatePresence>
              {selectedPatient && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    background: "linear-gradient(135deg, #f0fdfa, #e0f2fe)",
                    border: "1px solid #a7f3d0",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "linear-gradient(135deg, #0d9488, #0ea5e9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 800,
                      fontSize: "1rem",
                      flexShrink: 0,
                    }}
                  >
                    {selectedPatient.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p
                      style={{
                        fontWeight: 700,
                        color: "#0f766e",
                        fontSize: "0.875rem",
                      }}
                    >
                      {selectedPatient.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        color: "#0f766e",
                        opacity: 0.75,
                      }}
                    >
                      {selectedPatient.age} yrs · {selectedPatient.gender}
                      {selectedPatient.contact
                        ? ` · ${selectedPatient.contact}`
                        : ""}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Card 2: Medicines ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.9)",
              borderRadius: 18,
              padding: "22px 26px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            {/* Section header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Pill size={17} color="#0d9488" />
                <h3
                  style={{
                    fontWeight: 700,
                    color: "#1e293b",
                    fontSize: "0.95rem",
                  }}
                >
                  Medicines
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
                  {fields.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => append({ name: "", dosage: "", duration: "" })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 14px",
                  background: "linear-gradient(135deg, #0d9488, #0ea5e9)",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 3px 10px rgba(13,148,136,0.3)",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <Plus size={15} /> Add Medicine
              </button>
            </div>

            {/* Column headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "28px 1fr 1fr 140px 36px",
                gap: 10,
                padding: "0 4px",
                marginBottom: 8,
              }}
            >
              {["#", "Medicine Name", "Dosage", "Duration", ""].map((h) => (
                <div key={h} style={labelStyle}>
                  {h}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <AnimatePresence>
                {fields.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "28px 1fr 1fr 140px 36px",
                      gap: 10,
                      alignItems: "center",
                      background: "#f8fafc",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 12,
                      padding: "10px 12px",
                    }}
                  >
                    {/* Row number */}
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 7,
                        background: "linear-gradient(135deg, #0d9488, #0ea5e9)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>

                    <input
                      {...register(`medicines.${index}.name`, {
                        required: true,
                      })}
                      placeholder="e.g. Paracetamol 500mg"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                    <input
                      {...register(`medicines.${index}.dosage`, {
                        required: true,
                      })}
                      placeholder="e.g. 1-0-1 after food"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                    <input
                      {...register(`medicines.${index}.duration`, {
                        required: true,
                      })}
                      placeholder="e.g. 5 days"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />

                    {fields.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: "1px solid #fecaca",
                          background: "#fef2f2",
                          color: "#dc2626",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "background 0.15s",
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#fee2e2")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "#fef2f2")
                        }
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <div style={{ width: 32 }} />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Card 3: Special Instructions ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.9)",
              borderRadius: 18,
              padding: "22px 26px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <ClipboardList size={17} color="#0d9488" />
              <h3
                style={{
                  fontWeight: 700,
                  color: "#1e293b",
                  fontSize: "0.95rem",
                }}
              >
                Special Instructions
              </h3>
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "#94a3b8",
                  fontWeight: 600,
                }}
              >
                (Optional)
              </span>
            </div>
            <textarea
              {...register("instructions")}
              rows={3}
              placeholder="Diet plan, rest advice, follow-up schedule, etc."
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: 90,
                lineHeight: 1.6,
              }}
              onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </motion.div>

          {/* ── Generate Button ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <button
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "13px 28px",
                background: "linear-gradient(135deg, #0d9488, #0ea5e9)",
                color: "white",
                border: "none",
                borderRadius: 14,
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 6px 20px rgba(13,148,136,0.35)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 28px rgba(13,148,136,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(13,148,136,0.35)";
              }}
            >
              <Printer size={20} />
              Generate Prescription PDF
            </button>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default NewPrescription;
