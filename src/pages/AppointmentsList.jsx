import { useGetAppointmentsQuery } from "../store/appointmentApiSlice";
import { useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  User,
  Activity,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import dayjs from "dayjs";

const AppointmentsList = () => {
  const {
    data: appointments,
    isLoading,
    isError,
    error,
  } = useGetAppointmentsQuery();
  const { user } = useSelector((state) => state.auth);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (isError) {
    return (
      <div className="p-8 text-red-500 text-center">
        Error loading appointments: {error?.data?.message || "Unknown error"}
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Completed":
        return "bg-teal-100 text-teal-700 border-teal-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Scheduled":
        return <Clock size={14} className="mr-1" />;
      case "Completed":
        return <CheckCircle2 size={14} className="mr-1" />;
      case "Cancelled":
        return <XCircle size={14} className="mr-1" />;
      default:
        return <Activity size={14} className="mr-1" />;
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Schedule Overview
          </h2>
          <p className="text-slate-500 mt-1">
            {user?.role === "Patient"
              ? "Your upcoming and past clinic visits."
              : "Manage all clinic appointments and schedules."}
          </p>
        </div>

        {user?.role !== "Patient" && (
          <div className="flex gap-2">
            <select className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-gradient-to-r from-slate-50 to-white">
          <Calendar size={20} className="text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-800">
            Appointments{" "}
            <span className="text-sm font-normal text-slate-500 ml-2">
              ({appointments?.length || 0} records)
            </span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Date & Time
                </th>
                {user?.role !== "Patient" && (
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Patient Details
                  </th>
                )}
                {user?.role !== "Doctor" && (
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Assigned Doctor
                  </th>
                )}
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments?.map((appt) => (
                <tr
                  key={appt._id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">
                        {dayjs(appt.date).format("MMM DD, YYYY")}
                      </span>
                      <span className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock size={12} /> {dayjs(appt.date).format("hh:mm A")}
                      </span>
                    </div>
                  </td>

                  {user?.role !== "Patient" && (
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                          <User size={14} />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800 block">
                            {appt.patientId?.name || "Unknown"}
                          </span>
                          <span className="text-xs text-slate-400">
                            {appt.patientId?.contact}
                          </span>
                        </div>
                      </div>
                    </td>
                  )}

                  {user?.role !== "Doctor" && (
                    <td className="p-4">
                      <div className="text-sm text-slate-800 font-medium">
                        Dr.{" "}
                        {appt.doctorId?.fullname?.split(" ")[1] ||
                          appt.doctorId?.fullname ||
                          "Unassigned"}
                      </div>
                    </td>
                  )}

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(appt.status)}`}
                    >
                      {getStatusIcon(appt.status)}
                      {appt.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    {user?.role !== "Patient" && appt.status === "Scheduled" ? (
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-xs font-medium text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-md transition-colors">
                          Complete
                        </button>
                        <button className="text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button className="text-sm font-medium text-indigo-600 hover:underline">
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {(!appointments || appointments.length === 0) && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Calendar size={32} className="text-slate-300" />
                      </div>
                      <p className="text-lg font-medium text-slate-600">
                        No appointments scheduled
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        Your schedule is currently clear.
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

export default AppointmentsList;
