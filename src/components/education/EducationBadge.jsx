import { EDUCATION_LEVEL_COLORS } from '../../constants';

const EducationBadge = ({ level, size = 'md' }) => {
  const colorClass = EDUCATION_LEVEL_COLORS[level] || 'bg-gray-100 text-gray-800 border-gray-200';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${colorClass} ${sizeClasses[size]}`}
    >
      {level}
    </span>
  );
};

export default EducationBadge;
