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
      bg: "rgba(2, 132, 199, 0.05)",
      border: "1px solid rgba(2, 132, 199, 0.2)",
      text: "var(--info)",
      accent: "var(--info)",
    },
    success: {
      icon: CheckCircle,
      bg: "rgba(16, 185, 129, 0.05)",
      border: "1px solid rgba(16, 185, 129, 0.2)",
      text: "var(--success)",
      accent: "var(--success)",
    },
    warning: {
      icon: AlertTriangle,
      bg: "rgba(245, 158, 11, 0.05)",
      border: "1px solid rgba(245, 158, 11, 0.2)",
      text: "var(--warning)",
      accent: "var(--warning)",
    },
    error: {
      icon: AlertCircle,
      bg: "rgba(239, 68, 68, 0.05)",
      border: "1px solid rgba(239, 68, 68, 0.2)",
      text: "var(--danger)",
      accent: "var(--danger)",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: config.bg,
        border: config.border,
      }}
      className={`glass-card p-4 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div
          style={{ background: config.accent }}
          className="p-2 rounded-lg text-white flex-shrink-0"
        >
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 style={{ color: config.text }} className="font-bold">
              {title}
            </h4>
          )}
          {message && (
            <p style={{ color: config.text }} className="text-sm mt-1">
              {message}
            </p>
          )}
        </div>
        {action && (
          <button
            onClick={action.onClick}
            style={{
              background: config.accent,
              color: "white",
            }}
            className="text-sm font-bold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity flex-shrink-0"
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
    info: { bg: "var(--info)", icon: Info },
    success: { bg: "var(--success)", icon: CheckCircle },
    warning: { bg: "var(--warning)", icon: AlertTriangle },
    error: { bg: "var(--danger)", icon: AlertCircle },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      style={{ background: config.bg }}
      className="text-white rounded-xl p-4 shadow-2xl flex items-start gap-3 max-w-sm"
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
