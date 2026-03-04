import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Scale,
  Plus,
  X,
  Trash2,
  Filter,
} from "lucide-react";
import {
  useGetAccountEntriesQuery,
  useGetAccountSummaryQuery,
  useCreateAccountEntryMutation,
  useDeleteAccountEntryMutation,
} from "../store/accountApiSlice";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const CATEGORIES = [
  "OPD Fee",
  "Lab Fee",
  "Ultrasound Fee",
  "Pharmacy Sale",
  "Consultation",
  "Staff Salary",
  "Utilities",
  "Supplies",
  "Equipment",
  "Other",
];

const SummaryCard = ({ icon, label, value, gradient, textColor }) => (
  <div className="glass-card p-6">
    <div className="flex items-center gap-3 mb-3">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${gradient} shadow-lg`}
      >
        {icon}
      </div>
      <span className="text-xs font-bold text-(--text-muted) uppercase tracking-wider">
        {label}
      </span>
    </div>
    <p className={`text-3xl font-black ${textColor}`}>
      Rs. {Number(value || 0).toLocaleString()}
    </p>
  </div>
);

const AccountsModule = () => {
  const { user } = useSelector((s) => s.auth);
  const isAdmin = user?.role === "Admin";
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [form, setForm] = useState({
    type: "Income",
    category: "OPD Fee",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const { data: entries = [], isLoading } = useGetAccountEntriesQuery(
    filterType ? { type: filterType } : {},
  );
  const { data: summary } = useGetAccountSummaryQuery({});
  const [createEntry, { isLoading: creating }] =
    useCreateAccountEntryMutation();
  const [deleteEntry] = useDeleteAccountEntryMutation();

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createEntry(form).unwrap();
      toast.success(`${form.type} entry added!`);
      setForm({
        type: "Income",
        category: "OPD Fee",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      setShowForm(false);
    } catch (err) {
      toast.error(err?.data?.message || "Error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this entry?")) return;
    try {
      await deleteEntry(id).unwrap();
      toast.success("Entry deleted");
    } catch {
      toast.error("Delete failed");
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
            Accounts Module
          </h1>
          <p className="text-sm text-(--text-muted) font-medium mt-1">
            Financial records, income and expenses
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} /> Add Entry
        </button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          icon={<TrendingUp size={18} />}
          label="Total Income"
          value={summary?.totalIncome}
          gradient="from-emerald-500 to-teal-600"
          textColor="text-emerald-600"
        />
        <SummaryCard
          icon={<TrendingDown size={18} />}
          label="Total Expenses"
          value={summary?.totalExpense}
          gradient="from-rose-500 to-pink-600"
          textColor="text-rose-600"
        />
        <SummaryCard
          icon={<Scale size={18} />}
          label="Net Balance"
          value={summary?.netBalance}
          gradient="from-blue-500 to-indigo-600"
          textColor={
            summary?.netBalance >= 0 ? "text-blue-600" : "text-rose-600"
          }
        />
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["", "Income", "Expense"].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              filterType === t
                ? "bg-(--accent) text-white border-(--accent)"
                : "bg-(--surface) text-(--text-secondary) border-(--border) hover:border-(--accent)"
            }`}
          >
            {t || "All"}
          </button>
        ))}
        <div className="flex items-center gap-2 ml-auto text-xs font-semibold text-(--text-muted)">
          <Filter size={14} />
          {entries.length} entries
        </div>
      </div>

      {/* Entries Table */}
      <div className="glass-card p-6">
        {isLoading ? (
          <div className="text-center py-12 text-(--text-muted)">
            Loading entries...
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign
              size={48}
              className="mx-auto opacity-20 mb-3 text-(--text-muted)"
            />
            <p className="text-(--text-muted) font-medium">No entries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--border)">
                  {[
                    "Type",
                    "Category",
                    "Amount",
                    "Description",
                    "Date",
                    "By",
                    ...(isAdmin ? [""] : []),
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
                {entries.map((e, i) => (
                  <motion.tr
                    key={e._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: i * 0.03 } }}
                    className="hover:bg-(--hover) transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span
                        className={`badge ${e.type === "Income" ? "badge-success" : "badge-danger"} flex items-center gap-1 w-fit`}
                      >
                        {e.type === "Income" ? (
                          <TrendingUp size={12} />
                        ) : (
                          <TrendingDown size={12} />
                        )}
                        {e.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-(--text-secondary)">
                      {e.category}
                    </td>
                    <td className="py-3 px-4 font-bold text-sm">
                      <span
                        className={
                          e.type === "Income"
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }
                      >
                        {e.type === "Income" ? "+" : "-"} Rs.{" "}
                        {Number(e.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-(--text-secondary) max-w-[150px] truncate">
                      {e.description || "—"}
                    </td>
                    <td className="py-3 px-4 text-xs text-(--text-muted)">
                      {new Date(e.date).toLocaleDateString("en-PK")}
                    </td>
                    <td className="py-3 px-4 text-xs text-(--text-muted)">
                      {e.createdBy?.fullname || "—"}
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDelete(e._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
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
                  Add Entry
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 rounded-xl hover:bg-(--hover) text-(--text-muted)"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {["Income", "Expense"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, type: t }))}
                      className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                        form.type === t
                          ? t === "Income"
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : "bg-rose-500 text-white border-rose-500"
                          : "bg-(--surface) text-(--text-secondary) border-(--border) hover:border-(--accent)"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="form-group">
                  <label className="form-group label">Category</label>
                  <select
                    className="form-control"
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-group label">Amount (Rs.)</label>
                    <input
                      className="form-control"
                      type="number"
                      min="0"
                      required
                      value={form.amount}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, amount: e.target.value }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-group label">Date</label>
                    <input
                      className="form-control"
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, date: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-group label">Description</label>
                  <input
                    className="form-control"
                    placeholder="Optional description..."
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                  />
                </div>
                <button
                  type="submit"
                  disabled={creating}
                  className={`w-full py-3 rounded-xl font-bold text-sm text-white transition-all ${
                    form.type === "Income"
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-rose-500 hover:bg-rose-600"
                  }`}
                >
                  {creating ? "Saving..." : `Add ${form.type}`}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountsModule;
