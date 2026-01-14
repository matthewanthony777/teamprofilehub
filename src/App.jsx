import { useContext } from 'react';
import { AppContext } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import EmployeeList from './components/employees/EmployeeList';
import EmployeeDetail from './components/employees/EmployeeDetail';
import EmployeeForm from './components/employees/EmployeeForm';
import SkillsCatalog from './components/skills/SkillsCatalog';
import EducationCatalog from './components/education/EducationCatalog';
import Analytics from './components/analytics/Analytics';
import { VIEWS } from './constants';

function App() {
  const { currentView } = useContext(AppContext);

  const renderView = () => {
    switch (currentView) {
      case VIEWS.DASHBOARD:
        return <Dashboard />;
      case VIEWS.EMPLOYEES:
        return <EmployeeList />;
      case VIEWS.EMPLOYEE_DETAIL:
        return <EmployeeDetail />;
      case VIEWS.EMPLOYEE_FORM:
        return <EmployeeForm />;
      case VIEWS.SKILLS:
        return <SkillsCatalog />;
      case VIEWS.EDUCATION:
        return <EducationCatalog />;
      case VIEWS.ANALYTICS:
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return <Layout>{renderView()}</Layout>;
}

export default App;
