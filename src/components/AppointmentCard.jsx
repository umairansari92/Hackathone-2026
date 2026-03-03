import { motion } from "framer-motion";
import { Calendar, Clock, Stethoscope, MapPin, User, CheckCircle, AlertCircle, XCircle } from "lucide-react";

export const AppointmentCard = ({ appointment, onClick = () => {}, variant = "default" }) => {
  const statusConfig = {
    Scheduled: {
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      icon: Clock,
      badge: "Upcoming",
    },
    "In Progress": {
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      icon: AlertCircle,
      badge: "In Progress",
    },
    Completed: {
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      icon: CheckCircle,
      badge: "Completed",
    },
    Cancelled: {
      color: "from-rose-500 to-red-600",
      bgColor: "bg-rose-50",
      textColor: "text-rose-700",
      icon: XCircle,
      badge: "Cancelled",
    },
  };

  const status = statusConfig[appointment?.status] || statusConfig.Scheduled;
  const StatusIcon = status.icon;

  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        onClick={onClick}
        className={`glass-card p-4 cursor-pointer ${status.bgColor}`}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-bold text-slate-900">{appointment?.patientName}</h4>
            <p className="text-xs text-slate-600">{appointment?.doctorName}</p>
          </div>
          <StatusIcon size={18} className={status.textColor} />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Clock size={14} />
          {appointment?.time}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`glass-card p-6 cursor-pointer relative overflow-hidden group ${status.bgColor}`}
    >
      {/* Gradient accent */}
      <div
        className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${status.color} opacity-5 blur-3xl -z-10 group-hover:opacity-10 transition-opacity`}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${status.color}`} />
            <span className={`text-xs font-bold uppercase tracking-widest ${status.textColor}`}>
              {status.badge}
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900">{appointment?.patientName}</h3>
        </div>
        <StatusIcon size={24} className={status.textColor} />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Stethoscope size={16} className="text-teal-600 flex-shrink-0" />
          <span className="text-slate-700 font-medium">{appointment?.doctorName}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-teal-600 flex-shrink-0" />
          <span className="text-slate-700 font-medium">{appointment?.date}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock size={16} className="text-teal-600 flex-shrink-0" />
          <span className="text-slate-700 font-medium">{appointment?.time}</span>
        </div>

        {appointment?.room && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} className="text-teal-600 flex-shrink-0" />
            <span className="text-slate-700 font-medium">Room {appointment.room}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {appointment?.reason && (
        <div className="mb-4 p-3 bg-white/50 rounded-lg border border-slate-200/50">
          <p className="text-xs text-slate-600 font-medium">
            <span className="font-bold text-slate-900">Reason: </span>
            {appointment.reason}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-slate-200/50">
        <button className="flex-1 py-2.5 px-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-lg text-sm transition-all hover:shadow-lg transform hover:-translate-y-0.5">
          View Details
        </button>
        {appointment?.status === "Scheduled" && (
          <button className="flex-1 py-2.5 px-3 border-2 border-rose-300 text-rose-600 hover:bg-rose-50 font-bold rounded-lg text-sm transition-all">
            Cancel
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default AppointmentCard;
