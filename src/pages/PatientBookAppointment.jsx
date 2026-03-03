import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Stethoscope,
  Calendar,
  Clock,
  ChevronRight,
  CheckCircle,
  ArrowLeft,
  User,
  MapPin,
  CalendarDays,
  ShieldCheck,
  AlertCircle,
  X,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import {
  useGetAvailableDoctorsQuery,
  useBookAppointmentMutation,
} from "../store/patientApiSlice";

const PatientBookAppointment = () => {
  const navigate = useNavigate();
  const { data: doctors = [], isLoading } = useGetAvailableDoctorsQuery();
  const [bookAppointment, { isLoading: isBooking }] =
    useBookAppointmentMutation();

  const [step, setStep] = useState(1); // 1: Select Doctor, 2: Select Date & Reason
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [reason, setReason] = useState("");
  const [booked, setBooked] = useState(false);

  const filtered = doctors.filter(
    (d) =>
      d.fullname.toLowerCase().includes(search.toLowerCase()) ||
      (d.specialization || "").toLowerCase().includes(search.toLowerCase()) ||
      (d.department || "").toLowerCase().includes(search.toLowerCase()),
  );

  const minDate = new Date().toISOString().split("T")[0];

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const isDateAllowed = (dateStr, doctor) => {
    if (!doctor?.schedule?.workingDays) return true;
    const day = new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "long",
    });
    return doctor.schedule.workingDays.includes(day);
  };

  const handleBook = async () => {
    if (!selectedDoctor || !selectedDate) return;
    try {
      await bookAppointment({
        doctorId: selectedDoctor._id,
        date: selectedDate,
        reason,
      }).unwrap();
      setBooked(true);
      toast.success("Appointment fixed!");
    } catch (err) {
      toast.error(err?.data?.message || "Booking failed");
    }
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
    borderRadius: "28px",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
  };

  if (booked) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 font-['Outfit']">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={cardStyle}
          className="max-w-md w-full p-10 text-center"
        >
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
            <CheckCircle size={48} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-slate-500 font-medium mb-8">
            Your appointment with{" "}
            <span className="text-teal-600 font-bold">
              {selectedDoctor?.fullname}
            </span>{" "}
            has been successfully scheduled.
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left space-y-4 border border-slate-100">
            <div className="flex items-center gap-4">
              <CalendarDays size={20} className="text-teal-600" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Scheduled Date
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    dateStyle: "full",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin size={20} className="text-teal-600" />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Clinic Location
                </p>
                <p className="text-sm font-bold text-slate-800">
                  Main Square Medical Hub, Sector VII
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/patient/my-appointments")}
              className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-transform"
            >
              View My Appointments
            </button>
            <button
              onClick={() => {
                setBooked(false);
                setStep(1);
                setSelectedDoctor(null);
                setSelectedDate("");
                setReason("");
              }}
              className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-colors"
            >
              Book Another Visit
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-['Outfit'] text-slate-900 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-200/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-100/30 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-2 text-teal-600 font-bold tracking-widest uppercase text-xs mb-3">
              <Calendar size={14} className="animate-pulse" />
              Appointment Scheduler
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-2">
              Book Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
                Care
              </span>{" "}
              Session
            </h1>
            <p className="text-slate-500 font-medium">
              Select a specialist and secure your time slot in seconds.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/80 shadow-sm">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Step {step} of 2
              </span>
              <span className="text-sm font-bold text-slate-800">
                {step === 1 ? "Select Specialist" : "Configure Details"}
              </span>
            </div>
            <div className="flex gap-1.5">
              <div
                className={`w-8 h-1.5 rounded-full transition-all duration-500 ${step >= 1 ? "bg-teal-500 shadow-[0_0_8px_#14b8a6]" : "bg-slate-200"}`}
              />
              <div
                className={`w-8 h-1.5 rounded-full transition-all duration-500 ${step === 2 ? "bg-teal-500 shadow-[0_0_8px_#14b8a6]" : "bg-slate-200"}`}
              />
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="space-y-8"
            >
              {/* Specialized Search Bar */}
              <div
                style={cardStyle}
                className="p-4 flex items-center gap-4 group"
              >
                <Search
                  size={24}
                  className="text-slate-400 group-focus-within:text-teal-500 transition-colors ml-4"
                />
                <input
                  type="text"
                  placeholder="Seach by doctor's name, department or specialty..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent border-none outline-none py-4 text-lg font-bold text-slate-800 placeholder:text-slate-300"
                />
              </div>

              {/* Doctors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  [1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="h-64 rounded-[32px] bg-slate-100 animate-pulse"
                    />
                  ))
                ) : filtered.length === 0 ? (
                  <div className="col-span-full py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 grayscale">
                      <Stethoscope size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">
                      No Specialists Found
                    </h3>
                    <p className="text-slate-400">
                      Try searching with a different keyword.
                    </p>
                  </div>
                ) : (
                  filtered.map((doc, idx) => (
                    <motion.div
                      key={doc._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ y: -10 }}
                      style={{
                        ...cardStyle,
                        border:
                          selectedDoctor?._id === doc._id
                            ? "2px solid #14b8a6"
                            : "1px solid rgba(255,255,255,0.8)",
                      }}
                      onClick={() => {
                        setSelectedDoctor(doc);
                        setStep(2);
                      }}
                      className="p-8 cursor-pointer relative group overflow-hidden"
                    >
                      {selectedDoctor?._id === doc._id && (
                        <div className="absolute top-6 right-6 text-teal-500">
                          <CheckCircle size={24} fill="#ccfbf1" />
                        </div>
                      )}

                      <div className="relative mb-6">
                        <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white text-3xl font-black">
                          {doc.image && doc.image !== "no-photo.jpg" ? (
                            <img
                              src={doc.image}
                              alt={doc.fullname}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getInitials(doc.fullname)
                          )}
                        </div>
                        {doc.schedule?.isOnLeave && (
                          <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg border-2 border-white shadow-lg">
                            Away
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xl font-black text-slate-900 group-hover:text-teal-600 transition-colors">
                          Dr. {doc.fullname}
                        </h4>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                          {doc.specialization || "General Medicine"}
                        </p>
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-slate-500">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Availability
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            {doc.schedule?.startTime} - {doc.schedule?.endTime}
                          </span>
                        </div>
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-all">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
              {/* Left Column: Doctor Profile Mini */}
              <div className="lg:col-span-4">
                <div style={cardStyle} className="p-8 sticky top-10">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-teal-600 font-bold text-xs uppercase tracking-widest mb-8 transition-colors"
                  >
                    <ArrowLeft size={16} /> Choose Another
                  </button>

                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-white text-3xl font-black mb-4">
                      {selectedDoctor.image &&
                      selectedDoctor.image !== "no-photo.jpg" ? (
                        <img
                          src={selectedDoctor.image}
                          alt={selectedDoctor.fullname}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(selectedDoctor.fullname)
                      )}
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">
                      Dr. {selectedDoctor.fullname}
                    </h3>
                    <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-6">
                      {selectedDoctor.specialization}
                    </p>

                    <div className="w-full space-y-3">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <Clock size={18} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">
                          {selectedDoctor.schedule?.startTime} -{" "}
                          {selectedDoctor.schedule?.endTime}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center py-2">
                        {selectedDoctor.schedule?.workingDays?.map((day) => (
                          <span
                            key={day}
                            className="px-3 py-1 bg-teal-50 text-teal-600 text-[10px] font-black uppercase rounded-lg border border-teal-100"
                          >
                            {day.slice(0, 3)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Date Selection & Details */}
              <div className="lg:col-span-8 space-y-8">
                <div style={cardStyle} className="p-8">
                  <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3 italic">
                    <CalendarDays className="text-teal-500" /> Appointment Logic
                  </h3>

                  <div className="space-y-8">
                    {/* Date Picker */}
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">
                        Select Preferred Date
                      </label>
                      <input
                        type="date"
                        min={minDate}
                        value={selectedDate}
                        onChange={(e) => {
                          if (!isDateAllowed(e.target.value, selectedDoctor)) {
                            toast.error(
                              `${selectedDoctor.fullname} does not work on this day.`,
                            );
                            return;
                          }
                          setSelectedDate(e.target.value);
                        }}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none focus:border-teal-500 focus:bg-white transition-all"
                      />
                    </div>

                    {/* Reason / Bio */}
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">
                        Reason for Visit (Optional)
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Briefly describe your symptoms or reason for the consultation..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 outline-none focus:border-teal-500 focus:bg-white transition-all resize-none"
                      />
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center gap-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                      <ShieldCheck
                        size={28}
                        className="text-emerald-500 shrink-0"
                      />
                      <div className="text-xs font-medium text-emerald-800">
                        <span className="font-black uppercase tracking-widest block mb-0.5">
                          Secure Transaction
                        </span>
                        Your medical data is encrypted and only shared with the
                        selected provider.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Action */}
                <div className="flex items-center justify-between gap-6">
                  <button
                    onClick={() => setStep(1)}
                    className="px-10 py-5 text-slate-400 hover:text-slate-600 font-black text-xs uppercase tracking-widest transition-colors"
                  >
                    Back
                  </button>
                  <button
                    disabled={!selectedDate || isBooking}
                    onClick={handleBook}
                    className={`flex-1 max-w-sm py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 ${
                      selectedDate
                        ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {isBooking ? (
                      <Clock size={18} className="animate-spin" />
                    ) : (
                      <>
                        Finalize Booking <ArrowUpRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <div className="mt-20 flex flex-col items-center gap-4 opacity-40">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                HIPAA Ready
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                End-to-End Encrypted
              </span>
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 text-center">
            By booking, you agree to our Medical Service Terms and Clinical Data
            Governance.
          </p>
        </div>
      </div>
    </div>
  );
};

// Simple lock icon for footer
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

export default PatientBookAppointment;
