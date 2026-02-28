import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetPatientsQuery } from "../store/patientApiSlice";
import {
  Users,
  UserPlus,
  Calendar,
  Activity,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const ReceptionistDashboard = () => {
  const { data: patients, isLoading } = useGetPatientsQuery();
  const { user } = useSelector((state) => state.auth);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

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
            Welcome back, {user?.fullname || "Receptionist"} — here's today's
            overview
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Registered"
          value={patients?.length || 1248}
          icon={<Users size={20} />}
          bg="bg-teal-500"
          trend="+12% from last month"
          trendColor="text-emerald-500"
        />
        <StatCard
          title="Today's Appointments"
          value="18"
          icon={<Calendar size={20} />}
          bg="bg-blue-500"
          trend="8 remaining"
          trendColor="text-slate-500"
        />
        <StatCard
          title="Active Doctors"
          value="4"
          icon={<Activity size={20} />}
          bg="bg-emerald-500"
          trend="On duty"
          trendColor="text-emerald-500"
        />
        <div
          className="bg-white rounded-2xl shadow-sm border border-slate-100/60 p-6 flex flex-col justify-center items-center hover:shadow-md transition-shadow hover:border-teal-300 group cursor-pointer"
          onClick={() => setShowAddPatientModal(true)}
        >
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-2 group-hover:bg-teal-500 group-hover:text-white transition-colors text-teal-600">
            <UserPlus size={24} />
          </div>
          <p className="text-sm font-bold text-slate-700">
            Register New Patient
          </p>
        </div>
      </div>

      {/* Main Table Section exactly matching mockup style */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100/60 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <h3 className="text-sm font-semibold text-slate-800">
            Recent Patient Registry
          </h3>
          <Link
            to="/patients"
            className="text-sm text-slate-400 hover:text-slate-600 font-medium flex items-center"
          >
            View Directory <ChevronRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-[10px] text-slate-400 font-medium uppercase tracking-wider bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Demographics</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {patients?.slice(0, 5).map((patient) => (
                <tr
                  key={patient._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {patient.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <span className="mr-2">{patient.age} yrs</span>
                    <span>{patient.gender}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {patient.contact}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="px-3 py-1 text-[10px] font-bold rounded-full border border-teal-200 bg-teal-50 text-teal-700 cursor-pointer hover:bg-teal-500 hover:text-white transition-colors">
                      Book Appt
                    </span>
                  </td>
                </tr>
              ))}
              {(!patients || patients.length === 0) && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No patients registered yet. Add a new patient.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simplified Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl transform scale-100 transition-transform">
            <h3 className="text-2xl font-bold mb-2 text-slate-800">
              Register Patient
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              This triggers the full form in the actual app.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddPatientModal(false)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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

export default ReceptionistDashboard;
