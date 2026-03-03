import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

/**
 * Modern Data Table Component
 * Responsive grid-based table with sorting & filtering
 */
export const DataTable = ({
  columns,
  data,
  onRowClick = () => {},
  striped = true,
  hoverable = true,
  className = "",
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      {/* Table Header */}
      <div className="hidden md:grid gap-4 p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200/50 font-bold text-sm text-slate-700 uppercase tracking-wide"
        style={{
          gridTemplateColumns: columns.map((col) => col.width || "1fr").join(" "),
        }}>
        {columns.map((col) => (
          <div key={col.key} className="flex items-center gap-2 cursor-pointer hover:text-teal-700 transition-colors">
            {col.label}
            {col.sortable && <ChevronUp size={14} className="opacity-40" />}
          </div>
        ))}
      </div>

      {/* Table Body */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="divide-y divide-slate-200/50"
      >
        {data.map((row, idx) => (
          <motion.div
            key={row._id || idx}
            variants={rowVariants}
            className={`grid gap-4 p-5 items-center cursor-pointer transition-all ${
              hoverable ? "hover:bg-teal-50" : ""
            } ${striped && idx % 2 === 0 ? "bg-slate-50/30" : ""}`}
            style={{
              gridTemplateColumns: columns
                .map((col) => col.width || "1fr")
                .join(" "),
            }}
            onClick={() => onRowClick(row)}
          >
            {columns.map((col) => (
              <div key={col.key}>
                {col.render ? (
                  col.render(row[col.key], row)
                ) : col.type === "status" ? (
                  <span
                    className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${
                      row[col.key] === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : row[col.key] === "Inactive"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {row[col.key]}
                  </span>
                ) : col.type === "email" ? (
                  <a
                    href={`mailto:${row[col.key]}`}
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    {row[col.key]}
                  </a>
                ) : (
                  <span className="text-slate-700 font-medium">{row[col.key]}</span>
                )}
              </div>
            ))}
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-slate-600 font-semibold">No data available</p>
          <p className="text-slate-500 text-sm">Try adjusting your filters or search criteria</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;
