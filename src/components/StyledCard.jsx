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
  const baseStyles = "glass-card";
  const variantStyles = {
    default: "bg-(--surface)",
    primary: "bg-(--accent)/5 border-(--accent)/20",
    secondary: "bg-(--info)/5 border-(--info)/20",
    dark: "bg-(--surface-2) border border-(--border)",
  };

  return (
    <motion.div
      whileHover={
        hover ? { y: -4, boxShadow: "var(--shadow-lg)" } : {}
      }
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Stat Box Component
 */
export const StatBox = ({ icon: Icon, label, value, trend, color = "accent" }) => {
  const colorMap = {
    accent: "var(--accent)",
    success: "var(--success)",
    warning: "var(--warning)",
    danger: "var(--danger)",
    info: "var(--info)",
  };

  const accentColor = colorMap[color] || colorMap.accent;

  return (
    <StyledCard hover className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-3 rounded-2xl text-white shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, var(--accent-hover))`,
          }}
        >
          <Icon size={24} />
        </div>
      </div>
      <h3 className="text-sm font-bold text-(--text-muted) uppercase tracking-wide mb-2">
        {label}
      </h3>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-black text-(--text-primary)">{value}</p>
        {trend && (
          <span
            className={`text-xs font-bold ${trend.startsWith("+") ? "text-(--success)" : "text-(--danger)"}`}
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
  color = "accent",
  size = "md",
  variant = "solid",
}) => {
  const colorMap = {
    accent: "var(--accent)",
    success: "var(--success)",
    warning: "var(--warning)",
    danger: "var(--danger)",
    info: "var(--info)",
  };

  const sizeMap = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const accentColor = colorMap[color] || colorMap.accent;

  const solidStyle = {
    background: `${accentColor}15`,
    color: accentColor,
  };

  const outlineStyle = {
    border: `1px solid ${accentColor}40`,
    color: accentColor,
  };

  return (
    <span
      className={`font-bold rounded-full inline-block ${sizeMap[size]}`}
      style={variant === "solid" ? solidStyle : outlineStyle}
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
