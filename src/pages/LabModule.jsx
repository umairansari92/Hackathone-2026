import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FlaskConical,
  Plus,
  CheckCircle,
  Clock,
  Loader2,
  X,
  Search,
} from "lucide-react";
import {
  useGetLabTestsQuery,
  useCreateLabTestMutation,
  useUpdateLabTestMutation,
  useGetLabStatsQuery,
} from "../store/labApiSlice";
import toast from "react-hot-toast";

const TEST_TYPES = ["Blood", "Urine", "Stool", "Culture", "Biopsy", "Other"];

const statusConfig = {
  Pending: { color: "badge-warning", icon: <Clock size={12} /> },
  Processing: {
    color: "badge-info",
    icon: <Loader2 size={12} className="animate-spin" />,
  },
  Done: { color: "badge-success", icon: <CheckCircle size={12} /> },
  Cancelled: { color: "badge-danger", icon: <X size={12} /> },
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="glass-card p-5 flex items-center gap-4">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${color}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-(--text-muted) uppercase tracking-wider">
        {label}
      </p>
      <p className="text-2xl font-black text-(--text-primary)">
        {value ?? "—"}
      </p>
    </div>
  </div>
);

const LabModule = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [form, setForm] = useState({
    patient: "",
    testName: "",
    testType: "Blood",
    fee: "",
    notes: "",
  });
  const [selectedTest, setSelectedTest] = useState(null);
  const [resultText, setResultText] = useState("");

  const { data: tests = [], isLoading } = useGetLabTestsQuery(
    filterStatus ? { status: filterStatus } : {},
  );
  const { data: stats } = useGetLabStatsQuery();
  const [createLabTest, { isLoading: creating }] = useCreateLabTestMutation();
  const [updateLabTest, { isLoading: updating }] = useUpdateLabTestMutation();

  const filtered = tests.filter(
    (t) =>
      t.patient?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      t.testName?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createLabTest(form).unwrap();
      toast.success("Lab test created!");
      setForm({
        patient: "",
        testName: "",
        testType: "Blood",
        fee: "",
        notes: "",
      });
      setShowForm(false);
    } catch (err) {
      toast.error(err?.data?.message || "Error creating test");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateLabTest({
        id,
        status,
        ...(status === "Done" ? { result: resultText } : {}),
      }).unwrap();
      toast.success(`Status updated to ${status}`);
      setSelectedTest(null);
      setResultText("");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="space-y-6 font-['Outfit']">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-black text-(--text-primary) tracking-tight">
            Lab Module
          </h1>
          <p className="text-sm text-(--text-muted) font-medium mt-1">
            Manage lab test orders and results
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> New Lab Test
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FlaskConical size={20} />}
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
          icon={<Loader2 size={20} />}
          label="Processing"
          value={stats?.processing}
          color="from-blue-500 to-indigo-600"
        />
        <StatCard
          icon={<CheckCircle size={20} />}
          label="Done"
          value={stats?.done}
          color="from-emerald-500 to-teal-600"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {["", "Pending", "Processing", "Done"].map((s) => (
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
            placeholder="Search by patient or test..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-(--text-primary) w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card p-6">
        {isLoading ? (
          <div className="text-center py-12 text-(--text-muted)">
            Loading lab tests...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <FlaskConical
              size={48}
              className="mx-auto opacity-20 mb-3 text-(--text-muted)"
            />
            <p className="text-(--text-muted) font-medium">
              No lab tests found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--border)">
                  {[
                    "Patient",
                    "Test Name",
                    "Type",
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
                {filtered.map((test, i) => {
                  const sc = statusConfig[test.status] || statusConfig.Pending;
                  return (
                    <motion.tr
                      key={test._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: i * 0.03 } }}
                      className="hover:bg-(--hover) transition-colors"
                    >
                      <td className="py-3 px-4">
                        <p className="font-semibold text-(--text-primary) text-sm">
                          {test.patient?.fullname || "—"}
                        </p>
                        <p className="text-xs text-(--text-muted)">
                          {test.patient?.email}
                        </p>
                      </td>
                      <td className="py-3 px-4 font-medium text-(--text-primary) text-sm">
                        {test.testName}
                      </td>
                      <td className="py-3 px-4 text-sm text-(--text-secondary)">
                        {test.testType}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`badge ${sc.color} flex items-center gap-1 w-fit`}
                        >
                          {sc.icon}
                          {test.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-(--text-primary) font-semibold">
                        Rs. {test.fee || 0}
                      </td>
                      <td className="py-3 px-4 text-xs text-(--text-muted)">
                        {new Date(test.createdAt).toLocaleDateString("en-PK")}
                      </td>
                      <td className="py-3 px-4">
                        {test.status !== "Done" &&
                          test.status !== "Cancelled" && (
                            <div className="flex gap-1">
                              {test.status === "Pending" && (
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(test._id, "Processing")
                                  }
                                  className="text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-200 hover:bg-blue-500/20 font-semibold transition-colors"
                                >
                                  Process
                                </button>
                              )}
                              {test.status === "Processing" && (
                                <button
                                  onClick={() => {
                                    setSelectedTest(test);
                                    setResultText("");
                                  }}
                                  className="text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-200 hover:bg-emerald-500/20 font-semibold transition-colors"
                                >
                                  Add Result
                                </button>
                              )}
                            </div>
                          )}
                        {test.status === "Done" && test.result && (
                          <p
                            className="text-xs text-(--text-muted) max-w-[120px] truncate"
                            title={test.result}
                          >
                            {test.result}
                          </p>
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-(--surface) rounded-3xl p-8 w-full max-w-md border border-(--border) shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-(--text-primary)">
                  New Lab Test Order
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-xl hover:bg-(--hover) text-(--text-muted) transition-colors"
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
                <div className="form-group">
                  <label className="form-group label">Test Name</label>
                  <input
                    className="form-control"
                    placeholder="e.g. Complete Blood Count"
                    required
                    value={form.testName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, testName: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-group label">Test Type</label>
                    <select
                      className="form-control"
                      value={form.testType}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, testType: e.target.value }))
                      }
                    >
                      {TEST_TYPES.map((t) => (
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
                      placeholder="0"
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
                    placeholder="Optional notes..."
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
                  {creating ? "Creating..." : "Create Lab Test"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Modal */}
      <AnimatePresence>
        {selectedTest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTest(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-(--surface) rounded-3xl p-8 w-full max-w-md border border-(--border) shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-black text-(--text-primary) mb-2">
                Enter Test Result
              </h3>
              <p className="text-sm text-(--text-muted) mb-6">
                {selectedTest.testName} for {selectedTest.patient?.fullname}
              </p>
              <textarea
                className="form-control mb-4"
                rows={4}
                placeholder="Enter test result details..."
                value={resultText}
                onChange={(e) => setResultText(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTest(null)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  disabled={!resultText || updating}
                  onClick={() => handleStatusUpdate(selectedTest._id, "Done")}
                  className="btn btn-primary flex-1"
                >
                  {updating ? "Saving..." : "Mark Done"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LabModule;
