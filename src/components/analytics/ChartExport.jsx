import { exportChartDataToCSV } from '../../utils/analyticsExport';
import Button from '../common/Button';

const ChartExport = ({ data, filename, headers }) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }
    exportChartDataToCSV(data, filename, headers);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleExport}
      className="text-gray-600 hover:text-primary-600"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </Button>
  );
};

export default ChartExport;
