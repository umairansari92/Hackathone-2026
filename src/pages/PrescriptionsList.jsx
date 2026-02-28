import { useGetPrescriptionsQuery } from "../store/prescriptionApiSlice";
import { useSelector } from "react-redux";
import { FileText, Download, Activity, Calendar } from "lucide-react";
import dayjs from "dayjs";

const PrescriptionsList = () => {
  const {
    data: prescriptions,
    isLoading,
    isError,
    error,
  } = useGetPrescriptionsQuery();
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
        Error loading prescriptions: {error?.data?.message || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Prescription Archive
          </h2>
          <p className="text-slate-500 mt-1">
            {user?.role === "Patient"
              ? "Access and download your medical prescriptions."
              : "Repository of all prescriptions issued by the clinic."}
          </p>
        </div>

        {user?.role === "Doctor" && (
          <button className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors shadow-sm font-medium">
            <FileText size={18} />
            <span>Write New Rx</span>
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2 bg-gradient-to-r from-slate-50 to-white">
          <FileText size={20} className="text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-800">
            Issued Records{" "}
            <span className="text-sm font-normal text-slate-500 ml-2">
              ({prescriptions?.length || 0} total)
            </span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Date Issued
                </th>
                {user?.role !== "Patient" && (
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                )}
                {user?.role !== "Doctor" && (
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Prescribing Doctor
                  </th>
                )}
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Medications
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prescriptions?.map((rx) => (
                <tr
                  key={rx._id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">
                        {dayjs(rx.createdAt).format("MMM DD, YYYY")}
                      </span>
                      <span className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar size={12} />{" "}
                        {dayjs(rx.createdAt).format("hh:mm A")}
                      </span>
                    </div>
                  </td>

                  {user?.role !== "Patient" && (
                    <td className="p-4">
                      <span className="font-semibold text-slate-800 block">
                        {rx.patientId?.name || "Unknown"}
                      </span>
                      <span className="text-xs text-slate-400">
                        ID:{" "}
                        {rx.patientId?._id
                          ?.substring(rx.patientId._id.length - 6)
                          .toUpperCase() || "N/A"}
                      </span>
                    </td>
                  )}

                  {user?.role !== "Doctor" && (
                    <td className="p-4">
                      <div className="text-sm text-slate-800 font-medium">
                        Dr.{" "}
                        {rx.doctorId?.fullname?.split(" ")[1] ||
                          rx.doctorId?.fullname ||
                          "Unassigned"}
                      </div>
                      <span className="text-xs text-slate-400">
                        General Practice
                      </span>
                    </td>
                  )}

                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 items-center max-w-[250px]">
                      {rx.medicines?.slice(0, 2).map((med, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100 truncate max-w-[120px]"
                        >
                          {med.name}
                        </span>
                      ))}
                      {rx.medicines?.length > 2 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          +{rx.medicines.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {user?.role === "Patient" && (
                        <button className="flex items-center gap-1 text-xs font-semibold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-md transition-colors border border-teal-100">
                          <Activity size={12} /> AI Explain
                        </button>
                      )}

                      {rx.pdfUrl ? (
                        <a
                          href={rx.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors border border-indigo-100"
                        >
                          <Download size={12} /> PDF
                        </a>
                      ) : (
                        <button
                          className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-md cursor-not-allowed border border-slate-100"
                          title="PDF unavailable or still generating"
                        >
                          <Download size={12} /> PDF
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {(!prescriptions || prescriptions.length === 0) && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <FileText size={32} className="text-slate-300" />
                      </div>
                      <p className="text-lg font-medium text-slate-600">
                        No prescriptions found
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        {user?.role === "Patient"
                          ? "You have no medical records on file."
                          : "No prescriptions have been issued yet."}
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

export default PrescriptionsList;
