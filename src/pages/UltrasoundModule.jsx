import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scan,
  Plus,
  X,
  CheckCircle,
  Clock,
  FileText,
  Search,
} from "lucide-react";
import {
  useGetUltrasoundsQuery,
  useCreateUltrasoundMutation,
  useUpdateUltrasoundMutation,
  useGetUltrasoundStatsQuery,
} from "../store/ultrasoundApiSlice";
import toast from "react-hot-toast";

const SCAN_TYPES = [
  "Abdominal",
  "Pelvic",
  "Obstetric",
  "Thyroid",
  "Cardiac Echo",
  "Musculoskeletal",
  "Other",
];

const statusConfig = {
  Pending: { badge: "badge-warning", icon: <Clock size={12} /> },
  "In Progress": { badge: "badge-info", icon: <Scan size={12} /> },
  Reported: { badge: "badge-success", icon: <CheckCircle size={12} /> },
  Cancelled: { badge: "badge-danger", icon: <X size={12} /> },
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="glass-card p-5 flex items-center gap-4">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${color} shadow-lg`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-(--text-muted) uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-black text-(--text-primary)">
        {value ?? "—"}
      </p>
    </div>
  </div>
);

const UltrasoundModule = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [form, setForm] = useState({
    patient: "",
    scanType: "Abdominal",
    fee: "",
    notes: "",
  });
  const [findingsForm, setFindingsForm] = useState({
    findings: "",
    impression: "",
  });

  const { data: reports = [], isLoading } = useGetUltrasoundsQuery(
    filterStatus ? { status: filterStatus } : {},
  );
  const { data: stats } = useGetUltrasoundStatsQuery();
  const [createUltrasound, { isLoading: creating }] =
    useCreateUltrasoundMutation();
  const [updateUltrasound, { isLoading: updating }] =
    useUpdateUltrasoundMutation();

  const filtered = reports.filter(
    (r) =>
      r.patient?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      r.scanType?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createUltrasound(form).unwrap();
      toast.success("Ultrasound scan created!");
      setForm({ patient: "", scanType: "Abdominal", fee: "", notes: "" });
      setShowForm(false);
    } catch (err) {
      toast.error(err?.data?.message || "Error creating scan");
    }
  };

  const handleReport = async () => {
    try {
      await updateUltrasound({
        id: selectedReport._id,
        status: "Reported",
        ...findingsForm,
      }).unwrap();
      toast.success("Report submitted!");
      setSelectedReport(null);
      setFindingsForm({ findings: "", impression: "" });
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="space-y-6 font-['Outfit']">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-black text-(--text-primary) tracking-tight">
            Ultrasound Module
          </h1>
          <p className="text-sm text-(--text-muted) font-medium mt-1">
            Manage ultrasound scans and reports
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> New Scan
        </button>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Scan size={20} />}
          label="Total"
          value={stats?.total}
          color="from-slate-500 to-slate-600"
        />
        <StatCard
          icon={<Clock size={20} />}
          label="Pending"
          value={stats?.pending}
          color="from-yellow-500 to-amber-600"
        />
        <StatCard
          icon={<Scan size={20} />}
          label="In Progress"
          value={stats?.inProgress}
          color="from-blue-500 to-indigo-600"
        />
        <StatCard
          icon={<CheckCircle size={20} />}
          label="Reported"
          value={stats?.reported}
          color="from-emerald-500 to-teal-600"
        />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {["", "Pending", "In Progress", "Reported"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              filterStatus === s
                ? "bg-(--accent) text-white border-(--accent)"
                : "bg-(--surface) text-(--text-secondary) border-(--border) hover:border-(--accent)"
            }`}
          >
            {s || "All"}
          </button>
        ))}
        <div className="flex items-center gap-2 flex-1 min-w-48 bg-(--hover) border border-(--border) rounded-xl px-3 py-2 focus-within:border-(--accent) transition-colors">
          <Search size={14} className="text-(--text-muted)" />
          <input
            type="text"
            placeholder="Search patient or scan type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-(--text-primary) w-full"
          />
        </div>
      </div>

      <div className="glass-card p-6">
        {isLoading ? (
          <div className="text-center py-12 text-(--text-muted)">
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Scan
              size={48}
              className="mx-auto opacity-20 mb-3 text-(--text-muted)"
            />
            <p className="text-(--text-muted) font-medium">
              No ultrasound scans found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--border)">
                  {[
                    "Patient",
                    "Scan Type",
                    "Status",
                    "Fee",
                    "Date",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-4 text-xs font-bold text-(--text-muted) uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-(--border)">
                {filtered.map((r, i) => {
                  const sc = statusConfig[r.status] || statusConfig.Pending;
                  return (
                    <motion.tr
                      key={r._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: i * 0.03 } }}
                      className="hover:bg-(--hover) transition-colors"
                    >
                      <td className="py-3 px-4">
                        <p className="font-semibold text-(--text-primary) text-sm">
                          {r.patient?.fullname || "—"}
                        </p>
                        <p className="text-xs text-(--text-muted)">
                          {r.patient?.email}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-(--text-primary)">
                        {r.scanType}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`badge ${sc.badge} flex items-center gap-1 w-fit`}
                        >
                          {sc.icon}
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-(--text-primary)">
                        Rs. {r.fee || 0}
                      </td>
                      <td className="py-3 px-4 text-xs text-(--text-muted)">
                        {new Date(r.createdAt).toLocaleDateString("en-PK")}
                      </td>
                      <td className="py-3 px-4">
                        {(r.status === "Pending" ||
                          r.status === "In Progress") && (
                          <button
                            onClick={() => {
                              setSelectedReport(r);
                              setFindingsForm({
                                findings: r.findings || "",
                                impression: r.impression || "",
                              });
                            }}
                            className="text-xs px-2 py-1 rounded-lg bg-(--accent)/10 text-(--accent) border border-(--accent)/20 hover:bg-(--accent)/20 font-semibold transition-colors flex items-center gap-1"
                          >
                            <FileText size={12} /> Report
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-(--surface) rounded-3xl p-8 w-full max-w-md border border-(--border) shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-(--text-primary)">
                  New Ultrasound Scan
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-xl hover:bg-(--hover) text-(--text-muted)"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="form-group">
                  <label className="form-group label">Patient ID</label>
                  <input
                    className="form-control"
                    placeholder="Patient MongoDB ID"
                    required
                    value={form.patient}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, patient: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-group label">Scan Type</label>
                    <select
                      className="form-control"
                      value={form.scanType}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, scanType: e.target.value }))
                      }
                    >
                      {SCAN_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-group label">Fee (Rs.)</label>
                    <input
                      className="form-control"
                      type="number"
                      min="0"
                      value={form.fee}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, fee: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-group label">Notes</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={form.notes}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, notes: e.target.value }))
                    }
                  />
                </div>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn btn-primary w-full"
                >
                  {creating ? "Creating..." : "Create Scan"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-(--surface) rounded-3xl p-8 w-full max-w-md border border-(--border) shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-black text-(--text-primary) mb-2">
                Ultrasound Report
              </h3>
              <p className="text-sm text-(--text-muted) mb-6">
                {selectedReport.scanType} — {selectedReport.patient?.fullname}
              </p>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-group label">Findings</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Describe ultrasound findings..."
                    value={findingsForm.findings}
                    onChange={(e) =>
                      setFindingsForm((f) => ({
                        ...f,
                        findings: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label className="form-group label">Impression</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Clinical impression..."
                    value={findingsForm.impression}
                    onChange={(e) =>
                      setFindingsForm((f) => ({
                        ...f,
                        impression: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  disabled={!findingsForm.findings || updating}
                  onClick={handleReport}
                  className="btn btn-primary flex-1"
                >
                  {updating ? "Saving..." : "Submit Report"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UltrasoundModule;
