import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  Stethoscope,
  Heart,
  Users,
  ClipboardList,
  Activity,
  Clock,
} from "lucide-react";
import { useGetTodayQueueQuery } from "../store/tokenApiSlice";

const StatCard = ({ icon, label, value, gradient }) => (
  <div className="glass-card p-5 flex items-center gap-4">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${gradient} shadow-lg`}
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

const VitalRow = ({ name, bp, pulse, temp, spo2 }) => (
  <tr className="hover:bg-(--hover) transition-colors">
    <td className="py-3 px-4 font-semibold text-(--text-primary) text-sm">
      {name}
    </td>
    <td className="py-3 px-4 text-sm text-(--text-secondary)">{bp || "—"}</td>
    <td className="py-3 px-4 text-sm text-(--text-secondary)">
      {pulse || "—"}
    </td>
    <td className="py-3 px-4 text-sm text-(--text-secondary)">{temp || "—"}</td>
    <td className="py-3 px-4 text-sm text-(--text-secondary)">{spo2 || "—"}</td>
    <td className="py-3 px-4">
      <span className="text-xs px-2 py-0.5 rounded-full bg-(--accent)/10 text-(--accent) border border-(--accent)/20 font-semibold">
        Recorded
      </span>
    </td>
  </tr>
);

const NurseDashboard = () => {
  const { user } = useSelector((s) => s.auth);
  const { data: queue = [], isLoading } = useGetTodayQueueQuery();

  const waiting = queue.filter((e) => e.status === "Waiting").length;
  const inProgress = queue.filter((e) => e.status === "In Progress").length;
  const done = queue.filter((e) => e.status === "Done").length;

  // Demo vitals (in production, this would come from a Vitals API)
  const demoVitals = queue.slice(0, 5).map((entry) => ({
    id: entry._id,
    name: entry.patient?.fullname || "Patient",
    bp: "120/80",
    pulse: "72 bpm",
    temp: "98.6°F",
    spo2: "98%",
  }));

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
            Welcome, {user?.fullname?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-(--text-muted) font-medium mt-1">
            Nurse Dashboard —{" "}
            {new Date().toLocaleDateString("en-PK", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-(--accent)/10 border border-(--accent)/20">
          <Clock size={16} className="text-(--accent)" />
          <span className="text-sm font-semibold text-(--accent)">
            {new Date().toLocaleTimeString("en-PK", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={20} />}
          label="Today's Queue"
          value={queue.length}
          gradient="from-slate-500 to-slate-600"
        />
        <StatCard
          icon={<Clock size={20} />}
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
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          {
            icon: <ClipboardList size={22} />,
            label: "Record Vitals",
            gradient: "from-teal-500 to-emerald-600",
          },
          {
            icon: <Heart size={22} />,
            label: "Patient Condition",
            gradient: "from-rose-500 to-pink-600",
          },
          {
            icon: <Activity size={22} />,
            label: "Monitor Queue",
            gradient: "from-blue-500 to-indigo-600",
          },
        ].map((action) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="glass-card p-5 flex flex-col items-center gap-3 hover:border-(--accent) transition-all text-center cursor-pointer"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${action.gradient} shadow-lg`}
            >
              {action.icon}
            </div>
            <span className="text-sm font-semibold text-(--text-primary)">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Vitals Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-(--accent) to-(--accent-hover) flex items-center justify-center text-white">
            <Heart size={16} />
          </div>
          <h3 className="font-bold text-(--text-primary)">Today's Vitals</h3>
        </div>
        {isLoading ? (
          <div className="text-center py-8 text-(--text-muted)">
            Loading queue...
          </div>
        ) : demoVitals.length === 0 ? (
          <div className="text-center py-8">
            <Users
              size={40}
              className="mx-auto opacity-20 mb-2 text-(--text-muted)"
            />
            <p className="text-(--text-muted) font-medium text-sm">
              No patients in queue
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--border)">
                  {["Patient", "BP", "Pulse", "Temp", "SpO2", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-4 text-xs font-bold text-(--text-muted) uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-(--border)">
                {demoVitals.map((v) => (
                  <VitalRow key={v.id} {...v} />
                ))}
              </tbody>
            </table>
            <p className="text-xs text-(--text-muted) mt-4 text-center">
              Demo vitals shown from today's queue — connect to Vitals API for
              real data
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NurseDashboard;
