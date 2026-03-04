import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Heart,
  Smile,
  Activity,
  Users,
  Calendar,
  Hash,
  Filter,
  Search,
} from "lucide-react";
import { useGetTodayQueueQuery } from "../store/tokenApiSlice";

const DEPARTMENTS = [
  {
    key: "all",
    label: "All Departments",
    icon: <Users size={16} />,
    color: "from-slate-500 to-slate-600",
  },
  {
    key: "General OPD",
    label: "General OPD",
    icon: <Stethoscope size={16} />,
    color: "from-teal-500 to-emerald-600",
  },
  {
    key: "Cardiology",
    label: "Cardiology",
    icon: <Heart size={16} />,
    color: "from-rose-500 to-pink-600",
  },
  {
    key: "Dental",
    label: "Dental",
    icon: <Smile size={16} />,
    color: "from-blue-500 to-indigo-600",
  },
  {
    key: "Diabetology",
    label: "Diabetology",
    icon: <Activity size={16} />,
    color: "from-orange-500 to-amber-600",
  },
];

const StatCard = ({ icon, label, value, gradient }) => (
  <div className="glass-card flex items-center gap-4 p-5">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${gradient} shadow-lg`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl font-black text-(--text-primary)">{value}</p>
    </div>
  </div>
);

const TokenBadge = ({ token }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-(--accent)/10 text-(--accent) text-xs font-bold border border-(--accent)/20">
    <Hash size={10} />#{token}
  </span>
);

const StatusDot = ({ status }) => {
  const map = {
    Waiting: "bg-yellow-400",
    "In Progress": "bg-blue-400",
    Done: "bg-emerald-400",
    Skipped: "bg-slate-400",
  };
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${map[status] || "bg-slate-400"}`}
    />
  );
};

const OpdModule = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeDept, setActiveDept] = useState("all");
  const [search, setSearch] = useState("");

  const { data: queue = [], isLoading } = useGetTodayQueueQuery();

  const filtered = queue.filter((entry) => {
    const nameMatch = entry.patient?.fullname
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const deptMatch =
      activeDept === "all" ||
      (entry.department || "General OPD") === activeDept;
    return nameMatch && deptMatch;
  });

  const totalToday = queue.length;
  const waiting = queue.filter((e) => e.status === "Waiting").length;
  const inProgress = queue.filter((e) => e.status === "In Progress").length;
  const done = queue.filter((e) => e.status === "Done").length;

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
            OPD Module
          </h1>
          <p className="text-sm text-(--text-muted) font-medium mt-1">
            Outpatient Department — Today's Queue by Department
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-(--accent)/10 border border-(--accent)/20">
          <Calendar size={16} className="text-(--accent)" />
          <span className="text-sm font-semibold text-(--accent)">
            {new Date().toLocaleDateString("en-PK", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          icon={<Users size={20} />}
          label="Total Today"
          value={totalToday}
          gradient="from-slate-500 to-slate-600"
        />
        <StatCard
          icon={<Hash size={20} />}
          label="Waiting"
          value={waiting}
          gradient="from-yellow-500 to-amber-600"
        />
        <StatCard
          icon={<Stethoscope size={20} />}
          label="In Progress"
          value={inProgress}
          gradient="from-blue-500 to-indigo-600"
        />
        <StatCard
          icon={<Activity size={20} />}
          label="Done"
          value={done}
          gradient="from-emerald-500 to-teal-600"
        />
      </motion.div>

      {/* Department Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
        className="flex flex-wrap gap-2"
      >
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept.key}
            onClick={() => setActiveDept(dept.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              activeDept === dept.key
                ? "bg-(--accent) text-white border-(--accent) shadow-lg"
                : "bg-(--surface) text-(--text-secondary) border-(--border) hover:border-(--accent) hover:text-(--accent)"
            }`}
          >
            {dept.icon}
            {dept.label}
          </button>
        ))}
      </motion.div>

      {/* Search + Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        className="glass-card p-6"
      >
        {/* Search */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-2 flex-1 bg-(--hover) border border-(--border) rounded-xl px-4 py-2.5 focus-within:border-(--accent) transition-colors">
            <Search size={16} className="text-(--text-muted)" />
            <input
              type="text"
              placeholder="Search patient by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm text-(--text-primary) placeholder-current w-full"
            />
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-(--text-muted)">
            <Filter size={14} />
            {filtered.length} patients
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="text-center py-12 text-(--text-muted)">
            Loading queue...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <Users
              size={48}
              className="mx-auto opacity-20 mb-3 text-(--text-muted)"
            />
            <p className="text-(--text-muted) font-medium">No patients found</p>
            <p className="text-xs text-(--text-muted) mt-1">
              {search
                ? "Try a different search"
                : "No queue entries for this department today"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--border)">
                  {[
                    "Token",
                    "Patient",
                    "Department",
                    "Doctor",
                    "Status",
                    "Time",
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
                {filtered.map((entry, i) => (
                  <motion.tr
                    key={entry._id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: i * 0.03 },
                    }}
                    className="hover:bg-(--hover) transition-colors"
                  >
                    <td className="py-3 px-4">
                      <TokenBadge token={entry.tokenNumber || i + 1} />
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-(--text-primary) text-sm">
                        {entry.patient?.fullname || "—"}
                      </p>
                      <p className="text-xs text-(--text-muted)">
                        {entry.patient?.email}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="badge badge-info text-xs">
                        {entry.department || "General OPD"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-(--text-secondary)">
                      {entry.doctor?.fullname || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-2 text-sm font-medium text-(--text-primary)">
                        <StatusDot status={entry.status} />
                        {entry.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-(--text-muted)">
                      {entry.createdAt
                        ? new Date(entry.createdAt).toLocaleTimeString(
                            "en-PK",
                            { hour: "2-digit", minute: "2-digit" },
                          )
                        : "—"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OpdModule;
