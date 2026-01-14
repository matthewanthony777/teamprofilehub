import Navigation from './Navigation';

const Header = () => {
  return (
    <header className="bg-gradient-primary shadow-strong relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Logo/Icon */}
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-6 h-6 rounded-lg bg-white"></div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              SQC Employee Hub
            </h1>
          </div>
          <Navigation />
        </div>
      </div>
    </header>
  );
};

export default Header;
