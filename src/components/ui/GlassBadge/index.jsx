/* eslint-disable react/prop-types */
export const GlassBadge = ({ children, className = "", ...props }) => (
  <div
    className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full backdrop-blur-md bg-[#292929] border border-white/30 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </div>
);
