import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { VIEWS } from '../../constants';

const Navigation = () => {
  const { currentView, setCurrentView } = useContext(AppContext);

  const navItems = [
    { label: 'Dashboard', view: VIEWS.DASHBOARD },
    { label: 'Employees', view: VIEWS.EMPLOYEES },
    { label: 'Skills', view: VIEWS.SKILLS },
    { label: 'Education', view: VIEWS.EDUCATION },
    { label: 'Analytics', view: VIEWS.ANALYTICS }
  ];

  return (
    <nav className="flex gap-2 flex-wrap">
      {navItems.map((item) => (
        <button
          key={item.view}
          onClick={() => setCurrentView(item.view)}
          className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 text-sm ${
            currentView === item.view
              ? 'bg-white text-primary-600 shadow-medium scale-105'
              : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
