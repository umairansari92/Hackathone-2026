import {
  Calendar,
  FileText,
  Activity,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const PatientDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6 pb-8 bg-[#f8fafc] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Dashboard
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Welcome back, {user?.fullname || "Patient"} — here is your health
            overview
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-100 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck size={14} /> Official Patient
          </span>
          <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={14} /> {user?.subscriptionPlan || "Free"} Plan
          </span>
        </div>
      </div>

      {/* Actionable Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/appointments"
          className="bg-white p-6 rounded-2xl border border-slate-100/60 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition-all group h-48 cursor-pointer relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-sm">
              <Calendar size={24} />
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-lg text-slate-800 mb-1">
              My Appointments
            </h3>
            <p className="text-xs text-slate-500">
              View your upcoming and past clinic visits.
            </p>
          </div>
        </Link>

        <Link
          to="/prescriptions"
          className="bg-white p-6 rounded-2xl border border-slate-100/60 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-emerald-300 transition-all group h-48 cursor-pointer relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-sm">
              <FileText size={24} />
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-lg text-slate-800 mb-1">
              Prescriptions
            </h3>
            <p className="text-xs text-slate-500">
              Access your medical prescriptions and PDFs.
            </p>
          </div>
        </Link>

        <Link
          to="/smart-diagnosis"
          className="bg-white p-6 rounded-2xl border border-slate-100/60 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-amber-300 transition-all group h-48 cursor-pointer relative overflow-hidden"
        >
          <div className="flex justify-between items-start relative z-10">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-sm">
              <Activity size={24} />
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-amber-500 transition-colors" />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-lg text-slate-800 mb-1">
              AI Symptom Checker
            </h3>
            <p className="text-xs text-slate-500">
              Analyze your conditions using advanced AI.
            </p>
          </div>
        </Link>
      </div>

      {/* Main Table Section exactly matching mockup style */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100/60 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="text-sm font-semibold text-slate-800">
            Upcoming Schedule
          </h3>
          <Link
            to="/appointments"
            className="text-sm text-slate-400 hover:text-slate-600 font-medium flex items-center"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-slate-400 font-medium uppercase tracking-wider bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-700">
                  Dr. Sarah Jenkins
                </td>
                <td className="px-6 py-4 text-slate-500 flex items-center gap-2">
                  <Clock size={14} /> Today, 10:30 AM
                </td>
                <td className="px-6 py-4 text-slate-500">Follow-up</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-[10px] font-bold rounded-full border border-blue-200 bg-blue-50 text-blue-700">
                    Scheduled
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-700">
                  Dr. Michael Chang
                </td>
                <td className="px-6 py-4 text-slate-500 flex items-center gap-2">
                  <Clock size={14} /> Nov 15, 02:00 PM
                </td>
                <td className="px-6 py-4 text-slate-500">Consultation</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-[10px] font-bold rounded-full border border-teal-200 bg-teal-50 text-teal-700">
                    Confirmed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pro Upgrade Banner styled cleanly */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100/60 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-xl shadow-sm text-indigo-600">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-md font-bold text-indigo-900 mb-1">
              Elevate Your Healthcare
            </h3>
            <p className="text-indigo-700 text-xs">
              Upgrade to Pro to unlock advanced AI health analytics and instant
              priority bookings directly from your dashboard.
            </p>
          </div>
        </div>
        {(!user?.subscriptionPlan || user?.subscriptionPlan === "Free") && (
          <button className="whitespace-nowrap bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2">
            Upgrade to Pro <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
