import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  FileText,
  Download,
  ArrowLeft,
  User,
  Pill,
  CalendarDays,
  Stethoscope,
  Brain,
  Sparkles,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  MoreVertical,
  Zap,
} from "lucide-react";
import {
  useGetPrescriptionByIdQuery,
  useGeneratePDFMutation,
} from "../store/prescriptionApiSlice";
import { useExplainPrescriptionMutation } from "../store/aiApiSlice";

const PrescriptionViewer = () => {
  const { id } = useParams();
  const {
    data: prescription,
    isLoading,
    error,
  } = useGetPrescriptionByIdQuery(id);
  const [generatePDF, { isLoading: generating }] = useGeneratePDFMutation();
  const [explainPrescription, { isLoading: explaining }] =
    useExplainPrescriptionMutation();
  const [aiExplanation, setAiExplanation] = useState(null);

  const handleDownload = async () => {
    try {
      if (prescription?.pdfUrl) {
        window.open(prescription.pdfUrl, "_blank");
        return;
      }
      const result = await generatePDF(id).unwrap();
      toast.success("📄 Records compiled successfully!");
      if (result?.pdfUrl) window.open(result.pdfUrl, "_blank");
    } catch {
      toast.error("Critical rendering error during PDF generation.");
    }
  };

  const handleAIExplain = async () => {
    if (aiExplanation) {
      setAiExplanation(null);
      return;
    }
    try {
      const result = await explainPrescription({
        medicines: prescription.medicines,
        condition: prescription.instructions || "the prescribed condition",
        language: "English",
      }).unwrap();
      setAiExplanation(
        result.explanation ||
          result.fallbackExplanation ||
          "Synthesis unavailable at this cluster.",
      );
    } catch {
      toast.error("AI Neural link dropped. Please try again.");
    }
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
    borderRadius: "28px",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
  };

  if (isLoading)
    return (
      <div className="min-h-[80vh] flex items-center justify-center font-['Outfit']">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto border border-teal-100 animate-pulse">
            <FileText size={24} className="text-teal-400" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Decoding Medical Dossier...
          </p>
        </div>
      </div>
    );

  if (error || !prescription)
    return (
      <div className="min-h-[80vh] flex items-center justify-center font-['Outfit']">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          style={cardStyle}
          className="p-12 text-center max-w-md"
        >
          <AlertTriangle size={48} className="text-rose-400 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-800 mb-2 font-['Outfit']">
            Dossier Access Denied
          </h3>
          <p className="text-slate-500 mb-8 italic">
            The requested record does not exist or has been archived in a secure
            vault.
          </p>
          <Link
            to="/prescriptions"
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest no-underline"
          >
            ← Return to Archive
          </Link>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-['Outfit'] text-slate-900 overflow-hidden relative">
      {/* Background Decor */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-200/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-100/30 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Navigation */}
        <Link
          to="/prescriptions"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-600 font-black text-[10px] uppercase tracking-[0.2em] mb-12 no-underline transition-colors"
        >
          <ArrowLeft size={16} /> Archive Registry
        </Link>

        {/* Main Dossier Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={cardStyle}
          className="overflow-hidden shadow-2xl shadow-slate-200"
        >
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
            <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-teal-500/10 blur-[80px] rounded-full" />

            <div className="space-y-2 relative z-10 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
                  <FileText size={24} className="text-teal-400" />
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight">
                  Prescription <span className="text-teal-400">Insight</span>
                </h1>
              </div>
              <p className="text-slate-400 font-medium text-sm">
                Issued by Clinical Authority:{" "}
                {dayjs(prescription.createdAt).format("MMMM DD, YYYY")}
              </p>
            </div>

            <div className="flex items-center gap-4 relative z-10">
              <button
                onClick={handleAIExplain}
                disabled={explaining}
                className="flex items-center gap-3 px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-teal-600 transition-all backdrop-blur-md"
              >
                {explaining ? (
                  <Zap size={16} className="animate-spin" />
                ) : (
                  <Brain size={16} className="text-teal-400" />
                )}
                {aiExplanation ? "Lock Sync" : "AI Synthesis"}
              </button>
              <button
                onClick={handleDownload}
                disabled={generating}
                className="flex items-center gap-3 px-6 py-3.5 bg-teal-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-teal-500/20"
              >
                {generating ? (
                  <Zap size={16} className="animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                {prescription?.pdfUrl ? "Get PDF" : "Finalize PDF"}
              </button>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            {/* Clinical Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                  <Stethoscope size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Signed Provider
                  </p>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">
                    Dr. {prescription.doctorId?.fullname}
                  </h4>
                  <p className="text-xs font-bold text-teal-600/80 uppercase tracking-widest italic">
                    {prescription.doctorId?.specialization ||
                      "General Medicine"}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <User size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Subject Identity
                  </p>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">
                    {prescription.patientId?.name}
                  </h4>
                  <p className="text-xs font-bold text-slate-500 italic">
                    Age {prescription.patientId?.age} ·{" "}
                    {prescription.patientId?.gender}
                  </p>
                </div>
              </div>
            </div>

            {/* Pharmacological Protocol */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 underline decoration-teal-500 underline-offset-8 decoration-4">
                <Pill size={20} className="text-teal-500" /> Prescribed Protocol
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {(prescription.medicines || []).map((med, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[28px] hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/5 transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center font-black group-hover:bg-teal-50 group-hover:text-teal-500 transition-colors">
                        0{i + 1}
                      </div>
                      <div>
                        <h5 className="text-lg font-black text-slate-900 leading-none group-hover:text-teal-600 transition-colors">
                          {med.name}
                        </h5>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Zap size={10} className="text-amber-500" />{" "}
                            {med.dosage}
                          </span>
                          <span className="w-1 h-1 bg-slate-200 rounded-full" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Clock size={10} className="text-blue-500" />{" "}
                            {med.frequency}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="px-5 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100 shadow-sm opacity-60 group-hover:opacity-100 transition-opacity">
                      {med.duration}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Clinical Guidelines */}
            {prescription.instructions && (
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <Sparkles size={20} className="text-teal-500" /> Special
                  Directives
                </h3>
                <div className="bg-amber-50/50 border-l-4 border-l-amber-400 p-8 rounded-[32px] rounded-tl-none italic text-amber-900 text-sm leading-relaxed font-medium">
                  "{prescription.instructions}"
                </div>
              </div>
            )}

            {/* AI Synthesis Visualization */}
            <AnimatePresence>
              {aiExplanation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-8 bg-slate-900 rounded-[40px] border border-slate-800 text-white relative group">
                    <div className="absolute top-0 right-0 p-8">
                      <Brain
                        size={32}
                        className="text-teal-500/20 group-hover:rotate-12 transition-transform"
                      />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
                        <Sparkles size={14} className="text-white" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">
                        Neural Synthesis by Gemini 1.5 Pro
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-300 leading-loose whitespace-pre-wrap max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                      {aiExplanation}
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3">
                      <AlertTriangle size={14} className="text-amber-400" />
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic leading-tight">
                        Synthetic intelligence insights are for general
                        guidance. Consult your verified provider for clinical
                        definitive protocols.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Status */}
            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-emerald-500" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest underline decoration-dotted underline-offset-4">
                  Clinically Documented • Encrypted Records • Authored v1.4
                </p>
              </div>
              {prescription.pdfUrl && (
                <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">
                  Digital Registry ID: {prescription._id?.slice(-8)}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Floating disclaimer blurbs */}
        <div className="mt-20 flex flex-col items-center gap-4 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Lock size={12} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                End-to-End Encrypted
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                HIPAA Ready Node
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple lock icon
const Lock = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

export default PrescriptionViewer;
