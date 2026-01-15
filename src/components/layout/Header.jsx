import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { VIEWS } from '../../constants';
import Navigation from './Navigation';

const Header = () => {
  const { setCurrentView, handleExportCSV } = useContext(AppContext);

  return (
    <header className="sticky top-0 z-50 bg-dark-surface/80 backdrop-blur-xl border-b border-dark-border">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo section */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-dark-card border border-dark-border rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-white">SQC Employee Hub</h1>
              <p className="text-xs text-gray-500">Talent Management</p>
            </div>
          </div>

          <Navigation />

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-sm font-medium text-gray-400 bg-dark-card border border-dark-border rounded-lg hover:text-white hover:border-gray-600 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={() => setCurrentView(VIEWS.EMPLOYEE_FORM)}
              className="px-4 py-2 text-sm font-medium text-white bg-accent-primary rounded-lg hover:bg-accent-hover transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Employee
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
