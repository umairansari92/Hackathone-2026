import { motion } from "framer-motion";
import { Calendar, Clock, Stethoscope, MapPin, User, CheckCircle, AlertCircle, XCircle } from "lucide-react";

export const AppointmentCard = ({ appointment, onClick = () => {}, variant = "default" }) => {
  const statusConfig = {
    Scheduled: {
      color: "var(--info)",
      bgColor: "rgba(2, 132, 199, 0.05)",
      textColor: "var(--info)",
      icon: Clock,
      badge: "Upcoming",
    },
    "In Progress": {
      color: "var(--warning)",
      bgColor: "rgba(245, 158, 11, 0.05)",
      textColor: "var(--warning)",
      icon: AlertCircle,
      badge: "In Progress",
    },
    Completed: {
      color: "var(--success)",
      bgColor: "rgba(16, 185, 129, 0.05)",
      textColor: "var(--success)",
      icon: CheckCircle,
      badge: "Completed",
    },
    Cancelled: {
      color: "var(--danger)",
      bgColor: "rgba(239, 68, 68, 0.05)",
      textColor: "var(--danger)",
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
        style={{ background: status.bgColor }}
        className={`glass-card p-4 cursor-pointer`}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-bold text-(--text-primary)">{appointment?.patientName}</h4>
            <p className="text-xs text-(--text-muted)">{appointment?.doctorName}</p>
          </div>
          <StatusIcon size={18} style={{ color: status.textColor }} />
        </div>
        <div className="flex items-center gap-2 text-xs text-(--text-muted)">
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
      style={{ background: status.bgColor }}
      className={`glass-card p-6 cursor-pointer relative overflow-hidden group`}
    >
      {/* Gradient accent */}
      <div
        className="absolute top-0 right-0 w-48 h-48 opacity-5 blur-3xl -z-10 group-hover:opacity-10 transition-opacity"
        style={{ background: `linear-gradient(135deg, ${status.color}, ${status.textColor})` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ background: status.color }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: status.textColor }}>
              {status.badge}
            </span>
          </div>
          <h3 className="text-lg font-black text-(--text-primary)">{appointment?.patientName}</h3>
        </div>
        <StatusIcon size={24} style={{ color: status.textColor }} />
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Stethoscope size={16} style={{ color: "var(--accent)" }} className="shrink-0" />
          <span className="text-(--text-secondary) font-medium">{appointment?.doctorName}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} style={{ color: "var(--accent)" }} className="shrink-0" />
          <span className="text-(--text-secondary) font-medium">{appointment?.date}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock size={16} style={{ color: "var(--accent)" }} className="shrink-0" />
          <span className="text-(--text-secondary) font-medium">{appointment?.time}</span>
        </div>

        {appointment?.room && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} style={{ color: "var(--accent)" }} className="shrink-0" />
            <span className="text-(--text-secondary) font-medium">Room {appointment.room}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {appointment?.reason && (
        <div className="mb-4 p-3 bg-(--surface)/50 rounded-lg border border-(--border)">
          <p className="text-xs text-(--text-muted) font-medium">
            <span className="font-bold text-(--text-primary)">Reason: </span>
            {appointment.reason}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-(--border)">
        <button className="flex-1 py-2.5 px-3 bg-(--accent) hover:bg-(--accent-hover) text-white font-bold rounded-lg text-sm transition-all hover:shadow-lg transform hover:-translate-y-0.5">
          View Details
        </button>
        {appointment?.status === "Scheduled" && (
          <button className="flex-1 py-2.5 px-3 border-2 border-(--danger)/30 text-(--danger) hover:bg-(--danger)/5 font-bold rounded-lg text-sm transition-all">
            Cancel
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default AppointmentCard;
