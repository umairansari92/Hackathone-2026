import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Eye,
  Stethoscope,
  GraduationCap,
  MapPin,
  Clock,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import {
  useGetPendingDoctorsQuery,
  useApproveDoctorMutation,
  useRejectDoctorMutation,
} from "../store/onboardingApiSlice";
import { toast } from "react-hot-toast";

const DoctorRequests = () => {
  const {
    data: doctors = [],
    isLoading,
    refetch,
  } = useGetPendingDoctorsQuery();
  const [approveDoctor] = useApproveDoctorMutation();
  const [rejectDoctor] = useRejectDoctorMutation();
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this doctor?")) return;
    try {
      await approveDoctor(id).unwrap();
      toast.success("Doctor approved successfully!");
      setSelectedDoctor(null);
    } catch (err) {
      toast.error(err?.data?.message || "Approval failed");
    }
  };

  const handleReject = async (id) => {
    if (
      !window.confirm(
        "ARE YOU SURE? This will PERMANENTLY delete the request and user account.",
      )
    )
      return;
    try {
      await rejectDoctor(id).unwrap();
      toast.success("Doctor request rejected");
      setSelectedDoctor(null);
    } catch (err) {
      toast.error(err?.data?.message || "Rejection failed");
    }
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.8)",
  };

  if (isLoading)
    return (
      <div className="p-10 text-center font-bold text-slate-400">
        Loading requests...
      </div>
    );

  return (
    <div className="p-6 lg:p-10 font-['Outfit'] min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
          Doctor Verification
        </h1>
        <p className="text-slate-500 font-medium">
          Review and manage professional onboarding requests.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {doctors.length === 0 ? (
          <div className="py-20 text-center" style={cardStyle}>
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={40} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800">
              All Caught Up!
            </h3>
            <p className="text-slate-400 font-medium whitespace-nowrap">
              No pending verification requests found.
            </p>
          </div>
        ) : (
          doctors.map((doctor) => (
            <motion.div
              key={doctor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={cardStyle}
              className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all border-l-4 border-l-teal-500"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                  {doctor.fullname.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
                    Dr. {doctor.fullname}
                  </h3>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md uppercase">
                      {doctor.profile?.speciality || "Specialist"}
                    </span>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase">
                      {doctor.profile?.experienceYears} Yrs Exp
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDoctor(doctor)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm flex items-center gap-2"
                >
                  <Eye size={16} /> Details
                </motion.button>
                <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block" />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReject(doctor._id)}
                  className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold text-sm flex items-center gap-2 border border-rose-100"
                >
                  <XCircle size={16} /> Reject
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleApprove(doctor._id)}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 size={16} /> Approve
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedDoctor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setSelectedDoctor(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedDoctor(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
              >
                <XCircle size={24} />
              </button>

              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                <div className="w-24 h-24 bg-teal-500 rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-2xl">
                  {selectedDoctor.fullname.charAt(0)}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900">
                    Dr. {selectedDoctor.fullname}
                  </h2>
                  <p className="text-teal-600 font-bold uppercase tracking-widest text-sm">
                    {selectedDoctor.profile?.speciality}
                  </p>
                  <p className="text-slate-400 font-medium text-sm mt-1">
                    {selectedDoctor.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">
                      <GraduationCap size={14} /> Qualifications
                    </div>
                    <p className="text-slate-800 font-bold">
                      {selectedDoctor.profile?.qualifications}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">
                      <MapPin size={14} /> University
                    </div>
                    <p className="text-slate-800 font-bold">
                      {selectedDoctor.profile?.universityName},{" "}
                      {selectedDoctor.profile?.universityCity}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">
                      <Briefcase size={14} /> Experience
                    </div>
                    <p className="text-slate-800 font-bold">
                      {selectedDoctor.profile?.experienceYears} Years
                      Professional Practice
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">
                      <Clock size={14} /> Room Number
                    </div>
                    <p className="text-slate-800 font-bold">
                      Clinic Room: {selectedDoctor.profile?.clinicRoomNumber}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">
                      <ExternalLink size={14} /> License Number
                    </div>
                    <p className="text-slate-800 font-bold bg-slate-50 px-3 py-1 rounded-lg w-fit border border-slate-100">
                      {selectedDoctor.profile?.licenseNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <div className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-3">
                  Professional Bio
                </div>
                <p className="text-slate-600 font-medium leading-relaxed bg-slate-50 p-6 rounded-2xl italic">
                  "{selectedDoctor.profile?.bio}"
                </p>
              </div>

              {selectedDoctor.profile?.documents?.length > 0 && (
                <div className="mb-10">
                  <div className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-3">
                    Verification Documents
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {selectedDoctor.profile.documents.map((doc, i) => (
                      <a
                        key={i}
                        href={doc}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-teal-600 transition-all flex items-center gap-2"
                      >
                        <ExternalLink size={14} /> View Document {i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-10 border-t border-slate-100">
                <button
                  onClick={() => handleReject(selectedDoctor._id)}
                  className="flex-1 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm uppercase tracking-widest border border-rose-100"
                >
                  Reject & Delete
                </button>
                <button
                  onClick={() => handleApprove(selectedDoctor._id)}
                  className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-500/30"
                >
                  Approve Application
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorRequests;
