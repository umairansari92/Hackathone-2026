import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";

/**
 * Modern Alert Component (non-dismissing variant)
 */
export const Alert = ({
  type = "info",
  title,
  message,
  action = null,
  className = "",
}) => {
  const typeConfig = {
    info: {
      icon: Info,
      bg: "from-blue-50 to-blue-50",
      border: "border-blue-200/50",
      text: "text-blue-700",
      accent: "bg-blue-500",
    },
    success: {
      icon: CheckCircle,
      bg: "from-emerald-50 to-emerald-50",
      border: "border-emerald-200/50",
      text: "text-emerald-700",
      accent: "bg-emerald-500",
    },
    warning: {
      icon: AlertTriangle,
      bg: "from-amber-50 to-amber-50",
      border: "border-amber-200/50",
      text: "text-amber-700",
      accent: "bg-amber-500",
    },
    error: {
      icon: AlertCircle,
      bg: "from-rose-50 to-rose-50",
      border: "border-rose-200/50",
      text: "text-rose-700",
      accent: "bg-rose-500",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-4 border ${config.border} bg-gradient-to-r ${config.bg} ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className={`${config.accent} p-2 rounded-lg text-white flex-shrink-0`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          {title && <h4 className={`font-bold ${config.text}`}>{title}</h4>}
          {message && <p className={`text-sm ${config.text} mt-1`}>{message}</p>}
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className={`text-sm font-bold px-3 py-1.5 rounded-lg ${config.accent} text-white hover:opacity-90 transition-opacity flex-shrink-0`}
          >
            {action.label}
          </button>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Toast Notification (with auto-dismiss)
 */
export const Toast = ({ type = "info", title, message, duration = 4000, onClose }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    info: { bg: "from-blue-500 to-blue-600", icon: Info },
    success: { bg: "from-emerald-500 to-emerald-600", icon: CheckCircle },
    warning: { bg: "from-amber-500 to-amber-600", icon: AlertTriangle },
    error: { bg: "from-rose-500 to-rose-600", icon: AlertCircle },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`bg-gradient-to-r ${config.bg} text-white rounded-xl p-4 shadow-2xl flex items-start gap-3 max-w-sm`}
    >
      <Icon size={20} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h4 className="font-bold">{title}</h4>}
        {message && <p className="text-sm opacity-90">{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default Alert;
