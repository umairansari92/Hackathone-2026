import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hash,
  User,
  Phone,
  AlertCircle,
  Heart,
  FlaskConical,
  Scan,
  Pill,
  FileText,
  ChevronDown,
  ChevronUp,
  Calendar,
  Activity,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useGetPatientHistoryQuery } from "../store/patientApiSlice";

const SectionHeader = ({ icon, label, count, color }) => (
  <h4
    className={`text-xs font-black uppercase tracking-wide flex items-center gap-1.5 mb-3 ${color}`}
  >
    {icon} {label} ({count})
  </h4>
);

const PatientPortal = () => {
  // Patient data is stored in Redux auth.user after UID login
  // Their _id maps to Patient collection
  const { user } = useSelector((s) => s.auth);
  const patientId = user?._id;

  const { data, isLoading } = useGetPatientHistoryQuery(patientId, {
    skip: !patientId,
  });
  const [openVisit, setOpenVisit] = useState(null);

  const { patient, visits = [], summary } = data || {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="w-8 h-8 border-3 border-(--accent)/30 border-t-(--accent) rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Outfit']">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-black text-(--text-primary) tracking-tight">
          My Health Record
        </h1>
        <p className="text-sm text-(--text-muted) font-medium mt-1">
          Complete visit history and medical reports
        </p>
      </motion.div>

      {/* Patient Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
        className="glass-card p-6"
      >
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-(--accent) to-(--accent-hover) flex items-center justify-center text-white text-2xl font-black shadow-lg">
            {(patient?.fullName || user?.fullName || "P").charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-(--text-primary)">
              {patient?.fullName || user?.fullName}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full bg-(--accent)/10 text-(--accent) border border-(--accent)/20">
                <Hash size={11} /> {patient?.uid || user?.uid}
              </span>
              <span className="text-xs text-(--text-muted) font-medium">
                {patient?.gender} • {patient?.age} yrs • {patient?.department}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="text-center p-2 rounded-xl bg-(--hover)">
                <p className="text-lg font-black text-(--text-primary)">
                  {summary?.totalVisits || 0}
                </p>
                <p className="text-xs text-(--text-muted)">Visits</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-(--hover)">
                <p className="text-lg font-black text-(--text-primary)">
                  {summary?.totalLabTests || 0}
                </p>
                <p className="text-xs text-(--text-muted)">Lab Tests</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-(--hover)">
                <p className="text-lg font-black text-(--text-primary)">
                  {summary?.totalUltrasounds || 0}
                </p>
                <p className="text-xs text-(--text-muted)">Ultrasounds</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-(--hover)">
                <p className="text-lg font-black text-(--text-primary)">
                  {summary?.totalPrescriptions || 0}
                </p>
                <p className="text-xs text-(--text-muted)">Prescriptions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Health Alerts */}
        {(patient?.chronicConditions || patient?.allergies) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-(--border)">
            {patient?.chronicConditions && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10">
                <AlertCircle size={14} className="text-amber-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-700">
                    Chronic Conditions
                  </p>
                  <p className="text-sm text-(--text-primary)">
                    {patient.chronicConditions}
                  </p>
                </div>
              </div>
            )}
            {patient?.allergies && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/10">
                <Heart size={14} className="text-rose-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-rose-700">Allergies</p>
                  <p className="text-sm text-(--text-primary)">
                    {patient.allergies}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Visit History */}
      <div>
        <h3 className="text-lg font-black text-(--text-primary) mb-4 flex items-center gap-2">
          <Activity size={20} className="text-(--accent)" /> Visit History
        </h3>
        {visits.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <Calendar
              size={40}
              className="mx-auto opacity-20 mb-2 text-(--text-muted)"
            />
            <p className="text-(--text-muted) font-medium">
              No visits recorded yet. Please visit the clinic to register.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visits.map((visit, idx) => (
              <motion.div
                key={visit._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: idx * 0.04 },
                }}
                className="glass-card overflow-hidden"
              >
                {/* Visit header */}
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-(--hover) transition-colors"
                  onClick={() =>
                    setOpenVisit(openVisit === visit._id ? null : visit._id)
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-(--accent)/40 to-(--accent) flex items-center justify-center text-white text-xs font-black">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-(--text-primary)">
                        {new Date(visit.visitDate).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-(--text-muted)">
                        Dr. {visit.doctorId?.fullname} — {visit.department}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        visit.status === "Completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : visit.status === "Scheduled"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {visit.status}
                    </span>
                    {openVisit === visit._id ? (
                      <ChevronUp size={16} className="text-(--text-muted)" />
                    ) : (
                      <ChevronDown size={16} className="text-(--text-muted)" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {openVisit === visit._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-(--border) p-5 space-y-4"
                    >
                      {/* Diagnosis */}
                      {(visit.symptoms || visit.diagnosis) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {visit.symptoms && (
                            <div>
                              <p className="text-xs font-bold text-(--text-muted) uppercase tracking-wide mb-1">
                                Symptoms
                              </p>
                              <p className="text-sm text-(--text-secondary)">
                                {visit.symptoms}
                              </p>
                            </div>
                          )}
                          {visit.diagnosis && (
                            <div>
                              <p className="text-xs font-bold text-(--accent) uppercase tracking-wide mb-1">
                                Diagnosis
                              </p>
                              <p className="text-sm font-semibold text-(--text-primary)">
                                {visit.diagnosis}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Labs */}
                      {visit.labTests?.length > 0 && (
                        <div>
                          <SectionHeader
                            icon={<FlaskConical size={12} />}
                            label="Lab Tests"
                            count={visit.labTests.length}
                            color="text-blue-700"
                          />
                          <div className="space-y-2">
                            {visit.labTests.map((lab) => (
                              <div
                                key={lab._id}
                                className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10"
                              >
                                <div>
                                  <span className="text-sm font-semibold text-(--text-primary)">
                                    {lab.testName}
                                  </span>
                                  <span className="ml-2 text-xs text-(--text-muted)">
                                    {lab.testType}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                      lab.status === "Done"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                                  >
                                    {lab.status}
                                  </span>
                                  {lab.result && (
                                    <p className="text-xs text-blue-600 mt-0.5">
                                      {lab.result}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Ultrasound */}
                      {visit.ultrasounds?.length > 0 && (
                        <div>
                          <SectionHeader
                            icon={<Scan size={12} />}
                            label="Ultrasound"
                            count={visit.ultrasounds.length}
                            color="text-purple-700"
                          />
                          {visit.ultrasounds.map((us) => (
                            <div
                              key={us._id}
                              className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-semibold text-(--text-primary)">
                                  {us.scanType}
                                </span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                    us.status === "Reported"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {us.status}
                                </span>
                              </div>
                              {us.impression && (
                                <p className="text-xs font-medium text-purple-700">
                                  Impression: {us.impression}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Prescriptions */}
                      {visit.prescriptions?.length > 0 && (
                        <div>
                          <SectionHeader
                            icon={<FileText size={12} />}
                            label="Prescriptions"
                            count={visit.prescriptions.length}
                            color="text-orange-700"
                          />
                          {visit.prescriptions.map((rx) => (
                            <div
                              key={rx._id}
                              className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 space-y-1"
                            >
                              {rx.medicines?.map((m, i) => (
                                <p
                                  key={i}
                                  className="text-xs text-(--text-secondary)"
                                >
                                  • {m.name} {m.dosage} — {m.frequency} (
                                  {m.duration})
                                </p>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Pharmacy */}
                      {visit.pharmacyRecords?.length > 0 && (
                        <div>
                          <SectionHeader
                            icon={<Pill size={12} />}
                            label="Pharmacy"
                            count={visit.pharmacyRecords.length}
                            color="text-emerald-700"
                          />
                          {visit.pharmacyRecords.map((ph) => (
                            <div
                              key={ph._id}
                              className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10"
                            >
                              <div className="flex justify-between mb-1">
                                <span className="text-xs font-semibold text-(--text-secondary)">
                                  {ph.status}
                                </span>
                                <span className="text-sm font-bold text-(--text-primary)">
                                  Rs.{" "}
                                  {Number(ph.totalAmount || 0).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {ph.medicines?.map((m, i) => (
                                  <span
                                    key={i}
                                    className="text-xs bg-white dark:bg-gray-800 px-2 py-0.5 rounded-lg border border-(--border)"
                                  >
                                    {m.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {!visit.diagnosis &&
                        !visit.symptoms &&
                        visit.labTests?.length === 0 && (
                          <p className="text-xs text-(--text-muted) italic text-center py-2">
                            Clinical records will appear once doctor completes
                            the consultation.
                          </p>
                        )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPortal;
