import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  MapPin,
  AlertCircle,
  Heart,
  FlaskConical,
  Scan,
  Pill,
  FileText,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Calendar,
  Stethoscope,
  ClipboardList,
  ArrowLeft,
  Hash,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { useGetPatientHistoryQuery } from "../store/patientApiSlice";
import { useCreateVisitMutation } from "../store/visitApiSlice";
import { useGetAllUsersQuery } from "../store/userApiSlice";

const InfoChip = ({ label, value, icon }) => (
  <div className="flex items-start gap-2 p-3 rounded-xl bg-(--hover)">
    <span className="text-(--accent) mt-0.5">{icon}</span>
    <div>
      <p className="text-xs font-bold text-(--text-muted) uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-semibold text-(--text-primary)">
        {value || "—"}
      </p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const colors = {
    Scheduled: "bg-blue-100 text-blue-700",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${colors[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
};

const VisitCard = ({ visit, index }) => {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
      className="glass-card overflow-hidden"
    >
      {/* Visit Header */}
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-(--hover) transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-(--accent) to-(--accent-hover) flex items-center justify-center text-white text-sm font-black shadow">
            {index + 1}
          </div>
          <div>
            <p className="font-bold text-(--text-primary) flex items-center gap-2">
              {new Date(visit.visitDate).toLocaleDateString("en-PK", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              <StatusBadge status={visit.status} />
            </p>
            <p className="text-xs text-(--text-muted) mt-0.5">
              Dr. {visit.doctorId?.fullname || "Unknown"} — {visit.department}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 text-xs">
            {visit.labTests?.length > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                <FlaskConical size={10} /> {visit.labTests.length} Labs
              </span>
            )}
            {visit.ultrasounds?.length > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                <Scan size={10} /> {visit.ultrasounds.length} Scans
              </span>
            )}
            {visit.pharmacyRecords?.length > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                <Pill size={10} /> {visit.pharmacyRecords.length} Pharmacy
              </span>
            )}
          </div>
          {open ? (
            <ChevronUp size={18} className="text-(--text-muted)" />
          ) : (
            <ChevronDown size={18} className="text-(--text-muted)" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-(--border)"
          >
            <div className="p-5 space-y-5">
              {/* Clinical Info */}
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
                {visit.notes && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-bold text-(--text-muted) uppercase tracking-wide mb-1">
                      Notes
                    </p>
                    <p className="text-sm text-(--text-secondary)">
                      {visit.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Lab Tests */}
              {visit.labTests?.length > 0 && (
                <div>
                  <h5 className="text-xs font-black text-blue-700 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                    <FlaskConical size={12} /> Lab Tests
                  </h5>
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
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                              lab.status === "Done"
                                ? "bg-emerald-100 text-emerald-700"
                                : lab.status === "Processing"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {lab.status}
                          </span>
                          {lab.result && (
                            <span className="text-xs text-blue-600 font-medium">
                              {lab.result}
                            </span>
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
                  <h5 className="text-xs font-black text-purple-700 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                    <Scan size={12} /> Ultrasound Reports
                  </h5>
                  <div className="space-y-2">
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
                        {us.findings && (
                          <p className="text-xs text-(--text-muted)">
                            Findings: {us.findings}
                          </p>
                        )}
                        {us.impression && (
                          <p className="text-xs font-medium text-purple-700">
                            Impression: {us.impression}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pharmacy */}
              {visit.pharmacyRecords?.length > 0 && (
                <div>
                  <h5 className="text-xs font-black text-emerald-700 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                    <Pill size={12} /> Pharmacy Records
                  </h5>
                  {visit.pharmacyRecords.map((rx) => (
                    <div
                      key={rx._id}
                      className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10"
                    >
                      <div className="flex justify-between mb-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            rx.status === "Dispensed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {rx.status}
                        </span>
                        <span className="text-sm font-bold text-(--text-primary)">
                          Rs. {Number(rx.totalAmount || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {rx.medicines?.map((m, i) => (
                          <span
                            key={i}
                            className="text-xs bg-white dark:bg-gray-800 px-2 py-0.5 rounded-lg border border-(--border) font-medium text-(--text-secondary)"
                          >
                            {m.name} {m.dosage}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Prescriptions */}
              {visit.prescriptions?.length > 0 && (
                <div>
                  <h5 className="text-xs font-black text-orange-700 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                    <FileText size={12} /> Prescriptions
                  </h5>
                  {visit.prescriptions.map((rx) => (
                    <div
                      key={rx._id}
                      className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 space-y-1"
                    >
                      {rx.medicines?.map((m, i) => (
                        <p key={i} className="text-xs text-(--text-secondary)">
                          • {m.name} {m.dosage} — {m.frequency} ({m.duration})
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {!visit.diagnosis &&
                !visit.symptoms &&
                visit.labTests?.length === 0 &&
                visit.ultrasounds?.length === 0 && (
                  <p className="text-sm text-(--text-muted) italic text-center py-2">
                    No clinical records for this visit yet.
                  </p>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

const PatientRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const { data, isLoading, error } = useGetPatientHistoryQuery(id, {
    skip: !id,
  });
  const { data: doctors = [] } = useGetAllUsersQuery("Doctor");
  const [createVisit, { isLoading: creating }] = useCreateVisitMutation();

  const canCreateVisit = ["Admin", "Receptionist"].includes(user?.role);
  const canEditVisit = ["Admin", "Doctor"].includes(user?.role);

  const [showNewVisit, setShowNewVisit] = useState(false);
  const [visitForm, setVisitForm] = useState({
    doctorId: "",
    department: "General OPD",
    visitDate: new Date().toISOString().slice(0, 10),
    symptoms: "",
    notes: "",
  });

  const handleCreateVisit = async (e) => {
    e.preventDefault();
    if (!visitForm.doctorId) return toast.error("Please select a doctor");
    try {
      await createVisit({ ...visitForm, patientId: id }).unwrap();
      toast.success("Visit created successfully");
      setShowNewVisit(false);
      setVisitForm({
        doctorId: "",
        department: "General OPD",
        visitDate: new Date().toISOString().slice(0, 10),
        symptoms: "",
        notes: "",
      });
    } catch (err) {
      toast.error(err?.data?.message || "Error creating visit");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="w-8 h-8 border-3 border-(--accent)/30 border-t-(--accent) rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-rose-400 mb-3" />
        <p className="text-(--text-primary) font-bold">Patient not found</p>
        <button onClick={() => navigate(-1)} className="btn btn-primary mt-4">
          Go Back
        </button>
      </div>
    );
  }

  const { patient, visits = [], summary } = data || {};

  return (
    <div className="space-y-6 font-['Outfit']">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-(--hover) text-(--text-muted) transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-(--text-primary) tracking-tight">
              Patient Record
            </h1>
            <p className="text-sm text-(--text-muted) font-medium">
              Complete medical history
            </p>
          </div>
        </div>
        {canCreateVisit && (
          <button
            onClick={() => setShowNewVisit(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} /> New Visit
          </button>
        )}
      </motion.div>

      {/* Patient Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
        className="glass-card p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-5 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-(--accent) to-(--accent-hover) flex items-center justify-center text-white text-2xl font-black shadow-lg">
            {patient?.fullName?.charAt(0) || "P"}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h2 className="text-xl font-black text-(--text-primary)">
                {patient?.fullName}
              </h2>
              <span className="flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full bg-(--accent)/10 text-(--accent) border border-(--accent)/20">
                <Hash size={12} /> {patient?.uid}
              </span>
            </div>
            <p className="text-sm text-(--text-muted) font-medium">
              {patient?.gender} • {patient?.age} years • {patient?.department}
            </p>
          </div>
          {/* Summary Chips */}
          <div className="flex gap-3 text-center">
            <div className="px-3 py-2 rounded-xl bg-(--hover)">
              <p className="text-lg font-black text-(--text-primary)">
                {summary?.totalVisits || 0}
              </p>
              <p className="text-xs text-(--text-muted) font-medium">Visits</p>
            </div>
            <div className="px-3 py-2 rounded-xl bg-(--hover)">
              <p className="text-lg font-black text-(--text-primary)">
                {summary?.totalLabTests || 0}
              </p>
              <p className="text-xs text-(--text-muted) font-medium">Labs</p>
            </div>
            <div className="px-3 py-2 rounded-xl bg-(--hover)">
              <p className="text-lg font-black text-(--text-primary)">
                {summary?.totalPrescriptions || 0}
              </p>
              <p className="text-xs text-(--text-muted) font-medium">Rx</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <InfoChip
            label="Phone"
            value={patient?.phone}
            icon={<Phone size={14} />}
          />
          <InfoChip
            label="Father/Husband"
            value={patient?.fatherOrHusbandName}
            icon={<User size={14} />}
          />
          <InfoChip
            label="Address"
            value={patient?.address}
            icon={<MapPin size={14} />}
          />
          <InfoChip
            label="Department"
            value={patient?.department}
            icon={<Stethoscope size={14} />}
          />
          {patient?.chronicConditions && (
            <div className="sm:col-span-2 flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10">
              <AlertCircle size={14} className="text-amber-600 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                  Chronic Conditions
                </p>
                <p className="text-sm text-(--text-primary)">
                  {patient?.chronicConditions}
                </p>
              </div>
            </div>
          )}
          {patient?.allergies && (
            <div className="sm:col-span-2 flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/10">
              <Heart size={14} className="text-rose-600 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-700 uppercase tracking-wide">
                  Allergies
                </p>
                <p className="text-sm text-(--text-primary)">
                  {patient?.allergies}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Visit Timeline */}
      <div>
        <h3 className="text-lg font-black text-(--text-primary) mb-4 flex items-center gap-2">
          <ClipboardList size={20} className="text-(--accent)" />
          Visit History ({visits.length})
        </h3>
        {visits.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <Calendar
              size={48}
              className="mx-auto opacity-20 mb-3 text-(--text-muted)"
            />
            <p className="text-(--text-muted) font-semibold">
              No visits recorded yet
            </p>
            {canCreateVisit && (
              <button
                onClick={() => setShowNewVisit(true)}
                className="btn btn-primary mt-4 flex items-center gap-2 mx-auto"
              >
                <Plus size={16} /> Create First Visit
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {visits.map((v, i) => (
              <VisitCard key={v._id} visit={v} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* New Visit Modal */}
      <AnimatePresence>
        {showNewVisit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewVisit(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-(--surface) rounded-3xl p-8 w-full max-w-lg border border-(--border) shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-(--text-primary)">
                  Create New Visit
                </h3>
                <button
                  onClick={() => setShowNewVisit(false)}
                  className="p-2 rounded-xl hover:bg-(--hover) text-(--text-muted)"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateVisit} className="space-y-4">
                <div className="form-group">
                  <label className="form-group label">Doctor *</label>
                  <select
                    className="form-control"
                    required
                    value={visitForm.doctorId}
                    onChange={(e) =>
                      setVisitForm((f) => ({ ...f, doctorId: e.target.value }))
                    }
                  >
                    <option value="">Select doctor...</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d._id}>
                        Dr. {d.fullname} — {d.department}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-group label">Department</label>
                    <select
                      className="form-control"
                      value={visitForm.department}
                      onChange={(e) =>
                        setVisitForm((f) => ({
                          ...f,
                          department: e.target.value,
                        }))
                      }
                    >
                      {[
                        "General OPD",
                        "Cardiology",
                        "Dental",
                        "Diabetology",
                      ].map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-group label">Visit Date</label>
                    <input
                      className="form-control"
                      type="date"
                      value={visitForm.visitDate}
                      onChange={(e) =>
                        setVisitForm((f) => ({
                          ...f,
                          visitDate: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-group label">Symptoms</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Patient's presenting symptoms..."
                    value={visitForm.symptoms}
                    onChange={(e) =>
                      setVisitForm((f) => ({ ...f, symptoms: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-group label">Notes</label>
                  <input
                    className="form-control"
                    placeholder="Optional notes..."
                    value={visitForm.notes}
                    onChange={(e) =>
                      setVisitForm((f) => ({ ...f, notes: e.target.value }))
                    }
                  />
                </div>
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full btn btn-primary"
                >
                  {creating ? "Creating..." : "Create Visit"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientRecord;
