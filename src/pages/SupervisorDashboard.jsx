import { motion } from "framer-motion";
import {
  Users,
  FlaskConical,
  Scan,
  Pill,
  DollarSign,
  TrendingUp,
  Activity,
  BarChart3,
} from "lucide-react";
import { useGetLabStatsQuery } from "../store/labApiSlice";
import { useGetUltrasoundStatsQuery } from "../store/ultrasoundApiSlice";
import { useGetPharmacyStatsQuery } from "../store/pharmacyApiSlice";
import { useGetAccountSummaryQuery } from "../store/accountApiSlice";

const StatCard = ({ icon, label, value, sub, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0, transition: { delay } }}
    className="glass-card p-6"
  >
    <div className="flex items-start justify-between mb-4">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${gradient} shadow-lg`}
      >
        {icon}
      </div>
    </div>
    <p className="text-3xl font-black text-(--text-primary) mb-1">
      {value ?? "—"}
    </p>
    <p className="text-sm font-semibold text-(--text-secondary)">{label}</p>
    {sub && <p className="text-xs text-(--text-muted) mt-1">{sub}</p>}
  </motion.div>
);

const MiniCard = ({ label, value, color }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-(--hover)">
    <span className="text-sm text-(--text-secondary) font-medium">{label}</span>
    <span className={`text-sm font-bold ${color}`}>{value}</span>
  </div>
);

const SupervisorDashboard = () => {
  const { data: labStats } = useGetLabStatsQuery();
  const { data: usStats } = useGetUltrasoundStatsQuery();
  const { data: pharmStats } = useGetPharmacyStatsQuery();
  const { data: accSummary } = useGetAccountSummaryQuery({});

  return (
    <div className="space-y-8 font-['Outfit']">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-black text-(--text-primary) tracking-tight">
          Supervisor Dashboard
        </h1>
        <p className="text-sm text-(--text-muted) font-medium mt-1">
          Cross-module overview —{" "}
          {new Date().toLocaleDateString("en-PK", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FlaskConical size={22} />}
          label="Lab Tests Total"
          value={labStats?.total}
          sub={`${labStats?.pending ?? 0} pending`}
          gradient="from-blue-500 to-indigo-600"
          delay={0.05}
        />
        <StatCard
          icon={<Scan size={22} />}
          label="Ultrasound Scans"
          value={usStats?.total}
          sub={`${usStats?.pending ?? 0} pending`}
          gradient="from-purple-500 to-violet-600"
          delay={0.1}
        />
        <StatCard
          icon={<Pill size={22} />}
          label="Pharmacy Records"
          value={pharmStats?.total}
          sub={`${pharmStats?.pending ?? 0} pending`}
          gradient="from-emerald-500 to-teal-600"
          delay={0.15}
        />
        <StatCard
          icon={<DollarSign size={22} />}
          label="Net Balance"
          value={`Rs. ${Number(accSummary?.netBalance || 0).toLocaleString()}`}
          sub={`${accSummary?.totalEntries ?? 0} entries`}
          gradient="from-amber-500 to-orange-600"
          delay={0.2}
        />
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lab Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <FlaskConical size={18} />
            </div>
            <h3 className="font-bold text-(--text-primary)">Lab Status</h3>
          </div>
          <div className="space-y-2">
            <MiniCard
              label="Pending"
              value={labStats?.pending ?? 0}
              color="text-yellow-600"
            />
            <MiniCard
              label="Processing"
              value={labStats?.processing ?? 0}
              color="text-blue-600"
            />
            <MiniCard
              label="Done"
              value={labStats?.done ?? 0}
              color="text-emerald-600"
            />
          </div>
        </motion.div>

        {/* Ultrasound Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white shadow-lg">
              <Scan size={18} />
            </div>
            <h3 className="font-bold text-(--text-primary)">
              Ultrasound Status
            </h3>
          </div>
          <div className="space-y-2">
            <MiniCard
              label="Pending"
              value={usStats?.pending ?? 0}
              color="text-yellow-600"
            />
            <MiniCard
              label="In Progress"
              value={usStats?.inProgress ?? 0}
              color="text-blue-600"
            />
            <MiniCard
              label="Reported"
              value={usStats?.reported ?? 0}
              color="text-emerald-600"
            />
          </div>
        </motion.div>

        {/* Finance Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.35 } }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
              <BarChart3 size={18} />
            </div>
            <h3 className="font-bold text-(--text-primary)">
              Finance Overview
            </h3>
          </div>
          <div className="space-y-2">
            <MiniCard
              label="Total Income"
              value={`Rs. ${Number(accSummary?.totalIncome || 0).toLocaleString()}`}
              color="text-emerald-600"
            />
            <MiniCard
              label="Total Expense"
              value={`Rs. ${Number(accSummary?.totalExpense || 0).toLocaleString()}`}
              color="text-rose-600"
            />
            <div className="h-px bg-(--border) my-2" />
            <MiniCard
              label="Net Balance"
              value={`Rs. ${Number(accSummary?.netBalance || 0).toLocaleString()}`}
              color={
                accSummary?.netBalance >= 0
                  ? "text-emerald-700 font-black"
                  : "text-rose-700 font-black"
              }
            />
            <MiniCard
              label="Pharma Revenue"
              value={`Rs. ${Number(pharmStats?.revenue || 0).toLocaleString()}`}
              color="text-blue-600"
            />
          </div>
        </motion.div>
      </div>

      {/* Quick Summary Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.4 } }}
        className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-(--accent) to-(--accent-hover) flex items-center justify-center text-white shadow-lg">
            <Activity size={18} />
          </div>
          <div>
            <h4 className="font-bold text-(--text-primary)">System Status</h4>
            <p className="text-xs text-(--text-muted)">
              All modules operational
            </p>
          </div>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <p className="text-xs text-(--text-muted) font-medium">Pharmacy</p>
            <p className="text-lg font-black text-(--text-primary)">
              {pharmStats?.dispensed ?? 0} dispensed
            </p>
          </div>
          <div>
            <p className="text-xs text-(--text-muted) font-medium">Lab</p>
            <p className="text-lg font-black text-(--text-primary)">
              {labStats?.done ?? 0} completed
            </p>
          </div>
          <div>
            <p className="text-xs text-(--text-muted) font-medium">
              Ultrasound
            </p>
            <p className="text-lg font-black text-(--text-primary)">
              {usStats?.reported ?? 0} reported
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SupervisorDashboard;
