const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-6 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between mb-4">
        {icon && (
          <div className="w-10 h-10 bg-dark-card border border-dark-border rounded-lg flex items-center justify-center">
            <div className="text-accent-primary">
              {icon}
            </div>
          </div>
        )}
      </div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{title}</p>
      <p className="text-3xl font-semibold text-white">{value}</p>
    </div>
  );
};

export default StatsCard;
