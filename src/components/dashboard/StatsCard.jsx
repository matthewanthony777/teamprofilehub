const StatsCard = ({ title, value, icon, gradient = 'primary' }) => {
  const gradientConfigs = {
    primary: {
      bg: 'from-blue-500 to-blue-600',
      bgLight: 'from-blue-50 to-purple-50',
      shadow: 'shadow-blue-500/20 hover:shadow-blue-500/30',
      text: 'text-white',
    },
    secondary: {
      bg: 'from-emerald-500 to-emerald-600',
      bgLight: 'from-emerald-50 to-green-50',
      shadow: 'shadow-emerald-500/20 hover:shadow-emerald-500/30',
      text: 'text-white',
    },
    accent: {
      bg: 'from-amber-500 to-orange-600',
      bgLight: 'from-amber-50 to-orange-50',
      shadow: 'shadow-amber-500/20 hover:shadow-amber-500/30',
      text: 'text-white',
    },
    info: {
      bg: 'from-purple-500 to-pink-600',
      bgLight: 'from-purple-50 to-pink-50',
      shadow: 'shadow-purple-500/20 hover:shadow-purple-500/30',
      text: 'text-white',
    },
  };

  const config = gradientConfigs[gradient];

  return (
    <div className={`group relative overflow-hidden bg-gradient-to-br ${config.bg} rounded-2xl p-6 shadow-xl ${config.shadow} hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in`}>
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          {icon && (
            <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
              <div className={config.text}>
                {icon}
              </div>
            </div>
          )}
          <span className="text-white/60 text-xs font-medium">Live</span>
        </div>
        <p className="text-white/80 text-sm font-medium mb-2">{title}</p>
        <p className={`text-4xl font-bold ${config.text} mb-1`}>{value}</p>
        <div className="flex items-center gap-1 text-white/60 text-xs">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span>Real-time data</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
