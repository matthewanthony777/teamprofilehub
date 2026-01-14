const StatsCard = ({ title, value, icon, gradient = 'primary' }) => {
  const gradients = {
    primary: 'from-primary-500/10 to-purple-500/10 border-primary-200',
    secondary: 'from-emerald-500/10 to-green-500/10 border-emerald-200',
    accent: 'from-amber-500/10 to-orange-500/10 border-amber-200',
    info: 'from-blue-500/10 to-cyan-500/10 border-blue-200',
  };

  return (
    <div className={`bg-gradient-to-br ${gradients[gradient]} backdrop-blur-sm border rounded-2xl p-6 card-lift shadow-soft animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">{title}</p>
          <p className="text-4xl font-bold text-gray-900 font-display">{value}</p>
        </div>
        {icon && (
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-medium">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
