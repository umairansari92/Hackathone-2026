import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useGetPatientsQuery } from "../store/patientApiSlice";
import { FileText, Plus, Trash2, Printer } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
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

  const generatePDF = (data) => {
    const doc = new jsPDF();
    const patientName =
      patients?.find((p) => p._id === data.patientId)?.name ||
      "Unknown Patient";

    // Header
    doc.setFontSize(22);
    doc.setTextColor(13, 148, 136); // teal-600
    doc.text("AI Clinic Management", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("123 Health Ave, Medical District", 14, 30);
    doc.text("Contact: +1 234 567 8900", 14, 35);
    doc.line(14, 40, 196, 40);

    // Doctor & Patient Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Doctor: ${user?.fullname}`, 14, 50);
    doc.text(`Patient: ${patientName}`, 14, 58);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 66);

    // Rx Symbol
    doc.setFontSize(24);
    doc.setTextColor(13, 148, 136);
    doc.text("Rx", 14, 85);

    // Medicines Table
    const tableData = data.medicines.map((med, index) => [
      index + 1,
      med.name,
      med.dosage,
      med.duration,
    ]);

    doc.autoTable({
      startY: 95,
      headStyles: { fillColor: [13, 148, 136] },
      head: [["#", "Medicine Name", "Dosage", "Duration"]],
      body: tableData,
    });

    // Instructions
    const finalY = doc.lastAutoTable.finalY || 90;
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

    // Footer
    doc.line(14, 275, 196, 275);
    doc.setFontSize(10);
    doc.text("Signature: _______________________", 140, 265);
    doc.text("This is an electronically generated prescription.", 14, 282);

    doc.save(`Prescription_${patientName.replace(/\s+/g, "_")}.pdf`);
  };

  const onSubmit = async (data) => {
    // In a full implementation, we would also POST this to the backend
    // For the hackathon demo, we prioritize the PDF generation
    generatePDF(data);
    alert("Prescription generated successfully!");
  };

  if (patientsLoading)
    return <div className="p-8">Loading patient list...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-blue-500 p-3 rounded-lg text-white">
          <FileText size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Write Prescription
          </h2>
          <p className="text-slate-500">
            Create a digital prescription and generate a PDF document.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Patient <span className="text-red-500">*</span>
            </label>
            <select
              {...register("patientId", { required: true })}
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
              <option value="">-- Choose a Patient --</option>
              {patients?.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} (Age: {p.age})
                </option>
              ))}
            </select>
          </div>

          <hr className="border-slate-100" />

          {/* Medicines List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Medicines Data
              </h3>
              <button
                type="button"
                onClick={() => append({ name: "", dosage: "", duration: "" })}
                className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors"
              >
                <Plus size={16} /> Add Medicine
              </button>
            </div>

            <div className="space-y-3">
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-end bg-slate-50 p-4 rounded border border-slate-100 animate-fade-in"
                >
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">
                      Medicine Name
                    </label>
                    <input
                      {...register(`medicines.${index}.name`, {
                        required: true,
                      })}
                      placeholder="e.g. Paracetamol 500mg"
                      className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">
                      Dosage
                    </label>
                    <input
                      {...register(`medicines.${index}.dosage`, {
                        required: true,
                      })}
                      placeholder="e.g. 1-0-1 after food"
                      className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="w-1/4">
                    <label className="block text-xs text-slate-500 mb-1">
                      Duration
                    </label>
                    <input
                      {...register(`medicines.${index}.duration`, {
                        required: true,
                      })}
                      placeholder="e.g. 5 days"
                      className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Remove Medicine"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Special Instructions (Optional)
            </label>
            <textarea
              {...register("instructions")}
              rows="3"
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Diet plan, rest advice, etc."
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded hover:bg-slate-700 transition-colors shadow-sm"
            >
              <Printer size={18} /> Generate Prescription PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPrescription;
