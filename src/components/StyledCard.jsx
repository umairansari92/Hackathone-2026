import { motion } from "framer-motion";

/**
 * Reusable Styled Card Component
 * Modern glassmorphism with animations
 */
export const StyledCard = ({
  variant = "default",
  children,
  hover = true,
  className = "",
  ...props
}) => {
  const variants = {
    default:
      "glass-card",
    primary:
      "glass-card bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200/30",
    secondary:
      "glass-card bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/30",
    dark: "bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/30 shadow-2xl text-white",
  };

  return (
    <motion.div
      whileHover={
        hover ? { y: -4, boxShadow: "0 20px 60px rgba(0,0,0,0.1)" } : {}
      }
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Stat Box Component
 */
export const StatBox = ({ icon: Icon, label, value, trend, color = "teal" }) => {
  const colorMap = {
    teal: { bg: "from-teal-500 to-emerald-600", light: "bg-teal-100" },
    blue: { bg: "from-blue-500 to-cyan-600", light: "bg-blue-100" },
    purple: { bg: "from-purple-500 to-pink-600", light: "bg-purple-100" },
    orange: { bg: "from-orange-500 to-rose-600", light: "bg-orange-100" },
  };

  return (
    <StyledCard hover className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`bg-gradient-to-br ${colorMap[color].bg} p-3 rounded-2xl text-white shadow-lg`}
        >
          <Icon size={24} />
        </div>
      </div>
      <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wide mb-2">
        {label}
      </h3>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-black text-slate-900">{value}</p>
        {trend && (
          <span
            className={`text-xs font-bold ${trend.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}
          >
            {trend}
          </span>
        )}
      </div>
    </StyledCard>
  );
};

/**
 * Badge Component
 */
export const Badge = ({
  text,
  color = "teal",
  size = "md",
  variant = "solid",
}) => {
  const colors = {
    teal: { solid: "bg-teal-100 text-teal-700", outline: "border border-teal-300 text-teal-700" },
    blue: { solid: "bg-blue-100 text-blue-700", outline: "border border-blue-300 text-blue-700" },
    green: {
      solid: "bg-emerald-100 text-emerald-700",
      outline: "border border-emerald-300 text-emerald-700",
    },
    red: { solid: "bg-rose-100 text-rose-700", outline: "border border-rose-300 text-rose-700" },
    yellow: {
      solid: "bg-amber-100 text-amber-700",
      outline: "border border-amber-300 text-amber-700",
    },
  };

  const sizeMap = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`font-bold rounded-full inline-block ${colors[color][variant]} ${sizeMap[size]}`}
    >
      {text}
    </span>
  );
};

/**
 * Button Group Component
 */
export const ButtonGroup = ({ children, className = "" }) => {
  return <div className={`flex gap-2 flex-wrap ${className}`}>{children}</div>;
};

export default StyledCard;
