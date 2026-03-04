import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pill,
  Plus,
  X,
  CheckCircle,
  Clock,
  Trash2,
  Search,
} from "lucide-react";
import {
  useGetPharmacyRecordsQuery,
  useCreatePharmacyRecordMutation,
  useUpdateDispenseStatusMutation,
  useGetPharmacyStatsQuery,
} from "../store/pharmacyApiSlice";
import toast from "react-hot-toast";

const statusConfig = {
  Pending: { badge: "badge-warning", icon: <Clock size={12} /> },
  Dispensed: { badge: "badge-success", icon: <CheckCircle size={12} /> },
  Cancelled: { badge: "badge-danger", icon: <X size={12} /> },
};

const emptyMed = { name: "", quantity: 1, unitPrice: 0 };

const StatCard = ({ icon, label, value, sub, color }) => (
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
      {sub && <p className="text-xs text-(--text-muted)">{sub}</p>}
    </div>
  </div>
);

const PharmacyModule = () => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [patientId, setPatientId] = useState("");
  const [notes, setNotes] = useState("");
  const [medicines, setMedicines] = useState([{ ...emptyMed }]);

  const { data: records = [], isLoading } = useGetPharmacyRecordsQuery(
    filterStatus ? { status: filterStatus } : {},
  );
  const { data: stats } = useGetPharmacyStatsQuery();
  const [createRecord, { isLoading: creating }] =
    useCreatePharmacyRecordMutation();
  const [updateStatus, { isLoading: updating }] =
    useUpdateDispenseStatusMutation();

  const filtered = records.filter((r) =>
    r.patient?.fullname?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalCalc = medicines.reduce(
    (s, m) => s + (m.quantity || 0) * (m.unitPrice || 0),
    0,
  );

  const addMed = () => setMedicines((m) => [...m, { ...emptyMed }]);
  const removeMed = (i) => setMedicines((m) => m.filter((_, idx) => idx !== i));
  const updateMed = (i, field, val) =>
    setMedicines((m) =>
      m.map((med, idx) => (idx === i ? { ...med, [field]: val } : med)),
    );

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createRecord({ patient: patientId, medicines, notes }).unwrap();
      toast.success("Pharmacy record created!");
      setPatientId("");
      setNotes("");
      setMedicines([{ ...emptyMed }]);
      setShowForm(false);
    } catch (err) {
      toast.error(err?.data?.message || "Error");
    }
  };

  const handleDispense = async (id) => {
    try {
      await updateStatus({ id, status: "Dispensed" }).unwrap();
      toast.success("Medicines dispensed!");
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
            Pharmacy Module
          </h1>
          <p className="text-sm text-(--text-muted) font-medium mt-1">
            Medicine dispensing and records
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> New Record
        </button>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Pill size={20} />}
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
          icon={<CheckCircle size={20} />}
          label="Dispensed"
          value={stats?.dispensed}
          color="from-emerald-500 to-teal-600"
        />
        <StatCard
          icon={<Pill size={20} />}
          label="Revenue"
          value={`Rs. ${(stats?.revenue || 0).toLocaleString()}`}
          color="from-purple-500 to-pink-600"
        />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {["", "Pending", "Dispensed"].map((s) => (
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
            placeholder="Search patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-(--text-primary) w-full"
          />
        </div>
      </div>

      <div className="glass-card p-6">
        {isLoading ? (
          <div className="text-center py-12 text-(--text-muted)">
            Loading records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Pill
              size={48}
              className="mx-auto opacity-20 mb-3 text-(--text-muted)"
            />
            <p className="text-(--text-muted) font-medium">
              No pharmacy records
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--border)">
                  {[
                    "Patient",
                    "Medicines",
                    "Total",
                    "Status",
                    "Date",
                    "Action",
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
                      </td>
                      <td className="py-3 px-4 text-sm text-(--text-secondary)">
                        {r.medicines?.map((m) => m.name).join(", ") || "—"}
                      </td>
                      <td className="py-3 px-4 font-bold text-(--text-primary) text-sm">
                        Rs. {r.totalAmount || 0}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`badge ${sc.badge} flex items-center gap-1 w-fit`}
                        >
                          {sc.icon}
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-(--text-muted)">
                        {new Date(r.createdAt).toLocaleDateString("en-PK")}
                      </td>
                      <td className="py-3 px-4">
                        {r.status === "Pending" && (
                          <button
                            disabled={updating}
                            onClick={() => handleDispense(r._id)}
                            className="text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-200 hover:bg-emerald-500/20 font-semibold transition-colors"
                          >
                            Dispense
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
              className="bg-(--surface) rounded-3xl p-8 w-full max-w-lg border border-(--border) shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-(--text-primary)">
                  New Pharmacy Record
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-xl hover:bg-(--hover) text-(--text-muted)"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-5">
                <div className="form-group">
                  <label className="form-group label">Patient ID</label>
                  <input
                    className="form-control"
                    required
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-(--text-muted) uppercase tracking-wide">
                      Medicines
                    </label>
                    <button
                      type="button"
                      onClick={addMed}
                      className="text-xs px-3 py-1 rounded-lg bg-(--accent)/10 text-(--accent) border border-(--accent)/20 font-semibold"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {medicines.map((m, i) => (
                      <div key={i} className="grid grid-cols-3 gap-2 items-end">
                        <input
                          className="form-control text-sm"
                          placeholder="Medicine name"
                          value={m.name}
                          onChange={(e) => updateMed(i, "name", e.target.value)}
                        />
                        <input
                          className="form-control text-sm"
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={m.quantity}
                          onChange={(e) =>
                            updateMed(i, "quantity", Number(e.target.value))
                          }
                        />
                        <div className="flex gap-1">
                          <input
                            className="form-control text-sm flex-1"
                            type="number"
                            min="0"
                            placeholder="Price"
                            value={m.unitPrice}
                            onChange={(e) =>
                              updateMed(i, "unitPrice", Number(e.target.value))
                            }
                          />
                          {medicines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMed(i)}
                              className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-right font-bold text-(--text-primary)">
                    Total: Rs. {totalCalc}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-group label">Notes</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn btn-primary w-full"
                >
                  {creating ? "Creating..." : "Create Record"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PharmacyModule;
