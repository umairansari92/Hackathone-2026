import { useGetPatientsQuery } from "../store/patientApiSlice";
import { Users, Search, Activity, Calendar } from "lucide-react";

const PatientsList = () => {
  const { data: patients, isLoading, isError, error } = useGetPatientsQuery();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (isError) {
    return (
      <div className="p-8 text-red-500 text-center">
        Error loading patients: {error?.data?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Patient Directory
          </h2>
          <p className="text-slate-500 mt-1">
            View and manage all registered clinic patients.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <Search
            className="absolute left-3 top-2.5 text-slate-400"
            size={18}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-gradient-to-r from-slate-50 to-white">
          <Users size={20} className="text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-800">
            Registered Patients{" "}
            <span className="text-sm font-normal text-slate-500 ml-2">
              ({patients?.length || 0} total)
            </span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Patient Info
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Demographics
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Registered By
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Quick Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients?.map((patient) => (
                <tr
                  key={patient._id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 block">
                          {patient.name}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          ID:{" "}
                          {patient._id
                            .substring(patient._id.length - 6)
                            .toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                        {patient.age} yrs
                      </span>
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">
                        {patient.gender}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 font-medium whitespace-nowrap">
                    {patient.contact}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      {patient.createdBy?.fullname || "System"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-2 text-slate-400 hover:text-indigo-600 bg-white hover:bg-slate-50 rounded-full transition-colors border border-transparent hover:border-slate-200"
                        title="View Timeline"
                      >
                        <Activity size={16} />
                      </button>
                      <button
                        className="p-2 text-slate-400 hover:text-teal-600 bg-white hover:bg-slate-50 rounded-full transition-colors border border-transparent hover:border-slate-200"
                        title="Book Appointment"
                      >
                        <Calendar size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {(!patients || patients.length === 0) && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Users size={32} className="text-slate-300" />
                      </div>
                      <p className="text-lg font-medium text-slate-600">
                        No patients found
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        The directory is currently empty.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientsList;
