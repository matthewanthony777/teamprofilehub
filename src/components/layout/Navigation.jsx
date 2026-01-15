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
    <nav className="flex items-center gap-1">
      {navItems.map((item) => (
        <button
          key={item.view}
          onClick={() => setCurrentView(item.view)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            currentView === item.view
              ? 'bg-accent-primary text-white'
              : 'text-gray-400 hover:text-white hover:bg-dark-card'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
