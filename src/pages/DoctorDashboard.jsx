import { useGetStatsQuery } from "../store/analyticsApiSlice";
import { useSelector } from "react-redux";
import {
  Users,
  Calendar,
  FileText,
  Activity,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const DoctorDashboard = () => {
  const { data: stats, isLoading } = useGetStatsQuery();
  const { user } = useSelector((state) => state.auth);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );

  const getDocName = () => {
    if (!user?.fullname) return "";
    return user.fullname.startsWith("Dr")
      ? user.fullname
      : `Dr. ${user.fullname}`;
  };

  return (
    <div className="space-y-6 pb-8 bg-[#f8fafc] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Dashboard
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Welcome back, {getDocName()} — here's today's overview
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
          trend="+12% from last month"
          trendColor="text-emerald-500"
        />
        <StatCard
          title="Today's Appointments"
          value={stats?.dailyAppointments || 18}
          icon={<Calendar size={20} />}
          bg="bg-blue-500"
          trend="3 remaining"
          trendColor="text-slate-500"
        />
        <StatCard
          title="Prescriptions Issued"
          value={stats?.totalPrescriptions || 342}
          icon={<FileText size={20} />}
          bg="bg-emerald-500"
          trend="+8% this week"
          trendColor="text-emerald-500"
        />
        <StatCard
          title="AI Diagnoses"
          value={stats?.totalDiagnoses || 89}
          icon={<Activity size={20} />}
          bg="bg-amber-500"
          trend="+23% accuracy boost"
          trendColor="text-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area: Weekly Trends Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100/60 p-6 flex flex-col justify-center items-center h-72">
          <h3 className="text-sm font-semibold text-slate-800 w-full text-left mb-6">
            Smart Tool Access
          </h3>
          <div className="w-full flex justify-center gap-6">
            <Link
              to="/smart-diagnosis"
              className="w-full shrink-0 max-w-xs group p-5 rounded-xl border border-slate-200 bg-white hover:border-teal-500 hover:shadow-lg transition-all text-center"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md">
                <Activity size={24} />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">
                Run Smart Diagnosis
              </h4>
              <p className="text-xs text-slate-500">
                Analyze clinical symptoms now.
              </p>
            </Link>
            <Link
              to="/prescriptions/new"
              className="w-full shrink-0 max-w-xs group p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-lg transition-all text-center"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md">
                <FileText size={24} />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">
                New Prescription
              </h4>
              <p className="text-xs text-slate-500">Generate an instant PDF.</p>
            </Link>
          </div>
        </div>

        {/* Appointment Status Circle Placeholder (using CSS) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100/60 p-6">
          <h3 className="text-sm font-semibold text-slate-800 mb-6">
            Appointment Status
          </h3>
          <div className="flex justify-center items-center py-4">
            {/* CSS Donut visual hack for demo */}
            <div
              className="relative w-40 h-40 rounded-full flex items-center justify-center"
              style={{
                background:
                  "conic-gradient(#10b981 0% 65%, #3b82f6 65% 90%, #ef4444 90% 100%)",
              }}
            >
              <div className="w-28 h-28 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="mt-4 px-2 space-y-2">
            <div className="flex justify-between items-center text-xs font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-slate-600">Completed</span>
              </div>
              <span className="text-slate-800 font-bold">65%</span>
            </div>
            <div className="flex justify-between items-center text-xs font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-slate-600">Scheduled</span>
              </div>
              <span className="text-slate-800 font-bold">25%</span>
            </div>
            <div className="flex justify-between items-center text-xs font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-slate-600">Cancelled</span>
              </div>
              <span className="text-slate-800 font-bold">10%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule Table exactly as in mockup */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100/60 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-slate-800">
            Today's Schedule
          </h3>
          <Link
            to="/appointments"
            className="text-slate-400 hover:text-slate-600"
          >
            <ChevronRight size={18} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-slate-400 font-medium uppercase tracking-wider bg-slate-50/50">
              <tr>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {STATIC_SCHEDULE.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {item.patient}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.time}</td>
                  <td className="px-6 py-4 text-slate-500">{item.type}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-[10px] font-bold rounded-full border ${item.statusColor}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const STAT_BG_CLASSES = {
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  blue: "border-blue-200 bg-blue-50 text-blue-700",
};

const STATIC_SCHEDULE = [
  {
    patient: "Ayesha Khan",
    time: "09:00 AM",
    type: "Follow-up",
    status: "Completed",
    statusColor: STAT_BG_CLASSES.emerald,
  },
  {
    patient: "Bilal Ahmed",
    time: "10:30 AM",
    type: "Consultation",
    status: "In Progress",
    statusColor: STAT_BG_CLASSES.amber,
  },
  {
    patient: "Sara Malik",
    time: "11:00 AM",
    type: "Check-up",
    status: "Scheduled",
    statusColor: STAT_BG_CLASSES.blue,
  },
  {
    patient: "Usman Ali",
    time: "02:00 PM",
    type: "Diagnosis",
    status: "Scheduled",
    statusColor: STAT_BG_CLASSES.blue,
  },
  {
    patient: "Fatima Noor",
    time: "03:30 PM",
    type: "Follow-up",
    status: "Scheduled",
    statusColor: STAT_BG_CLASSES.blue,
  },
];

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

export default DoctorDashboard;
