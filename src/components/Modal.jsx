import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/**
 * Modern Modal/Dialog Component
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actions = [],
  size = "md",
  type = "dialog",
}) => {
  const sizeMap = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 30 }}
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] ${sizeMap[size]}`}
          >
            <div className="glass-card p-6 max-h-[90vh] overflow-y-auto custom-scrollbar bg-[var(--surface)]">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border)]">
                <h2 className="text-2xl font-black text-[var(--text-primary)]">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[var(--hover)] rounded-lg transition-colors"
                >
                  <X size={20} className="text-[var(--text-secondary)]" />
                </button>
              </div>

              {/* Content */}
              <div className="mb-6">
                {typeof children === "function" ? children({ close: onClose }) : children}
              </div>

              {/* Actions */}
              {actions.length > 0 && (
                <div className="flex gap-3 justify-end pt-4 border-t border-[var(--border)]">
                  {actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        action.onClick?.();
                        if (action.closeOnClick) onClose();
                      }}
                      className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
                        action.variant === "primary"
                          ? "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-lg shadow-[var(--accent)]/30"
                          : action.variant === "danger"
                            ? "bg-[var(--danger)] hover:opacity-90 text-white"
                            : "bg-[var(--hover)] hover:bg-[var(--border)] text-[var(--text-primary)]"
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
