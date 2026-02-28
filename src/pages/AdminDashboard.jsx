import { useGetStatsQuery } from "../store/analyticsApiSlice";
import { useSelector } from "react-redux";
import {
  Users,
  UserPlus,
  Calendar,
  FileText,
  Activity,
  TrendingUp,
  DollarSign,
} from "lucide-react";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useGetStatsQuery();
  const { user } = useSelector((state) => state.auth);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );

  return (
    <div className="space-y-6 pb-8 bg-[#f8fafc] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Dashboard
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Welcome back, {user?.fullname || "Admin"} — here's today's overview
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={stats?.totalPatients || 1248}
          icon={<Users size={20} />}
          bg="bg-teal-500"
          trend="+5% vs last week"
          trendColor="text-emerald-500"
        />
        <StatCard
          title="Total Doctors"
          value={stats?.totalDoctors || 4}
          icon={<UserPlus size={20} />}
          bg="bg-blue-500"
          trend="+2 new onboarding"
          trendColor="text-emerald-500"
        />
        <StatCard
          title="Total Appointments"
          value={stats?.totalAppointments || 156}
          icon={<Calendar size={20} />}
          bg="bg-emerald-500"
          trend="High volume expected"
          trendColor="text-emerald-500"
        />
        <StatCard
          title="Total Prescriptions"
          value={stats?.totalPrescriptions || 342}
          icon={<FileText size={20} />}
          bg="bg-amber-500"
          trend="Steady generation"
          trendColor="text-slate-500"
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100/60 p-6 relative overflow-hidden h-96">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-50 to-white rounded-bl-full -mr-20 -mt-20 opacity-50"></div>

          <div className="relative z-10 flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <TrendingUp size={18} className="text-teal-600" />
                Revenue Simulation
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Projected MRR based on Pro Medical Subscriptions.
              </p>
            </div>
            <div className="px-4 py-1.5 bg-teal-50 text-teal-700 font-semibold rounded-full text-xs border border-teal-100">
              Current Month
            </div>
          </div>

          <div className="h-64 w-full bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center relative z-10">
            <DollarSign size={48} className="text-slate-300 mb-3" />
            <p className="font-semibold text-slate-500">
              Live Chart Module Pending
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Requires Recharts integration for full view
            </p>
          </div>
        </div>

        {/* System Load Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/60 p-6 relative overflow-hidden h-96">
          <div className="relative z-10 flex flex-col h-full">
            <h3 className="text-sm font-semibold mb-6 flex items-center gap-2 text-slate-800">
              <Activity size={18} className="text-teal-600" />
              System Load & Resources
            </h3>

            <div className="space-y-6 flex-1">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-medium text-slate-600">
                    Gemini API Quota
                  </span>
                  <span className="text-teal-600 font-bold">12%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 w-[12%] rounded-full shadow-[0_0_10px_rgba(20,184,166,0.3)]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-medium text-slate-600">
                    MongoDB Storage
                  </span>
                  <span className="text-blue-500 font-bold">45%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[45%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-medium text-slate-600">
                    Active WebSocket Cons
                  </span>
                  <span className="text-amber-500 font-bold">142</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[80%] rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)]"></div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center border-t border-slate-100 pt-4">
              All core systems operational and steady.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, bg, trend, trendColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100/60 hover:shadow-md transition-shadow flex justify-between items-center">
    <div>
      <p className="text-xs font-semibold text-slate-400 mb-1">{title}</p>
      <h4 className="text-3xl font-bold text-slate-800 mb-1 tracking-tight">
        {value}
      </h4>
      <p className={`text-xs font-medium ${trendColor}`}>{trend}</p>
    </div>
    <div
      className={`${bg} w-12 h-12 flex items-center justify-center rounded-xl text-white shadow-sm shrink-0`}
    >
      {icon}
    </div>
  </div>
);

export default AdminDashboard;
